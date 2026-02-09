export type ObligationStatus = string

export interface ClientSummary {
  id: string
  name: string
  email?: string
}

export interface Obligation {
  id: string
  title: string
  clientName?: string
  client?: {
    name?: string
  }
  dueDate: string
  status: ObligationStatus
}

export interface CreateObligationInput {
  title: string
  clientId: string
  type: string
  dueDate: string
  description?: string
}
