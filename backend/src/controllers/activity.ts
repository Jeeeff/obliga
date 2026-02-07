import { Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middleware/auth'
import { Prisma } from '@prisma/client'

export const listActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId
    const { entityType, entityId } = req.query

    const where: Prisma.ActivityLogWhereInput = { tenantId }
    if (entityType) where.entityType = String(entityType)
    if (entityId) where.entityId = String(entityId)

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50
    })

    // Fetch user names manually or include user if relation exists (it doesn't in my schema currently, just actorUserId)
    // To be nice, let's fetch users. Or better, update schema to relate User?
    // User prompt: "ActivityLog: ... actorUserId"
    // I defined schema with just actorUserId string. I can query users.
    
    const userIds = [...new Set(logs.map(l => l.actorUserId))]
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, role: true }
    })
    
    const userMap = Object.fromEntries(users.map(u => [u.id, u]))
    
    const enrichedLogs = logs.map(log => ({
        ...log,
        user: userMap[log.actorUserId] || { name: 'Unknown' }
    }))

    res.json(enrichedLogs)
  } catch (error) {
    next(error)
  }
}
