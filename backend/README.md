# Obliga Backend

Node.js + Express + TypeScript + Prisma backend for DevLogic Obliga.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already created with default values for local development.
   ```env
   PORT=3001
   DATABASE_URL="postgresql://obliga:obliga_password@localhost:5432/obliga_db?schema=public"
   ```

3. **Start Database**
   Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

4. **Run Migrations**
   Apply the Prisma schema to the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed Database**
   Populate with demo data (Workspace, Users, Clients, Obligations):
   ```bash
   npm run prisma:seed
   ```

6. **Start Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3001`

## API Endpoints

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register (Dev only)
- `GET /auth/me` - Get current user

### Obligations
- `GET /obligations` - List (params: status, clientId, q)
- `POST /obligations` - Create (Admin)
- `GET /obligations/:id` - Details
- `POST /obligations/:id/submit` - Client submit
- `POST /obligations/:id/approve` - Admin approve
- `POST /obligations/:id/request-changes` - Admin request changes

## Example Usage

**Login (Admin)**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@obliga.com", "password": "password123"}'
```

**List Obligations (with token)**
```bash
curl http://localhost:3001/obligations \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```
