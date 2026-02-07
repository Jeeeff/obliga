import prisma from '../utils/prisma'
import { ObligationStatus } from '@prisma/client'
import { openClaw, OpenClawContext } from '../integrations/openclaw'

export class ObligationService {
    async list(workspaceId: string, filters: any, userId?: string) {
        const { status, clientId, q } = filters
        
        const where: any = { workspaceId }
        if (status) where.status = status
        if (clientId) where.clientId = clientId
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { client: { name: { contains: q, mode: 'insensitive' } } }
            ]
        }
        
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } })
            if (user?.role === 'CLIENT' && user.clientId) {
                where.clientId = user.clientId
            }
        }

        let obligations = await prisma.obligation.findMany({
            where,
            include: { client: true },
            orderBy: { dueDate: 'asc' }
        })

        // Compute overdue
        return obligations.map(this.checkOverdue)
    }

    async create(workspaceId: string, userId: string, data: any, context: OpenClawContext) {
        // Validate client belongs to workspace
        const client = await prisma.client.findFirst({
            where: { id: data.clientId, workspaceId }
        })
        if (!client) throw new Error("Invalid client for this workspace")

        const obligation = await prisma.obligation.create({
            data: {
                ...data,
                status: 'PENDING',
                workspaceId
            }
        })

        await prisma.activityLog.create({
            data: {
                workspaceId,
                actorUserId: userId,
                entityType: 'OBLIGATION',
                entityId: obligation.id,
                action: 'CREATED',
                meta: { title: obligation.title }
            }
        })

        // OpenClaw Hook
        openClaw.analyzeObligation(obligation.id, context).catch(console.error)

        return obligation
    }

    async get(workspaceId: string, id: string, userId: string) {
        let obligation = await prisma.obligation.findFirst({
            where: { id, workspaceId },
            include: { client: true, comments: { include: { user: true } }, attachments: true }
        })

        if (!obligation) return null

        // Check client permission
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user?.role === 'CLIENT') {
             if (user.clientId && user.clientId !== obligation.clientId) {
                 throw new Error('Forbidden')
             }
        }

        return this.checkOverdue(obligation)
    }

    async update(workspaceId: string, id: string, data: any, context: OpenClawContext) {
        const result = await prisma.obligation.updateMany({
            where: { id, workspaceId },
            data
        })

        if (result.count === 0) return null

        // OpenClaw Hook
        openClaw.analyzeObligation(id, context).catch(console.error)

        return prisma.obligation.findFirst({ where: { id, workspaceId } })
    }

    async updateStatus(workspaceId: string, id: string, userId: string, newStatus: ObligationStatus, allowedStatuses: ObligationStatus[], context: OpenClawContext) {
        // Atomic transition
        const result = await prisma.obligation.updateMany({
            where: { 
                id, 
                workspaceId, 
                status: { in: allowedStatuses } 
            },
            data: { status: newStatus }
        })

        if (result.count === 0) {
            throw new Error('Invalid transition or obligation not found')
        }

        await prisma.activityLog.create({
            data: {
                workspaceId: workspaceId,
                actorUserId: userId,
                entityType: 'OBLIGATION',
                entityId: id,
                action: 'STATUS_CHANGED',
                meta: { to: newStatus }
            }
        })

        // OpenClaw Hook
        if (newStatus === 'SUBMITTED') {
            openClaw.suggestActions(id, context).catch(console.error)
        }

        return prisma.obligation.findFirst({ where: { id, workspaceId } })
    }

    async addComment(workspaceId: string, id: string, userId: string, message: string, context: OpenClawContext) {
        const obligation = await prisma.obligation.findFirst({ where: { id, workspaceId } })
        if (!obligation) throw new Error('Not found')
        
        // Check client access
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user?.role === 'CLIENT') {
             if (user.clientId && user.clientId !== obligation.clientId) {
                 throw new Error('Forbidden')
             }
        }

        const comment = await prisma.comment.create({
            data: {
                workspaceId,
                obligationId: id,
                userId,
                message
            },
            include: { user: true }
        })

        await prisma.activityLog.create({
            data: {
                workspaceId,
                actorUserId: userId,
                entityType: 'OBLIGATION',
                entityId: id,
                action: 'COMMENTED',
            }
        })

        return comment
    }

    async getComments(workspaceId: string, id: string, userId: string) {
        // Check access first
        const obligation = await prisma.obligation.findFirst({ where: { id, workspaceId } })
        if (!obligation) throw new Error('Not found')
        
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user?.role === 'CLIENT') {
             if (user.clientId && user.clientId !== obligation.clientId) {
                 throw new Error('Forbidden')
             }
        }

        return prisma.comment.findMany({
            where: { obligationId: id, workspaceId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    private checkOverdue(obligation: any) {
        const now = new Date()
        const isOverdue = obligation.dueDate < now && obligation.status !== 'APPROVED'
        
        if (isOverdue && (obligation.status === 'PENDING' || obligation.status === 'CHANGES_REQUESTED')) {
            return { ...obligation, status: 'OVERDUE' }
        }
        return obligation
    }
}

export const obligationService = new ObligationService()
