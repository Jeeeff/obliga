import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { env } from './config/env'
import { logger } from './utils/logger'
import { requestLogger } from './middleware/request-logger'
import { globalLimiter, authLimiter } from './middleware/rate-limit'
import { errorHandler } from './middleware/error'
import prisma from './utils/prisma'

import authRoutes from './routes/auth'
import clientRoutes from './routes/clients'
import obligationRoutes from './routes/obligations'
import activityRoutes from './routes/activity'
import attachmentRoutes from './routes/attachments'
import tenantRoutes from './routes/tenants'
import openClawRoutes from './routes/openclaw'
import webhookRoutes from './routes/webhooks'
import invoiceRoutes from './routes/invoices'

const app = express()

// Security Headers
app.use(helmet())

// CORS
app.use(cors({
  origin: env.CORS_ORIGINS,
  credentials: true // Only enabled if necessary
}))

// Request Logging
app.use(requestLogger)

// Global Rate Limiting
app.use(globalLimiter)

app.use(express.json())

// Health Checks
app.get('/healthz', (req, res) => {
  res.status(200).send('OK')
})

app.get('/readyz', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).send('Ready')
  } catch (error) {
    logger.error({ err: error }, 'Readiness check failed')
    res.status(500).send('Not Ready')
  }
})

import { authenticate } from './middleware/auth'
import { openClawAuth } from './middleware/openclaw-auth'

// Routes
app.use('/api/auth', authLimiter, authRoutes) // Apply stricter limit to auth
app.use('/api/clients', clientRoutes)
app.use('/api/obligations', obligationRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/attachments', attachmentRoutes)

// Invoices (Support both Frontend/JWT and OpenClaw/ApiKey)
app.use('/api/invoices', authenticate, invoiceRoutes)
// app.use('/api/invoices', openClawAuth, invoiceRoutes) - Removed duplicate, handle inside controller or use different path if needed.
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
