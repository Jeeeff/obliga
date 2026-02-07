import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'
import { ObligationStatus } from '@prisma/client'
import { obligationService } from '../services/obligation.service'
import { env } from '../config/env'
import { OpenClawContext } from '../integrations/openclaw'

const obligationSchema = z.object({
  title: z.string().min(1),
  clientId: z.string().min(1),
  type: z.enum(['PAYMENT', 'DOCUMENT', 'APPROVAL']),
  dueDate: z.string().transform((str) => new Date(str)),
  description: z.string().optional(),
})

const getContext = (req: AuthRequest): OpenClawContext => ({
    requestId: req.id || 'unknown',
    actorUserId: req.user!.userId,
    tenantId: req.user!.tenantId,
    featureFlags: {
        OPENCLAW_ENABLED: env.OPENCLAW_ENABLED
    }
})

export const listObligations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId
    const status = req.query.status as ObligationStatus | undefined
    const clientId = req.query.clientId as string | undefined
    const q = req.query.q as string | undefined

    const filters = { status, clientId, q }
    const obligations = await obligationService.list(tenantId!, filters, req.user!.userId)

    res.json(obligations)
  } catch (error) {
    next(error)
  }
}

export const createObligation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId
    if (!tenantId) throw new Error("No tenant")
    
    const data = obligationSchema.parse(req.body)
    const context = getContext(req)

    const obligation = await obligationService.create(tenantId, req.user!.userId, data, context)

    res.status(201).json(obligation)
  } catch (error) {
    next(error)
  }
}

export const getObligation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId
    const { id } = req.params as { id: string }

    const obligation = await obligationService.get(tenantId!, id, req.user!.userId)

    if (!obligation) return res.status(404).json({ error: 'Obligation not found' })

    res.json(obligation)
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' })
    }
    next(error)
  }
}

export const updateObligation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user?.tenantId
        const { id } = req.params as { id: string }
        const data = obligationSchema.partial().parse(req.body)
        const context = getContext(req)

        const obligation = await obligationService.update(tenantId!, id, data, context)

        if (!obligation) return res.status(404).json({ error: 'Obligation not found' })
        res.json(obligation)
    } catch (error) {
        next(error)
    }
}

// Transitions

const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction, newStatus: ObligationStatus, allowedStatuses: ObligationStatus[]) => {
    try {
        const tenantId = req.user?.tenantId
        const { id } = req.params as { id: string }
        const context = getContext(req)
        
        const updated = await obligationService.updateStatus(tenantId!, id, req.user!.userId, newStatus, allowedStatuses, context)

        res.json(updated)
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid transition or obligation not found') {
            return res.status(400).json({ error: error.message })
        }
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
        const tenantId = req.user?.tenantId
        const { id } = req.params as { id: string }
        const { message } = req.body
        const context = getContext(req)
        
        if (!message) return res.status(400).json({ error: "Message required" })

        const comment = await obligationService.addComment(tenantId!, id, req.user!.userId, message, context)

        res.status(201).json(comment)
    } catch (error) {
        if (error instanceof Error && error.message === 'Not found') return res.status(404).json({ error: 'Not found' })
        if (error instanceof Error && error.message === 'Forbidden') return res.status(403).json({ error: 'Forbidden' })
        next(error)
    }
}

export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user?.tenantId
        const { id } = req.params as { id: string }
        
        const comments = await obligationService.getComments(tenantId!, id, req.user!.userId)
        
        res.json(comments)
    } catch (error) {
        if (error instanceof Error && error.message === 'Not found') return res.status(404).json({ error: 'Not found' })
        if (error instanceof Error && error.message === 'Forbidden') return res.status(403).json({ error: 'Forbidden' })
        next(error)
    }
}
