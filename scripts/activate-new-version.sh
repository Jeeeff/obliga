#!/bin/bash

# Script de Ativação e Migração (Blue-Green)
# Executar no servidor como root

APP_ROOT="/root/obliga"
DB_NAME="obliga_production"
SQL_FILE="/root/obliga/migrate-workspace-to-tenant.sql"

echo "=========================================="
echo " INICIANDO MIGRAÇÃO E ATIVAÇÃO (V2)"
echo "=========================================="

# 1. Aplicar Migração de Dados (SQL Manual)
echo "[1/5] Aplicando script SQL de migração..."
if [ -f "$SQL_FILE" ]; then
    sudo -u postgres psql "$DB_NAME" < "$SQL_FILE"
    echo "Script SQL executado."
else
    echo "ERRO: Arquivo $SQL_FILE não encontrado!"
    exit 1
fi

# 2. Aplicar Migrações do Prisma
echo "[2/5] Aplicando Prisma Migrate..."
cd "$APP_ROOT/backend-new" || exit
npx prisma migrate deploy
echo "Prisma Migrate concluído."

# 3. Parar versão antiga
echo "[3/5] Parando serviços antigos..."
pm2 stop obliga-api || true
pm2 stop obliga-front || true

# 4. Trocar pastas (Blue-Green)
echo "[4/5] Trocando versões (Filesystem)..."

# Backend
if [ -d "$APP_ROOT/backend" ]; then
    mv "$APP_ROOT/backend" "$APP_ROOT/backend-old"
fi
mv "$APP_ROOT/backend-new" "$APP_ROOT/backend"

# Frontend
if [ -d "$APP_ROOT/frontend" ]; then
    mv "$APP_ROOT/frontend" "$APP_ROOT/frontend-old"
elif [ -d "$APP_ROOT/app" ]; then
     # Caso o nome antigo seja 'app' (conforme seu input)
     mv "$APP_ROOT/app" "$APP_ROOT/frontend-old"
fi
mv "$APP_ROOT/frontend-new" "$APP_ROOT/app"

echo "Pastas atualizadas."

# 5. Reiniciar Serviços
echo "[5/5] Reiniciando PM2..."

# Backend Start
cd "$APP_ROOT/backend"
pm2 start npm --name "obliga-api" -- start

# Frontend Start
cd "$APP_ROOT/app"
pm2 start npm --name "obliga-front" -- start

pm2 save
echo "PM2 atualizado e salvo."

echo "=========================================="
echo " DEPLOY CONCLUÍDO!"
echo "=========================================="
echo "Verifique os logs:"
echo "pm2 logs obliga-api --lines 20"
echo "pm2 logs obliga-front --lines 20"
