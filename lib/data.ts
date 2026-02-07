import { Obligation, Client, User } from "./types"

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Silva",
    email: "alex@obliga.com",
    avatar: "https://i.pravatar.cc/150?u=u1",
    role: "ADMIN",
  },
  {
    id: "u2",
    name: "Beatriz Costa",
    email: "bia@obliga.com",
    avatar: "https://i.pravatar.cc/150?u=u2",
    role: "CLIENT",
  },
]

export const mockClients: Client[] = [
  {
    id: "c1",
    name: "TechSolutions Ltda",
    email: "contact@techsolutions.com",
    logo: "TS",
    status: "Active",
  },
  {
    id: "c2",
    name: "Global Ventures",
    email: "info@globalventures.com",
    logo: "GV",
    status: "Active",
  },
  {
    id: "c3",
    name: "Padaria do João",
    email: "joao@padaria.com",
    logo: "PJ",
    status: "Active",
  },
]

export const mockObligations: Obligation[] = [
  {
    id: "o1",
    title: "Imposto de Renda Mensal",
    client: "TechSolutions Ltda",
    clientId: "c1",
    type: "PAYMENT",
    dueDate: "2026-02-10",
    status: "PENDING",
    description: "Pagamento mensal do imposto de renda corporativo.",
  },
  {
    id: "o2",
    title: "Relatório Financeiro Q1",
    client: "Global Ventures",
    clientId: "c2",
    type: "DOCUMENT",
    dueDate: "2026-02-15",
    status: "UNDER_REVIEW",
    description: "Relatório consolidado do primeiro trimestre.",
  },
  {
    id: "o3",
    title: "Alvará de Funcionamento",
    client: "Padaria do João",
    clientId: "c3",
    type: "APPROVAL",
    dueDate: "2026-01-30",
    status: "OVERDUE",
    description: "Renovação do alvará anual.",
  },
  {
    id: "o4",
    title: "Folha de Pagamento",
    client: "TechSolutions Ltda",
    clientId: "c1",
    type: "PAYMENT",
    dueDate: "2026-02-05",
    status: "APPROVED",
  },
  {
    id: "o5",
    title: "Contrato Social Atualizado",
    client: "Global Ventures",
    clientId: "c2",
    type: "DOCUMENT",
    dueDate: "2026-02-20",
    status: "CHANGES_REQUESTED",
    description: "Pendente assinatura dos sócios.",
  },
  {
    id: "o6",
    title: "DAS Simples Nacional",
    client: "Padaria do João",
    clientId: "c3",
    type: "PAYMENT",
    dueDate: "2026-02-20",
    status: "PENDING",
  },
]

export const mockActivities = [
  {
    id: "a1",
    user: "Alex Silva",
    userAvatar: "https://i.pravatar.cc/150?u=u1",
    action: "approved",
    target: "Folha de Pagamento",
    timestamp: "2 hours ago",
    type: "approve",
  },
  {
    id: "a2",
    user: "Beatriz Costa",
    userAvatar: "https://i.pravatar.cc/150?u=u2",
    action: "uploaded document for",
    target: "Relatório Financeiro Q1",
    timestamp: "5 hours ago",
    type: "update",
  },
  {
    id: "a3",
    user: "System",
    userAvatar: "",
    action: "flagged as overdue",
    target: "Alvará de Funcionamento",
    timestamp: "1 day ago",
    type: "update",
  },
]
