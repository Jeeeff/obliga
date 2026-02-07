import prisma from '../utils/prisma'
import { Prisma } from '@prisma/client'
import { OpenClawContext } from '../integrations/openclaw'

export class ClientService {
    async list(tenantId: string, role: string, clientId?: string) {
        if (role === 'CLIENT') {
            // CLIENT can only see their own client record
            if (!clientId) {
                return []
            }
            return prisma.client.findMany({
                where: { id: clientId, tenantId },
                orderBy: { createdAt: 'desc' }
            })
        } else {
            // ADMIN can see all clients
            return prisma.client.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' }
            })
        }
    }

    async create(tenantId: string, userId: string, data: Omit<Prisma.ClientUncheckedCreateInput, 'tenantId'>, _context: OpenClawContext) { // eslint-disable-line @typescript-eslint/no-unused-vars
         const client = await prisma.client.create({
            data: {
                ...data,
                tenantId
            }
        })

        // Log activity
        await prisma.activityLog.create({
            data: {
                tenantId,
                actorUserId: userId,
                entityType: 'CLIENT',
                entityId: client.id,
                action: 'CREATED',
                meta: { name: client.name }
            }
        })

        return client
    }


    async get(tenantId: string, id: string, role: string, clientId?: string) {
        // If role is CLIENT, they must be requesting their own ID
        if (role === 'CLIENT' && clientId !== id) {
            throw new Error('Access denied')
        }

        const client = await prisma.client.findFirst({
            where: { id, tenantId }
        })

        if (!client) return null
        return client
    }

    async update(tenantId: string, id: string, data: Prisma.ClientUncheckedUpdateInput, _context: OpenClawContext) { // eslint-disable-line @typescript-eslint/no-unused-vars
        const result = await prisma.client.updateMany({
            where: { id, tenantId },
            data
        })

        if (result.count === 0) return null

        return prisma.client.findFirst({ where: { id }})
    }

    async delete(tenantId: string, id: string) {
        const result = await prisma.client.deleteMany({
            where: { id, tenantId }
        })

        return result.count > 0
    }
}

export const clientService = new ClientService()
