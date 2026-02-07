export type Role = "CLIENT" | "ADMIN"

export type ObligationStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | "OVERDUE"

export type ObligationType = "PAYMENT" | "DOCUMENT" | "APPROVAL"

export type ActivityType = "LOGIN" | "OBLIGATION_UPDATE" | "COMMENT_ADDED" | "FILE_UPLOADED"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  workspaceName?: string
  clientId?: string
}

export interface Client {
  id: string
  name: string
  email: string
  logo?: string
  status: "Active" | "Inactive"
}

export interface Obligation {
  id: string
  title: string
  client: string // Client name (mapped)
  clientId: string
  type: ObligationType
  dueDate: string
  status: ObligationStatus
  description?: string
  assignedTo?: string
}

export interface Comment {
    id: string
    message: string
    createdAt: string
    user: {
        name: string
        avatar?: string
    }
}

export interface Attachment {
    id: string
    fileName: string
    fileUrl: string
    createdAt: string
}

export interface Activity {
  id: string
  actorUserId: string
  entityType: string
  entityId: string
  action: string
  meta: any
  createdAt: string
  user?: { // Expanded for UI
      name: string
      avatar?: string
  }
}
