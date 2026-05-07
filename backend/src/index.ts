import express from "express"
import cors, { CorsOptions } from "cors"
import helmet from "helmet"
import { env } from "./config/env"
import { logger } from "./utils/logger"
import { requestLogger } from "./middleware/request-logger"
import { globalLimiter, authLimiter } from "./middleware/rate-limit"
import { errorHandler } from "./middleware/error"
import prisma from "./utils/prisma"
import { sendEmail } from "./services/email.service"

import authRoutes from "./routes/auth"
import clientRoutes from "./routes/clients"
import obligationRoutes from "./routes/obligations"
import activityRoutes from "./routes/activity"
import attachmentRoutes from "./routes/attachments"
import tenantRoutes from "./routes/tenants"
import openClawRoutes from "./routes/openclaw"
import webhookRoutes from "./routes/webhooks"
import invoiceRoutes from "./routes/invoices"
import healthRoutes from "./routes/health"
import { authenticate } from "./middleware/auth"

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error("Not allowed by CORS"))
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

// Trust Proxy (Required for Nginx/Reverse Proxy)
app.set("trust proxy", 1)

// Security Headers
app.use(helmet())

// Request Logging
app.use(requestLogger)

// Global Rate Limiting
app.use(globalLimiter)

app.use(express.json())

// Health Check
app.use("/health", healthRoutes)

// Health Checks (Legacy/K8s)
app.get("/healthz", (req, res) => {
  res.status(200).send("OK")
})

app.get("/readyz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).send("Ready")
  } catch (error) {
    logger.error({ err: error }, "Readiness check failed")
    res.status(500).send("Not Ready")
  }
})

// Routes
app.use("/api/auth", authLimiter, authRoutes) // Apply stricter limit to auth
app.use("/uploads/avatars", express.static("uploads/avatars"))
app.use("/api/clients", clientRoutes)
app.use("/api/obligations", obligationRoutes)
app.use("/api/activity", activityRoutes)
app.use("/api/attachments", attachmentRoutes)

// Invoices (Support both Frontend/JWT and OpenClaw/ApiKey)
app.use("/api/invoices", authenticate, invoiceRoutes)
// app.use('/api/invoices', openClawAuth, invoiceRoutes) - Removed duplicate, handle inside controller or use different path if needed.
// Invoices (Support both Frontend/JWT and OpenClaw/Ap
// Actually, I set up the controller to handle both auth types. So one route is enough if middleware allows both?
// No, middleware `authenticate` and `openClawAuth` are different.
// I can chain them or use a combined middleware?
// Or just keep two routes? But they collide if path is same.
// Original:
// app.use('/invoices', authenticate, invoiceRoutes)
// app.use('/api/invoices', openClawAuth, invoiceRoutes)
// If I move everything to /api, I have a collision.
// Maybe OpenClaw uses /api/openclaw/invoices?
// But the user asked for /api/openclaw/* for skills.
// Let's keep /api/auth separate.

app.use('/api/tenants', tenantRoutes)
app.use('/api/openclaw', openClawRoutes)
app.use('/api/webhooks', webhookRoutes)

// Root
app.get('/', (req, res) => {
  res.send('DevLogic Obliga Backend is running')
})

// Error Handling
app.use(errorHandler)

async function runDeadlineNotificationCycle() {
  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const upcoming = await prisma.obligation.findMany({
    where: {
      dueDate: {
        gte: now,
        lte: threeDaysLater,
      },
      status: {
        in: ["PENDING", "SUBMITTED", "UNDER_REVIEW", "CHANGES_REQUESTED"],
      },
    },
    include: { client: true },
  })

  const overdue = await prisma.obligation.findMany({
    where: {
      dueDate: {
        lt: now,
      },
      status: {
        not: "APPROVED",
      },
    },
    include: { client: true },
  })

  const all = [...upcoming, ...overdue]
  if (!all.length) return

  const tenantIds = [...new Set(all.map((o) => o.tenantId))]
  const admins = await prisma.user.findMany({
    where: { tenantId: { in: tenantIds }, role: "ADMIN", email: { not: null } },
    select: { id: true, email: true, name: true, tenantId: true },
  })

  const adminByTenant = new Map<string, { email: string; name: string }>()
  admins.forEach((u) => {
    if (!adminByTenant.has(u.tenantId) && u.email) {
      adminByTenant.set(u.tenantId, { email: u.email, name: u.name })
    }
  })

  const ids = all.map((o) => o.id)
  const logs = await prisma.activityLog.findMany({
    where: {
      entityType: "OBLIGATION",
      entityId: { in: ids },
      action: { in: ["EMAIL_DUE_SOON", "EMAIL_OVERDUE"] },
    },
  })

  const sentDueSoon = new Set(logs.filter((l) => l.action === "EMAIL_DUE_SOON").map((l) => l.entityId))
  const sentOverdue = new Set(logs.filter((l) => l.action === "EMAIL_OVERDUE").map((l) => l.entityId))

  for (const obligation of upcoming) {
    if (sentDueSoon.has(obligation.id)) continue
    const admin = adminByTenant.get(obligation.tenantId)
    if (!admin) continue

    const subject = `Lembrete: obrigação "${obligation.title}" vence em breve`
    const text = `Olá ${admin.name},

A obrigação "${obligation.title}" do cliente ${obligation.client.name} vence em ${obligation.dueDate.toLocaleDateString()}.

Acesse o Obliga para ver os detalhes e evitar atrasos.`

    try {
      await sendEmail({
        to: admin.email,
        subject,
        text,
      })

      await prisma.activityLog.create({
        data: {
          tenantId: obligation.tenantId,
          actorUserId: admin.id,
          entityType: "OBLIGATION",
          entityId: obligation.id,
          action: "EMAIL_DUE_SOON",
          meta: { dueDate: obligation.dueDate },
        },
      })
    } catch (error) {
      logger.error({ err: error }, "Failed to send due soon notification")
    }
  }

  for (const obligation of overdue) {
    if (sentOverdue.has(obligation.id)) continue
    const admin = adminByTenant.get(obligation.tenantId)
    if (!admin) continue

    const subject = `Alerta: obrigação "${obligation.title}" está atrasada`
    const text = `Olá ${admin.name},

A obrigação "${obligation.title}" do cliente ${obligation.client.name} está atrasada desde ${obligation.dueDate.toLocaleDateString()}.

Acesse o Obliga para registrar o andamento e evitar riscos.`

    try {
      await sendEmail({
        to: admin.email,
        subject,
        text,
      })

      await prisma.activityLog.create({
        data: {
          tenantId: obligation.tenantId,
          actorUserId: admin.id,
          entityType: "OBLIGATION",
          entityId: obligation.id,
          action: "EMAIL_OVERDUE",
          meta: { dueDate: obligation.dueDate },
        },
      })
    } catch (error) {
      logger.error({ err: error }, "Failed to send overdue notification")
    }
  }
}

if (require.main === module) {
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`)
  })
  if (env.NODE_ENV !== "test") {
    const intervalHours = 1
    const intervalMs = intervalHours * 60 * 60 * 1000
    runDeadlineNotificationCycle().catch((error) => {
      logger.error({ err: error }, "Initial deadline notification cycle failed")
    })
    setInterval(() => {
      runDeadlineNotificationCycle().catch((error) => {
        logger.error({ err: error }, "Scheduled deadline notification cycle failed")
      })
    }, intervalMs)
  }
}

export default app
