
import { ObligationStatus, ObligationType, ActivityType, Role } from "./types"

export const ObligationStatusLabels: Record<ObligationStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHANGES_REQUESTED: "Changes Requested",
  OVERDUE: "Overdue",
}

export const ObligationTypeLabels: Record<ObligationType, string> = {
  PAYMENT: "Payment",
  DOCUMENT: "Document",
  APPROVAL: "Approval",
}

export const RoleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  CLIENT: "Client",
}

export const ActivityTypeLabels: Record<ActivityType, string> = {
  LOGIN: "Login",
  OBLIGATION_UPDATE: "Obligation Update",
  COMMENT_ADDED: "Comment Added",
  FILE_UPLOADED: "File Uploaded",
}

export function formatStatus(status: ObligationStatus): string {
  return ObligationStatusLabels[status] || status
}

export function formatType(type: ObligationType): string {
  return ObligationTypeLabels[type] || type
}

export function formatRole(role: Role): string {
  return RoleLabels[role] || role
}
