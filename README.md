# Obliga - Sistema SaaS de Gestão Financeira Multi-Tenant

Sistema moderno de gestão financeira e faturamento desenvolvido para suportar múltiplas empresas (multi-tenancy) com segurança, escalabilidade e automação.

## 🚀 Tecnologias

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Backend**: [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Autenticação**: JWT (Access + Refresh Tokens)
- **Estilização**: Tailwind CSS + Shadcn/ui

## 🛠️ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Jeeeff/obliga.git
   cd obliga
   ```

2. **Suba o Banco de Dados**
   ```bash
   docker-compose up -d
   # Aguarde o PostgreSQL iniciar (aprox. 10s)
   ```

3. **Configure o Backend**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   
   # Gere o cliente Prisma e execute as migrações
   npx prisma generate
   npx prisma migrate dev --name init
   
   # Popule o banco com dados de teste
   npm run seed
   
   # Inicie o servidor (porta 3001)
   npm run dev
   ```

4. **Configure o Frontend** (em outro terminal)
   ```bash
   # Volte para a raiz
   cd ..
   npm install
   
   # Inicie o frontend (porta 3000)
   npm run dev
   ```

5. **Acesse o Sistema**
   - URL: http://localhost:3000
   - **Login de Teste (Admin)**:
     - Email: `admin@demo.com`
     - Senha: `admin123`

## 🧪 Testes

O projeto possui testes automatizados para backend e frontend.

```bash
# Backend
cd backend
npm test

# Frontend (E2E)
npm run test:e2e
```

## 📄 Estrutura do Projeto

- `/app`: Frontend Next.js (Páginas e Componentes)
- `/backend`: API Node.js/Express
- `/openclaw-skills`: Scripts de automação para o agente OpenClaw
