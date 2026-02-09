import { Context } from "grammy"
import { Obligation } from "../types"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }
  return date.toLocaleDateString("pt-BR")
}

function formatStatus(status: string): string {
  const normalized = status.toUpperCase()
  if (normalized === "PENDING") return "Pendente"
  if (normalized === "OVERDUE") return "Em atraso"
  if (normalized === "APPROVED") return "Aprovado"
  if (normalized === "SUBMITTED") return "Enviado"
  if (normalized === "UNDER_REVIEW") return "Em análise"
  return status
}

export function formatObligationsList(title: string, obligations: Obligation[]): string {
  if (obligations.length === 0) {
    return "Você não possui obrigações cadastradas."
  }
  const header = `📋 ${title}:\n`
  const lines = obligations.map((o, index) => {
    const clientName = o.client?.name || o.clientName || "Cliente"
    const due = formatDate(o.dueDate)
    const status = formatStatus(o.status)
    return `${index + 1}. ${o.title} - ${clientName}\n   Vencimento: ${due}\n   Status: ${status}`
  })
  return `${header}\n${lines.join("\n\n")}`
}

export async function safeReply(ctx: Context, text: string): Promise<void> {
  try {
    await ctx.reply(text)
  } catch {
  }
}
