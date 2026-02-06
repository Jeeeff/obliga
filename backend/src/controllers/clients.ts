import { Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
})

function getWorkspaceId(req: AuthRequest): string {
  const ws = req.user?.workspaceId
  // Defensive: keep TS happy even if some types widen values
  const workspaceId = Array.isArray(ws) ? ws[0] : ws
  if (!workspaceId) throw new Error('No workspace ID')
  return workspaceId
}

function getParamId(req: AuthRequest): string {
  // Defensive: some request typings can widen to string|string[]
  const raw: any = (req as any).params?.id
  const id = Array.isArray(raw) ? raw[0] : raw
  if (!id) throw new Error('Invalid id')
  return String(id)
}

export const listClients = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = getWorkspaceId(req)

    const clients = await prisma.client.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' }
    })

    res.json(clients)
  } catch (error) {
    next(error)
  }
}

export const createClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = clientSchema.parse(req.body)

    const client = await prisma.client.create({
      data: {
        ...data,
        workspaceId
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        workspaceId,
        actorUserId: req.user!.userId,
        entityType: 'CLIENT',
        entityId: client.id,
        action: 'CREATED',
        meta: { name: client.name }
      }
    })

    res.status(201).json(client)
  } catch (error) {
    next(error)
  }
}

export const getClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const id = getParamId(req)

    const client = await prisma.client.findFirst({
      where: { id, workspaceId }
    })

    if (!client) return res.status(404).json({ error: 'Client not found' })

    res.json(client)
  } catch (error) {
    next(error)
  }
}

export const updateClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const id = getParamId(req)
    const data = clientSchema.partial().parse(req.body)

    const result = await prisma.client.updateMany({
      where: { id, workspaceId },
      data
    })

    if (result.count === 0) return res.status(404).json({ error: 'Client not found' })

    const client = await prisma.client.findFirst({ where: { id, workspaceId } })
    res.json(client)
  } catch (error) {
    next(error)
  }
}

export const deleteClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const id = getParamId(req)

    const result = await prisma.client.deleteMany({
      where: { id, workspaceId }
    })

    if (result.count === 0) return res.status(404).json({ error: 'Client not found' })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
