#!/bin/bash

# Script de Correção Crítica do Backend Obliga (VPS)
# Executar como root no servidor

BACKEND_DIR="/root/obliga/backend"
SRC_DIR="$BACKEND_DIR/src"
DIST_DIR="$BACKEND_DIR/dist"

echo "=========================================="
echo " INICIANDO CORREÇÃO DO BACKEND (502 FIX)"
echo "=========================================="

cd "$BACKEND_DIR" || exit 1

# 1. Corrigir src/routes/health.ts
echo "[1/5] Recriando routes/health.ts..."
mkdir -p "$SRC_DIR/routes"
cat > "$SRC_DIR/routes/health.ts" << 'EOF'
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
EOF

# 2. Corrigir src/index.ts
echo "[2/5] Recriando src/index.ts..."
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
import healthRouter from './routes/health' // Added health router

const app = express()

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

# 3. Corrigir .env
echo "[3/5] Limpando e regenerando .env..."

# Backup current env
cp .env .env.bak

# Extract existing valid values if possible, or use defaults
DB_URL=$(grep "^DATABASE_URL=" .env | tail -n 1 | cut -d= -f2- | tr -d '"')
if [ -z "$DB_URL" ]; then
    DB_URL="postgresql://obliga_user:obliga_pass@localhost:5432/obliga_db?schema=public"
fi

# Generate new secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
DATABASE_URL="$DB_URL"
JWT_SECRET="$JWT_SECRET"
JWT_ACCESS_SECRET="$JWT_ACCESS_SECRET"
JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
PORT=3001
NODE_ENV=production
CORS_ORIGINS="https://obliga.devlogicstudio.cloud,http://localhost:3000"
OPENCLAW_WEBHOOK_URL="https://api.obliga.devlogicstudio.cloud/api/webhooks/openclaw"
OPENCLAW_ENABLED=true
EOF

echo ".env recriado com segredos únicos."

# 4. Rebuild e Restart
echo "[4/5] Recompilando e Reiniciando..."
npm install
npm run build

echo "Reiniciando PM2..."
pm2 stop obliga-api || true
pm2 delete obliga-api || true
pm2 start npm --name "obliga-api" -- start
pm2 save

# 5. Validação
echo "[5/5] Validando..."
sleep 5
pm2 list
echo "--- Logs Recentes ---"
pm2 logs obliga-api --lines 20 --nostream

echo "--- Teste de Health ---"
curl -v http://localhost:3001/health

echo "=========================================="
echo " CORREÇÃO CONCLUÍDA"
echo "=========================================="
