#!/bin/bash

# Script de Backup Automático para Servidor Obliga
# Uso: 
# 1. Copie para o servidor: scp scripts/remote-backup.sh root@76.13.166.212:/root/
# 2. Conecte no servidor: ssh root@76.13.166.212
# 3. Dê permissão e execute: chmod +x remote-backup.sh && ./remote-backup.sh

# Configurações
TIMESTAMP=$(date +%Y%m%d)
BACKUP_ROOT="/root/backups"
BACKUP_DIR="$BACKUP_ROOT/obliga-$TIMESTAMP"
DB_NAME="obliga_production"
APP_DIR="/root/obliga"

echo "=========================================="
echo " INICIANDO BACKUP - OBLIGA ($TIMESTAMP)"
echo "=========================================="

# 1. Criar pasta de backup
echo "[1/6] Criando diretório de backup..."
mkdir -p "$BACKUP_DIR"
echo "Diretório criado: $BACKUP_DIR"

# 2. Backup do código atual
echo "[2/6] Fazendo backup do código..."
if [ -d "$APP_DIR" ]; then
    cp -r "$APP_DIR" "$BACKUP_DIR/codigo-antigo"
    echo "Código copiado para $BACKUP_DIR/codigo-antigo"
else
    echo "AVISO: Diretório $APP_DIR não encontrado. Pulando backup de código."
fi

# 3. Backup do banco de dados
echo "[3/6] Fazendo backup do banco de dados ($DB_NAME)..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    sudo -u postgres pg_dump "$DB_NAME" > "$BACKUP_DIR/database-backup.sql"
    echo "Banco de dados exportado para $BACKUP_DIR/database-backup.sql"
else
    echo "AVISO: Banco de dados $DB_NAME não encontrado. Tentando listar bancos disponíveis..."
    sudo -u postgres psql -l
fi

# 4. Backup das configurações Nginx
echo "[4/6] Copiando configurações do Nginx..."
if [ -f "/etc/nginx/sites-enabled/api.obliga.devlogicstudio.cloud" ]; then
    cp /etc/nginx/sites-enabled/api.obliga.devlogicstudio.cloud "$BACKUP_DIR/nginx-api.conf"
    echo "Config API Nginx copiada."
fi

if [ -f "/etc/nginx/sites-enabled/obliga.devlogicstudio.cloud" ]; then
    cp /etc/nginx/sites-enabled/obliga.devlogicstudio.cloud "$BACKUP_DIR/nginx-frontend.conf"
    echo "Config Frontend Nginx copiada."
fi

# 5. Backup do .env do backend
echo "[5/6] Copiando .env do backend..."
if [ -f "$APP_DIR/backend/.env" ]; then
    cp "$APP_DIR/backend/.env" "$BACKUP_DIR/env-backup"
    echo "Arquivo .env copiado."
else
    echo "AVISO: $APP_DIR/backend/.env não encontrado."
fi

# 6. Gerar Relatório
echo "[6/6] Gerando RELATORIO.md..."
REPORT_FILE="$BACKUP_DIR/RELATORIO.md"

{
    echo "# Relatório de Backup Obliga - $TIMESTAMP"
    echo ""
    echo "## Informações Gerais"
    echo "- Data: $(date)"
    echo "- Diretório de Backup: $BACKUP_DIR"
    echo ""
    echo "## Tamanhos dos Backups"
    echo "\`\`\`"
    du -sh "$BACKUP_DIR"/* 2>/dev/null
    echo "\`\`\`"
    echo ""
    echo "## Versões do Sistema"
    echo "- Node.js: $(node -v 2>/dev/null || echo 'Não instalado')"
    echo "- PostgreSQL: $(psql --version 2>/dev/null || echo 'Não instalado')"
    echo ""
    echo "## Status PM2"
    echo "\`\`\`"
    pm2 list 2>/dev/null || echo "PM2 não encontrado ou sem permissão"
    echo "\`\`\`"
    echo ""
    echo "## Tabelas no Banco de Dados ($DB_NAME)"
    echo "\`\`\`"
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        sudo -u postgres psql -d "$DB_NAME" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    else
        echo "Banco de dados não acessível para listagem de tabelas."
    fi
    echo "\`\`\`"
} > "$REPORT_FILE"

echo "Relatório gerado em $REPORT_FILE"

echo "=========================================="
echo " BACKUP CONCLUÍDO COM SUCESSO"
echo "=========================================="
echo "Verifique o conteúdo em: $BACKUP_DIR"
ls -lh "$BACKUP_DIR"
