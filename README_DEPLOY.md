# Deployment Guide - Obliga

This guide explains how to deploy the Obliga application (Frontend + Backend).

## Prerequisites
- Node.js 18+
- PostgreSQL Database
- Nginx (for reverse proxy, optional but recommended)

## Environment Variables

### Frontend (.env)
Create a `.env` file in the root directory based on `.env.example`.
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | URL of the backend API | Yes | `http://localhost:3001` |

### Backend (backend/.env)
Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for the backend server | Yes (Default: 3001) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_ACCESS_SECRET` | Secret for access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes |

## Local Development
1. **Backend**
   ```bash
   cd backend
   npm install
   # Configure .env
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

2. **Frontend**
   ```bash
   # Root directory
   npm install
   # Configure .env
   npm run dev
   ```

## Production Deployment

### 1. Backend
```bash
cd backend
npm ci --only=production
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```
*Note: Use PM2 to keep the process running: `pm2 start dist/index.js --name obliga-api`*

### 2. Frontend
```bash
# Root directory
npm ci --only=production
npm run build
npm start
```
*Note: Use PM2 to keep the process running: `pm2 start npm --name obliga-web -- start`*

## Repository Hygiene
- **Do NOT commit**: `.env` files, `node_modules/`, `.next/`, `logs/`.
- **Artifacts**: Build artifacts are excluded via `.gitignore`.
