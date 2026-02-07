-- 1. Criar tabela Tenant baseada em Workspace
CREATE TABLE IF NOT EXISTS "Tenant" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "plan" TEXT NOT NULL DEFAULT 'FREE',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "openClawApiKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Migrar dados de Workspace para Tenant
-- Verifica se a tabela Workspace existe antes de tentar selecionar dela
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Workspace') THEN
        INSERT INTO "Tenant" (id, name, slug, plan, status, "createdAt")
        SELECT id, name, name, 'PRO', 'ACTIVE', "createdAt"
        FROM "Workspace"
        ON CONFLICT (id) DO NOTHING;
    END IF;
END
$$;

-- 3. Adicionar coluna tenantId em todas as tabelas (se não existir)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "Obligation" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;

-- 4. Copiar workspaceId para tenantId
-- Verifica se a coluna workspaceId existe antes de tentar usar
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'workspaceId') THEN
        UPDATE "User" SET "tenantId" = "workspaceId" WHERE "tenantId" IS NULL;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Client' AND column_name = 'workspaceId') THEN
        UPDATE "Client" SET "tenantId" = "workspaceId" WHERE "tenantId" IS NULL;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Obligation' AND column_name = 'workspaceId') THEN
        UPDATE "Obligation" SET "tenantId" = "workspaceId" WHERE "tenantId" IS NULL;
    END IF;
END
$$;
