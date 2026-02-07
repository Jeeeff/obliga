import { Request, Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { logger } from '../utils/logger'

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = req.body
        const { type, payload, tenantId } = event

        // NOTE: In a real scenario, we should verify a webhook signature.
        // For now, we assume the payload includes a valid tenantId or we look it up.
        // If the webhook is from OpenClaw system to us, it should probably verify via a secret.
        
        logger.info({ type, tenantId }, 'Received OpenClaw Webhook')

        if (!tenantId) {
            return res.status(400).json({ error: 'Missing tenantId in payload' })
        }

        switch (type) {
            case 'payment_received':
                // Logic: Find invoice and mark paid?
                // payload: { invoiceId, amount }
                if (payload.invoiceId) {
                    await prisma.invoice.updateMany({
                        where: { id: payload.invoiceId, tenantId },
                        data: { status: 'PAID' }
                    })
                }
                break;
            
            case 'invoice_overdue':
                // Logic: Send email or create alert?
                // Already handled by polling/alerts, but maybe push notification.
                logger.warn({ payload }, 'Invoice Overdue Event')
                break;
                
            default:
                logger.info('Unhandled webhook event type')
        }

        res.status(200).send('OK')
    } catch (error) {
        next(error)
    }
}
