import prisma from '../utils/prisma'
import { OpenClawContext } from '../integrations/openclaw'

export class ClientService {
    async list(workspaceId: string, role: string, clientId?: string) {
        if (role === 'CLIENT') {
            // CLIENT can only see their own client record
            if (!clientId) {
                return []
            }
            return prisma.client.findMany({
                where: { id: clientId, workspaceId },
                orderBy: { createdAt: 'desc' }
            })
        } else {
            // ADMIN can see all clients
            return prisma.client.findMany({
                where: { workspaceId },
                orderBy: { createdAt: 'desc' }
            })
        }
    }

    async create(workspaceId: string, userId: string, data: any, context: OpenClawContext) {
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
                actorUserId: userId,
                entityType: 'CLIENT',
                entityId: client.id,
                action: 'CREATED',
                meta: { name: client.name }
            }
        })

        return client
    }

    async get(workspaceId: string, id: string, role: string, clientId?: string) {
        // If role is CLIENT, they must be requesting their own ID
        if (role === 'CLIENT' && clientId !== id) {
            throw new Error('Access denied')
        }

        const client = await prisma.client.findFirst({
            where: { id, workspaceId }
        })

        if (!client) return null
        return client
    }

    async update(workspaceId: string, id: string, data: any, context: OpenClawContext) {
        const result = await prisma.client.updateMany({
            where: { id, workspaceId },
            data
        })

        if (result.count === 0) return null

        return prisma.client.findFirst({ where: { id }})
    }

    async delete(workspaceId: string, id: string) {
        const result = await prisma.client.deleteMany({
            where: { id, workspaceId }
        })

        return result.count > 0
    }
}

export const clientService = new ClientService()
