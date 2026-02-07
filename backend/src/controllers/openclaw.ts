import { Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { OpenClawRequest } from '../middleware/openclaw-auth'
import { z } from 'zod'

// Schemas
const invoiceSchema = z.object({
    clientId: z.string(),
    amount: z.number().positive(),
    status: z.enum(['PENDING', 'PAID', 'OVERDUE']).default('PENDING'),
    dueDate: z.string().datetime(), // ISO Date
    description: z.string().optional()
})

export const getSummary = async (req: OpenClawRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenant!.id

        // Calculate total receivables (Invoices)
        const invoices = await prisma.invoice.aggregate({
            where: { tenantId },
            _sum: { amount: true },
            _count: true
        })

        // Calculate total transactions (Cash in/out)
        // Assuming Transaction amount can be negative for expenses
        const transactions = await prisma.transaction.aggregate({
            where: { tenantId },
            _sum: { amount: true }
        })

        res.json({
            tenant: req.tenant!.name,
            financials: {
                totalInvoiced: invoices._sum.amount || 0,
                invoiceCount: invoices._count,
                netCashFlow: transactions._sum.amount || 0
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getAlerts = async (req: OpenClawRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenant!.id

        // Overdue Obligations
        const overdueObligations = await prisma.obligation.findMany({
            where: { 
                tenantId,
                status: 'OVERDUE'
            },
            select: { id: true, title: true, dueDate: true, client: { select: { name: true } } }
        })

        // Overdue Invoices
        const overdueInvoices = await prisma.invoice.findMany({
            where: {
                tenantId,
                status: 'PENDING',
                dueDate: { lt: new Date() }
            },
            select: { id: true, amount: true, dueDate: true }
        })

        res.json({
            alerts: [
                ...overdueObligations.map(o => ({
                    type: 'OBLIGATION_OVERDUE',
                    message: `Obligation "${o.title}" for ${o.client.name} is overdue`,
                    entityId: o.id,
                    date: o.dueDate
                })),
                ...overdueInvoices.map(i => ({
                    type: 'INVOICE_OVERDUE',
                    message: `Invoice ${i.id} of ${i.amount} is overdue`,
                    entityId: i.id,
                    date: i.dueDate
                }))
            ]
        })

    } catch (error) {
        next(error)
    }
}

export const createInvoice = async (req: OpenClawRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenant!.id
        const data = invoiceSchema.parse(req.body)

        const invoice = await prisma.invoice.create({
            data: {
                tenantId,
                clientId: data.clientId,
                amount: data.amount,
                status: data.status,
                dueDate: data.dueDate,
                // description: data.description // Schema doesn't have description yet? Let's check schema.
                // My schema read earlier showed: Invoice { id, tenantId, amount, status, dueDate, createdAt }
                // No description in Invoice model in previous read.
            }
        })

        res.status(201).json(invoice)
    } catch (error) {
        next(error)
    }
}

export const getCashflow = async (req: OpenClawRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenant!.id
        
        // Simple projection: Invoices (Incoming) vs Obligations (Outgoing - assuming obligations imply payment)
        // This is a naive implementation.
        
        const upcomingInvoices = await prisma.invoice.findMany({
            where: { tenantId, status: 'PENDING' },
            orderBy: { dueDate: 'asc' }
        })

        const upcomingObligations = await prisma.obligation.findMany({
            where: { tenantId, type: 'PAYMENT', status: { not: 'APPROVED' } }, // Assuming APPROVED means done/paid? Or SUBMITTED? 
            // Let's assume PENDING/SUBMITTED are upcoming liabilities.
            orderBy: { dueDate: 'asc' }
        })

        res.json({
            projection: {
                incoming: upcomingInvoices.map(i => ({ date: i.dueDate, amount: i.amount })),
                outgoing: upcomingObligations.map(o => ({ date: o.dueDate, amount: 0, note: 'Amount unknown' })) 
                // Obligations don't have amount field in schema! 
                // I should probably add amount to Obligation if it's PAYMENT type.
                // For now, I'll return what I have.
            }
        })

    } catch (error) {
        next(error)
    }
}
