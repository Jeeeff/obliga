import { prisma } from '../utils/prisma';
import { generateInvoicePdf } from './pdf.service';
import { sendEmail } from './email.service';
import * as paymentService from './payment.service';

export const InvoiceService = {
    async create(tenantId: string, data: any) {
        // Calculate total amount from items
        const amount = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);

        const invoice = await prisma.invoice.create({
            data: {
                tenantId,
                clientId: data.clientId,
                amount,
                dueDate: new Date(data.dueDate),
                status: 'PENDING',
                items: {
                    create: data.items.map((item: any) => ({
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true,
                client: true
            }
        });

        return invoice;
    },

    async list(tenantId: string, filters: any = {}) {
        const where: any = { tenantId };
        
        if (filters.status) where.status = filters.status;
        if (filters.clientId) where.clientId = filters.clientId;

        return prisma.invoice.findMany({
            where,
            include: {
                client: {
                    select: { name: true, email: true }
                },
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async getById(tenantId: string, id: string) {
        return prisma.invoice.findFirst({
            where: { id, tenantId },
            include: {
                client: true,
                items: true
            }
        });
    },

    async sendInvoiceEmail(tenantId: string, id: string) {
        const invoice = await this.getById(tenantId, id);
        if (!invoice) throw new Error('Invoice not found');
        if (!invoice.client.email) throw new Error('Client has no email');

        const pdfBuffer = await generateInvoicePdf(invoice);

        await sendEmail({
            to: invoice.client.email,
            subject: `Invoice #${invoice.id} from Obliga`,
            text: `Please find attached invoice #${invoice.id}. Total: $${invoice.amount}`,
            attachments: [
                {
                    filename: `invoice-${invoice.id}.pdf`,
                    content: pdfBuffer
                }
            ]
        });

        return { sent: true };
    },

    async pay(tenantId: string, id: string, gateway: 'stripe' | 'mercadopago') {
        const invoice = await this.getById(tenantId, id);
        if (!invoice) throw new Error('Invoice not found');

        const result = await paymentService.processPayment(id, Number(invoice.amount), gateway);

        if (result.success) {
            await prisma.invoice.update({
                where: { id },
                data: { status: 'PAID' }
            });
            
            // Create transaction record
            await prisma.transaction.create({
                data: {
                    tenantId,
                    amount: invoice.amount,
                    description: `Payment for Invoice #${invoice.id}`,
                    date: new Date()
                }
            });
        }

        return result;
    }
};
