#!/bin/bash

# Script de Configuração do Servidor (Pós-Upload)
# Este script deve ser executado NO SERVIDOR após o upload dos arquivos.

BACKEND_DIR="/root/obliga/backend-new"
FRONTEND_DIR="/root/obliga/frontend-new"
BACKUP_ENV_SRC=$(ls -t /root/backups/obliga-*/env-backup | head -1)

echo "=========================================="
echo " CONFIGURANDO SERVIDOR (backend-new / frontend-new)"
echo "=========================================="

# 1. Configurar Backend
echo "[1/4] Configurando Backend..."
cd "$BACKEND_DIR" || exit
echo "Instalando dependências de produção..."
npm install --production

echo "Configurando .env..."
if [ -f "$BACKUP_ENV_SRC" ]; then
    cp "$BACKUP_ENV_SRC" .env
    
    # Adicionar configurações do OpenClaw se não existirem
    if ! grep -q "OPENCLAW_WEBHOOK_URL" .env; then
        echo "" >> .env
        echo "OPENCLAW_WEBHOOK_URL=\"https://api.obliga.devlogicstudio.cloud/api/webhooks/openclaw\"" >> .env
        echo "OPENCLAW_ENABLED=\"true\"" >> .env
        echo "Configurações OpenClaw adicionadas ao .env"
    else
        echo "Configurações OpenClaw já existem."
    fi
else
    echo "ERRO: Backup do .env não encontrado em $BACKUP_ENV_SRC"
fi

echo "Gerando Prisma Client..."
npx prisma generate

# 2. Configurar Frontend (Se necessário instalação de deps para rodar 'next start')
echo "[2/4] Configurando Frontend..."
cd "$FRONTEND_DIR" || exit
# Se o build (.next) foi enviado, precisamos apenas das dependências de prod para rodar o servidor
echo "Instalando dependências de produção..."
npm install --production

# 3. Configurar Skills
echo "[3/4] Verificando Skills..."
ls -l /root/openclaw-skills/

echo "=========================================="
echo " CONFIGURAÇÃO CONCLUÍDA"
echo "=========================================="
echo "Próximos passos:"
echo "1. Pare o serviço antigo: pm2 stop all"
echo "2. Atualize os caminhos no ecosystem.config.js (se usar PM2) ou links simbólicos"
echo "   Ex: ln -sfn /root/obliga/backend-new /root/obliga/backend"
echo "   Ex: ln -sfn /root/obliga/frontend-new /root/obliga/frontend"
echo "3. Reinicie: pm2 restart all"
