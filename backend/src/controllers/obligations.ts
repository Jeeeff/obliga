import { Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'
import { ObligationStatus } from '@prisma/client'

const obligationSchema = z.object({
  title: z.string().min(1),
  clientId: z.string().min(1),
  type: z.enum(['PAYMENT', 'DOCUMENT', 'APPROVAL']),
  dueDate: z.string().transform((str) => new Date(str)),
  description: z.string().optional(),
})

// Helper to check overdue status on fetch
const checkOverdue = (obligation: any) => {
  const now = new Date()
  const isOverdue = obligation.dueDate < now && obligation.status !== 'APPROVED'
  
  if (isOverdue && (obligation.status === 'PENDING' || obligation.status === 'CHANGES_REQUESTED')) {
      return { ...obligation, status: 'OVERDUE' }
  }
  return obligation
}

export const listObligations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.user?.workspaceId
    const status = req.query.status as string | undefined
    const clientId = req.query.clientId as string | undefined
    const q = req.query.q as string | undefined

    const where: any = { workspaceId }
    if (status) where.status = status
    if (clientId) where.clientId = clientId
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { client: { name: { contains: q, mode: 'insensitive' } } }
        ]
    }
    
    if (req.user?.role === 'CLIENT') {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
        if (user?.clientId) {
            where.clientId = user.clientId
        }
    }

    let obligations = await prisma.obligation.findMany({
      where,
      include: { client: true },
      orderBy: { dueDate: 'asc' }
    })

    // Compute overdue
    obligations = obligations.map(checkOverdue)

    res.json(obligations)
  } catch (error) {
    next(error)
  }
}

export const createObligation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.user?.workspaceId
    if (!workspaceId) throw new Error("No workspace")
    
    const data = obligationSchema.parse(req.body)

    // Validate client belongs to workspace
    const client = await prisma.client.findFirst({
        where: { id: data.clientId, workspaceId }
    })
    if (!client) return res.status(400).json({ error: "Invalid client for this workspace" })

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
            actorUserId: req.user!.userId,
            entityType: 'OBLIGATION',
            entityId: obligation.id,
            action: 'CREATED',
            meta: { title: obligation.title }
        }
    })

    res.status(201).json(obligation)
  } catch (error) {
    next(error)
  }
}

export const getObligation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.user?.workspaceId
    const { id } = req.params as { id: string }

    let obligation = await prisma.obligation.findFirst({
      where: { id, workspaceId },
      include: { client: true, comments: { include: { user: true } }, attachments: true }
    })

    if (!obligation) return res.status(404).json({ error: 'Obligation not found' })

    // Check client permission
    if (req.user?.role === 'CLIENT') {
         // Rely on DB or token. Token is faster but DB is safer for real-time changes.
         // We already fetched user.clientId in list, here we can fetch user again.
         // Or use req.user.clientId if present in token (we added it).
         // But let's stick to DB fetch for now to be 100% consistent with logic I wrote before.
         const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
         if (user?.clientId && user.clientId !== obligation.clientId) {
             return res.status(403).json({ error: 'Forbidden' })
         }
    }

    obligation = checkOverdue(obligation)
    res.json(obligation)
  } catch (error) {
    next(error)
  }
}

export const updateObligation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.user?.workspaceId
        const { id } = req.params as { id: string }
        const data = obligationSchema.partial().parse(req.body)

        const result = await prisma.obligation.updateMany({
            where: { id, workspaceId },
            data
        })

        if (result.count === 0) return res.status(404).json({ error: 'Obligation not found' })

        const obligation = await prisma.obligation.findFirst({ where: { id, workspaceId } })
        res.json(obligation)
    } catch (error) {
        next(error)
    }
}

// Transitions

const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction, newStatus: ObligationStatus, allowedStatuses: ObligationStatus[]) => {
    try {
        const workspaceId = req.user?.workspaceId
        const { id } = req.params as { id: string }
        
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
            return res.status(400).json({ error: 'Invalid transition or obligation not found' })
        }

        await prisma.activityLog.create({
            data: {
                workspaceId: workspaceId!,
                actorUserId: req.user!.userId,
                entityType: 'OBLIGATION',
                entityId: id,
                action: 'STATUS_CHANGED',
                meta: { to: newStatus }
            }
        })

        const updated = await prisma.obligation.findFirst({ where: { id, workspaceId } })
        res.json(updated)
    } catch (error) {
        next(error)
    }
}

export const submitObligation = (req: AuthRequest, res: Response, next: NextFunction) => {
    return updateStatus(req, res, next, 'SUBMITTED', ['PENDING', 'CHANGES_REQUESTED', 'OVERDUE'])
}

export const approveObligation = (req: AuthRequest, res: Response, next: NextFunction) => {
    return updateStatus(req, res, next, 'APPROVED', ['SUBMITTED', 'UNDER_REVIEW'])
}

export const requestChangesObligation = (req: AuthRequest, res: Response, next: NextFunction) => {
    return updateStatus(req, res, next, 'CHANGES_REQUESTED', ['SUBMITTED', 'UNDER_REVIEW'])
}

export const resetObligation = (req: AuthRequest, res: Response, next: NextFunction) => {
    return updateStatus(req, res, next, 'PENDING', ['CHANGES_REQUESTED'])
}

// Comments

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.user?.workspaceId
        const { id } = req.params as { id: string }
        const { message } = req.body
        
        if (!message) return res.status(400).json({ error: "Message required" })

        const obligation = await prisma.obligation.findFirst({ where: { id, workspaceId } })
        if (!obligation) return res.status(404).json({ error: 'Not found' })
        
        // Check client access
        if (req.user?.role === 'CLIENT') {
             const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
             if (user?.clientId && user.clientId !== obligation.clientId) {
                 return res.status(403).json({ error: 'Forbidden' })
             }
        }

        const comment = await prisma.comment.create({
            data: {
                workspaceId: workspaceId!,
                obligationId: id,
                userId: req.user!.userId,
                message
            },
            include: { user: true }
        })

        await prisma.activityLog.create({
            data: {
                workspaceId: workspaceId!,
                actorUserId: req.user!.userId,
                entityType: 'OBLIGATION',
                entityId: id,
                action: 'COMMENTED',
            }
        })

        res.status(201).json(comment)
    } catch (error) {
        next(error)
    }
}

export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.user?.workspaceId
        const { id } = req.params as { id: string }
        
        const comments = await prisma.comment.findMany({
            where: { obligationId: id, workspaceId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
        
        res.json(comments)
    } catch (error) {
        next(error)
    }
}
