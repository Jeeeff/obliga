export type Role = "CLIENT" | "ADMIN"

export type ObligationStatus =
  | "PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "OVERDUE"

export type ObligationType = "Payment" | "Document" | "Approval"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: Role | "user" // keeping "user" for backward compat if needed, but prompt says CLIENT/ADMIN
  workspaceName?: string
}

export interface Client {
  id: string
  name: string
  email: string
  logo: string
  status: "Active" | "Inactive"
}

export interface Obligation {
  id: string
  title: string
  client: string
  clientId: string
  type: ObligationType
  dueDate: string
  status: ObligationStatus
  description?: string
  assignedTo?: string
}

export interface Activity {
  id: string
  user: string
  userAvatar: string
  action: string
  target: string
  timestamp: string
  type: "create" | "update" | "delete" | "comment" | "approve"
}
