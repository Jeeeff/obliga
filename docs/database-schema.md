# Database Schema Documentation

## Visão Geral
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Gerenciamento de Schema:** Prisma Schema (`backend/prisma/schema.prisma`)
- **Multi-tenancy:** Baseado em `workspaceId` (Logical Separation)

## Conexão
A conexão é definida pela variável de ambiente `DATABASE_URL` no arquivo `.env`.
Formato: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

## Tabelas e Estrutura

### Workspace
Tabela raiz para multi-tenancy.
- `id` (String, PK, CUID)
- `name` (String)
- `createdAt` (DateTime)

### User
Usuários do sistema (Admins e Clients).
- `id` (String, PK, CUID)
- `workspaceId` (FK -> Workspace)
- `name` (String)
- `email` (String, Unique)
- `passwordHash` (String)
- `role` (Enum: ADMIN, CLIENT)
- `clientId` (FK -> Client, Nullable) - Vincula usuário a um cliente específico se role=CLIENT.

### Client
Empresas/Clientes gerenciados.
- `id` (String, PK, CUID)
- `workspaceId` (FK -> Workspace)
- `name` (String)
- `email` (String, Nullable)

### Obligation
Obrigações fiscais/legais.
- `id` (String, PK, CUID)
- `workspaceId` (FK -> Workspace)
- `clientId` (FK -> Client)
- `title` (String)
- `type` (Enum: PAYMENT, DOCUMENT, APPROVAL)
- `status` (Enum: PENDING, SUBMITTED, UNDER_REVIEW, APPROVED, CHANGES_REQUESTED, OVERDUE)
- `dueDate` (DateTime)
- `description` (String, Nullable)

### Comment
Comentários em obrigações.
- `id` (String, PK, CUID)
- `workspaceId` (FK -> Workspace)
- `obligationId` (FK -> Obligation)
- `userId` (FK -> User)
- `message` (String)

### Attachment
Anexos em obrigações.
- `id` (String, PK, CUID)
- `workspaceId` (FK -> Workspace)
- `obligationId` (FK -> Obligation)
- `fileName` (String)
- `fileUrl` (String)

### ActivityLog
Log de auditoria e atividades.
- `id` (String, PK, CUID)
- `workspaceId` (FK -> Workspace)
- `actorUserId` (String) - ID do usuário que realizou a ação.
- `entityType` (String) - Ex: OBLIGATION, CLIENT.
- `entityId` (String)
- `action` (String) - Ex: CREATED, STATUS_CHANGED.
- `meta` (Json, Nullable) - Metadados adicionais.

## Diagnóstico
Foi criado um script para validar a conexão e listar o schema atual diretamente do banco de dados.

### Como rodar
1. Certifique-se de que o banco de dados está rodando e acessível via `DATABASE_URL` no `.env`.
2. Execute o script:
   ```bash
   cd backend
   npx ts-node scripts/diagnose-db.ts
   ```

### O que o script faz
1. Tenta conectar ao banco usando o Prisma Client.
2. Consulta `information_schema.tables` para listar tabelas públicas.
3. Consulta `information_schema.columns` para detalhar colunas.
4. Gera uma representação SQL (DDL) aproximada.
5. Conta o número de linhas em cada tabela.
