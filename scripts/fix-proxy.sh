#!/bin/bash

# Script de Correção de Proxy para Express (VPS)
# Corrige o erro "ERR_ERL_UNEXPECTED_X_FORWARDED_FOR"
# Executar como root no servidor

BACKEND_DIR="/root/obliga/backend"
SRC_DIR="$BACKEND_DIR/src"

echo "=========================================="
echo " CORRIGINDO CONFIGURAÇÃO DE PROXY (Rate Limit)"
echo "=========================================="

cd "$BACKEND_DIR" || exit 1

# 1. Atualizar src/index.ts com 'trust proxy'
echo "[1/3] Adicionando 'app.set(trust proxy, 1)'..."

# Usando cat para garantir a ordem correta das configurações
cat > "$SRC_DIR/index.ts" << 'EOF'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { logger } from './utils/logger'
import { requestLogger } from './middleware/request-logger'
import { globalLimiter, authLimiter } from './middleware/rate-limit'
import { errorHandler } from './middleware/error'
import prisma from './utils/prisma'

// Routes
import authRoutes from './routes/auth'
import clientRoutes from './routes/clients'
import obligationRoutes from './routes/obligations'
import activityRoutes from './routes/activity'
import attachmentRoutes from './routes/attachments'
import tenantRoutes from './routes/tenants'
import openClawRoutes from './routes/openclaw'
import webhookRoutes from './routes/webhooks'
import invoiceRoutes from './routes/invoices'
import healthRouter from './routes/health'

const app = express()

// Trust Proxy (Required for rate-limit behind Nginx)
app.set('trust proxy', 1)

// Security Headers
app.use(helmet())

// CORS
app.use(cors({
  origin: env.CORS_ORIGINS,
  credentials: true
}))

// Request Logging
app.use(requestLogger)

// Health Check (Early return)
app.use(healthRouter)

// Global Rate Limiting
app.use(globalLimiter)

app.use(express.json())

// Native Health Checks
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

// API Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/obligations', obligationRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/attachments', attachmentRoutes)
app.use('/api/invoices', invoiceRoutes)
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
EOF

# 2. Rebuild
echo "[2/3] Recompilando..."
npm run build

# 3. Restart
echo "[3/3] Reiniciando serviço..."
pm2 restart obliga-api

echo "=========================================="
echo " PROXY CORRIGIDO"
echo "=========================================="
