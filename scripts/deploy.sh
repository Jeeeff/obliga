#!/bin/bash

# Script de Deploy (Executar Localmente)
# Requisitos: Git Bash ou WSL, rsync instalado, acesso SSH configurado (chave ou senha)

SERVER_IP="76.13.166.212"
SERVER_USER="root"
REMOTE_BASE="/root/obliga"

echo "=========================================="
echo " INICIANDO DEPLOY PARA $SERVER_IP"
echo "=========================================="

# 1. Build Local
echo "[1/4] Executando Builds Locais..."

echo "-> Build Backend..."
cd backend
npm install
npm run build
cd ..

echo "-> Build Frontend..."
# Nota: Frontend está na raiz, não em 'app/'
npm install
npm run build

# 2. Upload Backend
echo "[2/4] Upload Backend (incluindo dist/)..."
rsync -avz --delete \
  --exclude-from='.rsyncignore' \
  --exclude 'uploads/' \
  ./backend/ $SERVER_USER@$SERVER_IP:$REMOTE_BASE/backend-new/

# 3. Upload Frontend
echo "[3/4] Upload Frontend (incluindo .next/)..."
# Upload da raiz EXCETO backend, scripts, etc. para evitar duplicação ou envio de arquivos desnecessários
rsync -avz --delete \
  --exclude-from='.rsyncignore' \
  --exclude 'backend/' \
  --exclude 'openclaw-skills/' \
  --exclude 'scripts/' \
  --exclude 'README.md' \
  ./ $SERVER_USER@$SERVER_IP:$REMOTE_BASE/frontend-new/

# 4. Upload Skills & Scripts
echo "[4/4] Upload Skills e Scripts..."
rsync -avz ./openclaw-skills/ $SERVER_USER@$SERVER_IP:/root/openclaw-skills/
rsync -avz ./scripts/server-setup.sh $SERVER_USER@$SERVER_IP:/root/server-setup.sh

echo "=========================================="
echo " UPLOAD CONCLUÍDO"
echo "=========================================="
echo "Agora conecte no servidor e execute:"
echo "ssh $SERVER_USER@$SERVER_IP 'chmod +x /root/server-setup.sh && /root/server-setup.sh'"
