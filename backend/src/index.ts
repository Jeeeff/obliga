import express from "express"
import cors, { CorsOptions } from "cors"
import helmet from "helmet"
import { env } from "./config/env"
import { logger } from "./utils/logger"
import { requestLogger } from "./middleware/request-logger"
import { globalLimiter, authLimiter } from "./middleware/rate-limit"
import { errorHandler } from "./middleware/error"
import prisma from "./utils/prisma"

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

if (require.main === module) {
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`)
  })
}

export default app
