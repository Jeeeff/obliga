import { PrismaClient } from '@prisma/client'
import { getContext } from './context'

const prismaClient = new PrismaClient()

const modelsWithTenant = [
  'user',
  'client',
  'obligation',
  'comment',
  'attachment',
  'activityLog',
  'transaction',
  'invoice'
]

const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const ctx = getContext()
        
        // Se não tem tenantId no contexto ou o model não é tenant-scoped, executa normal
        if (!ctx?.tenantId || !modelsWithTenant.includes(model.toLowerCase())) {
          return query(args)
        }

        const tenantId = ctx.tenantId

        // Create: Injetar tenantId
        if (operation === 'create') {
          args.data = { ...(args.data as any), tenantId }
          return query(args)
        }
        
        // CreateMany: Injetar tenantId em todos
        if (operation === 'createMany') {
            if (Array.isArray(args.data)) {
                args.data = args.data.map((item: any) => ({ ...item, tenantId }))
            } else {
                args.data = { ...(args.data as any), tenantId }
            }
            return query(args)
        }

        // Filters (Read/Update/Delete)
        if ((args as any).where !== undefined || operation === 'findMany' || operation === 'findFirst') {
             (args as any).where = { ...(args as any).where, tenantId }
        }

        // Special handling for findUnique: convert to findFirst to allow tenantId filter
        // unless there is a composite unique constraint (which we don't have yet for all)
        if (operation === 'findUnique') {
             return (prismaClient as any)[model].findFirst({
                 ...args,
                 where: { ...(args as any).where, tenantId }
             })
        }
        
        // Special handling for findUniqueOrThrow
        if (operation === 'findUniqueOrThrow') {
             return (prismaClient as any)[model].findFirstOrThrow({
                 ...args,
                 where: { ...(args as any).where, tenantId }
             })
        }

        return query(args)
      }
    }
  }
})

export default prisma
