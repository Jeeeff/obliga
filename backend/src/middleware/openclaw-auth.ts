import { Request, Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { logger } from '../utils/logger'
import { context } from '../utils/context'

export interface OpenClawRequest extends Request {
    tenant?: {
        id: string
        name: string
    }
}

export const openClawAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers['x-api-key'] as string

        if (!apiKey) {
            return res.status(401).json({ error: 'Missing API Key' })
        }

        // Validate API Key
        // Since we are using the prisma extension that automatically injects tenantId,
        // we need to be careful here. 
        // We are looking up a tenant BY api key, we don't know the tenantId yet.
        // We might need to bypass the extension or use a raw query or use findFirst without tenantId injection if possible.
        // BUT my extension logic in `utils/prisma.ts` injects tenantId from AsyncLocalStorage?
        // Or does it require tenantId to be present in args?
        
        // Let's check `utils/prisma.ts`.
        // If I haven't set the AsyncLocalStorage store yet, does it default to global?
        // The extension likely injects `tenantId` from the store. If store is empty, does it inject undefined?
        // If it injects undefined, it might be fine if I don't provide a where clause that needs it?
        // Actually, if I am finding a Tenant, I don't filter by TenantId (it IS the tenant).
        // The Tenant model usually doesn't have a `tenantId` field on itself.
        // Let's check Schema. `Tenant` model has `id`, `name`... NO `tenantId`.
        // So querying `Tenant` table should be safe from the extension's auto-injection if the extension only targets models with `tenantId`.
        
        const tenant = await prisma.tenant.findUnique({
            where: { openClawApiKey: apiKey }
        })

        if (!tenant) {
            return res.status(401).json({ error: 'Invalid API Key' })
        }

        if (tenant.status !== 'ACTIVE') {
            return res.status(403).json({ error: 'Tenant is not active' })
        }

        // Attach tenant to request
        (req as OpenClawRequest).tenant = tenant

        // Set context for subsequent queries (so they are scoped to this tenant)
        context.run({ tenantId: tenant.id }, () => {
             // We need to call next() inside the run callback to propagate context?
             // No, `context.run` runs the callback synchronously/asynchronously.
             // If I call `next()` here, the subsequent middlewares/controllers will run inside this context?
             // Express middleware chain is not automatically wrapped in ALS unless we wrap the `next` call or use a global middleware that wraps the whole request.
             // My `auth.ts` middleware likely did this.
             // Let's see how I can propagate this.
             // If I can't easily wrap the rest of the chain here, I might need to set the store manually if exposed, or rely on the `context` module.
             
             // Wait, `AsyncLocalStorage` `run` scopes the callback. 
             // If I call `next()` inside `run`, the downstream handlers are in the scope ONLY if they are synchronous or awaited within the scope.
             // Express `next()` is synchronous, but the subsequent handlers might be async.
             // However, ALS usually persists across async calls initiated within the scope.
             
             next()
        })
        
    } catch (error) {
        logger.error({ err: error }, 'OpenClaw Auth Error')
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
