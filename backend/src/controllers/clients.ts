import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'
import { clientService } from '../services/client.service'
import { env } from '../config/env'
import { OpenClawContext } from '../integrations/openclaw'

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
})

function getTenantId(req: AuthRequest): string {
  const ws = req.user?.tenantId
  // Defensive: keep TS happy even if some types widen values
  const tenantId = Array.isArray(ws) ? ws[0] : ws
  if (!tenantId) throw new Error('No tenant ID')
  return tenantId
}

function getParamId(req: AuthRequest): string {
  // Defensive: some request typings can widen to string|string[]
  const raw: any = (req as any).params?.id
  const id = Array.isArray(raw) ? raw[0] : raw
  if (!id) throw new Error('Invalid id')
  return String(id)
}

const getContext = (req: AuthRequest): OpenClawContext => ({
    requestId: (req as any).id || 'unknown',
    actorUserId: req.user!.userId,
    tenantId: req.user!.tenantId,
    featureFlags: {
        OPENCLAW_ENABLED: env.OPENCLAW_ENABLED
    }
})

export const listClients = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = getTenantId(req)
    const { role, clientId } = req.user!

    const clients = await clientService.list(tenantId, role, clientId || undefined)

    res.json(clients)
  } catch (error) {
    next(error)
  }
}

export const createClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Only ADMIN can create clients
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can create clients' })
    }

    const tenantId = getTenantId(req)
    const data = clientSchema.parse(req.body)
    const context = getContext(req)

    const client = await clientService.create(tenantId, req.user!.userId, data, context)

    res.status(201).json(client)
  } catch (error) {
    next(error)
  }
}

export const getClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = getTenantId(req)
    const id = getParamId(req)
    const { role, clientId } = req.user!

    const client = await clientService.get(tenantId, id, role, clientId || undefined)

    if (!client) return res.status(404).json({ error: 'Client not found' })

    res.json(client)
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied') {
        return res.status(403).json({ error: 'Access denied' })
    }
    next(error)
  }
}

export const updateClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Only ADMIN can update clients
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can update clients' })
    }

    const tenantId = getTenantId(req)
    const id = getParamId(req)
    const data = clientSchema.partial().parse(req.body)
    const context = getContext(req)

    const client = await clientService.update(tenantId, id, data, context)

    if (!client) return res.status(404).json({ error: 'Client not found' })

    res.json(client)
  } catch (error) {
    next(error)
  }
}

export const deleteClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can delete clients' })
    }

    const tenantId = getTenantId(req)
    const id = getParamId(req)

    const success = await clientService.delete(tenantId, id)

    if (!success) return res.status(404).json({ error: 'Client not found' })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
