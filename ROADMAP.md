# Roadmap do Projeto

Status do desenvolvimento e próximos passos.

- [x] **Arquitetura Multi-tenant**
  - [x] Isolamento de dados por `tenantId`
  - [x] Middleware de contexto
  - [x] Registro de novos tenants

- [x] **Módulo de Faturamento**
  - [x] CRUD de Faturas
  - [x] Geração de PDF
  - [x] Envio por Email (Mock/Nodemailer)
  - [x] Simulação de Pagamento (Stripe/Mercado Pago)

- [x] **Integração OpenClaw**
  - [x] Autenticação via API Key
  - [x] Skills customizadas (`/openclaw-skills`)
  - [x] Endpoints dedicados para automação

- [ ] **Dashboard Financeiro**
  - [ ] Gráficos de receita mensal
  - [ ] Indicadores de inadimplência
  - [ ] Fluxo de caixa projetado

- [ ] **Relatórios Avançados**
  - [ ] Exportação CSV/Excel
  - [ ] Relatórios por cliente e período
  - [ ] DRE simplificado

- [ ] **Deploy Produção**
  - [ ] Configuração Dockerfile otimizado
  - [ ] CI/CD Pipeline completo
  - [ ] Monitoramento e Logs (Sentry/Datadog)
