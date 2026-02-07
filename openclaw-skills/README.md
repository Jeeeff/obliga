# OpenClaw Skills para Obliga

Este diretório contém scripts customizados (skills) que permitem ao OpenClaw interagir com o ecossistema Obliga de forma autônoma.

## Instalação

1. Copie o conteúdo desta pasta para o diretório de skills do seu agente OpenClaw ou mantenha-o acessível ao ambiente de execução do agente.
2. Certifique-se de ter o Node.js instalado.
3. Configure as variáveis de ambiente necessárias.

## Configuração

Defina as seguintes variáveis de ambiente no sistema onde o OpenClaw está rodando:

```bash
# URL da API do Obliga (Backend)
export OBLIGA_API_URL="http://localhost:3001/api"

# Chave de API do Tenant (Obtida no Painel do Obliga ou DB)
export OBLIGA_API_KEY="sua-chave-api-aqui"
```

## Skills Disponíveis

### 1. Invoice Generator (`invoice-generator.js`)
Gerenciamento completo de faturas: criação, consulta e envio.

**Comandos:**

*   **Criar Fatura:**
    ```bash
    node invoice-generator.js create <clientId> <amount> [description]
    ```
    *Exemplo:* `node invoice-generator.js create cl_123 500.00 "Consultoria"`

*   **Consultar Fatura:**
    ```bash
    node invoice-generator.js get <invoiceId>
    ```

*   **Enviar por Email:**
    ```bash
    node invoice-generator.js send <invoiceId>
    ```

*   **Listar Vencidas:**
    ```bash
    node invoice-generator.js list-overdue
    ```

### 2. Cashflow Monitor (`cashflow-monitor.js`)
Monitora o fluxo de caixa atual e projeções futuras.

**Uso:**
```bash
node cashflow-monitor.js
```

### 3. Payment Tracker (`payment-tracker.js`)
Verifica pagamentos atrasados e obrigações pendentes (Alertas).

**Uso:**
```bash
node payment-tracker.js
```

### 4. Report Generator (`report-generator.js`)
Gera um relatório financeiro completo consolidando dados de todas as fontes.

**Uso:**
```bash
node report-generator.js
```

## Integração com OpenClaw (Chat & Voz)

O OpenClaw pode invocar estas skills através de comandos de texto ou voz.

| Comando de Voz / Texto | Ação | Skill Invocada |
|------------------------|------|----------------|
| "Claw, crie uma fatura de R$ 500 para o cliente X" | Criar Fatura | `invoice-generator.js create <clientId> 500` |
| "Claw, envie a fatura #123 por email" | Enviar Email | `invoice-generator.js send <invoiceId>` |
| "Claw, mostre faturas vencidas" | Listar Pendências | `invoice-generator.js list-overdue` |
| "Como está meu fluxo de caixa?" | Relatório Caixa | `cashflow-monitor.js` |
| "Tenho pagamentos atrasados?" | Checar Alertas | `payment-tracker.js` |

## Logs

Todas as skills enviam logs estruturados para o console (`stdout`) com timestamp e nível de log (INFO/ERROR), facilitando a ingestão por ferramentas de monitoramento.
