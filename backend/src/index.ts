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

// Routes
app.use('/auth', authLimiter, authRoutes) // Apply stricter limit to auth
app.use('/clients', clientRoutes)
app.use('/obligations', obligationRoutes)
app.use('/activity', activityRoutes)
app.use('/attachments', attachmentRoutes)

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
