# Integração OpenClaw

Este documento detalha a integração do OpenClaw como assistente autônomo no Obliga.

## Autenticação

A autenticação é feita via API Key no cabeçalho `x-api-key`. Cada Tenant possui uma chave única.

```http
GET /api/openclaw/summary
x-api-key: <TENANT_API_KEY>
```

### Rate Limiting
- Limite de 100 requisições a cada 15 minutos por IP.

## Endpoints

### 1. Resumo Financeiro
Retorna um sumário de faturas e fluxo de caixa.

**GET** `/api/openclaw/summary`

**Response:**
```json
{
  "tenant": "Nome do Tenant",
  "financials": {
    "totalInvoiced": 15000.00,
    "invoiceCount": 5,
    "netCashFlow": 12000.00
  }
}
```

### 2. Alertas e Pendências
Lista obrigações atrasadas e faturas pendentes vencidas.

**GET** `/api/openclaw/alerts`

**Response:**
```json
{
  "alerts": [
    {
      "type": "OBLIGATION_OVERDUE",
      "message": "Obligation 'DAS' for Cliente X is overdue",
      "entityId": "...",
      "date": "2023-10-01T..."
    }
  ]
}
```

### 3. Criar Fatura
Permite que o OpenClaw gere faturas automaticamente.

**POST** `/api/openclaw/invoice`

**Body:**
```json
{
  "amount": 500.00,
  "dueDate": "2023-11-01T00:00:00Z",
  "status": "PENDING"
}
```

### 4. Projeção de Fluxo de Caixa (Cashflow)
Projeta entradas (faturas) e saídas (obrigações).

**GET** `/api/openclaw/cashflow`

## Webhooks

O Obliga aceita notificações de eventos externos via Webhook.

**POST** `/api/webhooks/openclaw`

**Payload Exemplo:**
```json
{
  "type": "payment_received",
  "tenantId": "...",
  "payload": {
    "invoiceId": "...",
    "amount": 500.00
  }
}
```

### Eventos Suportados
- `payment_received`: Marca fatura como paga.
- `invoice_overdue`: Loga alerta de atraso.
