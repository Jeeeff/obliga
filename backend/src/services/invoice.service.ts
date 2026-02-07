import prisma from '../utils/prisma';
import { generateInvoicePdf } from './pdf.service';
import { sendEmail } from './email.service';
import * as paymentService from './payment.service';
import { Prisma } from '@prisma/client';

interface CreateInvoiceItem {
    description: string;
    quantity: number;
    price: number;
}

interface CreateInvoiceData {
    clientId: string;
    dueDate: string | Date;
    items: CreateInvoiceItem[];
}

interface InvoiceFilters {
    status?: string;
    clientId?: string;
}

export const InvoiceService = {
    async create(tenantId: string, data: CreateInvoiceData) {
        // Calculate total amount from items
        const amount = data.items.reduce((sum: number, item: CreateInvoiceItem) => sum + (item.quantity * item.price), 0);

        const invoice = await prisma.invoice.create({
            data: {
                tenantId,
                clientId: data.clientId,
                amount,
                dueDate: new Date(data.dueDate),
                status: 'PENDING',
                items: {
                    create: data.items.map((item: CreateInvoiceItem) => ({
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

    async list(tenantId: string, filters: InvoiceFilters = {}) {
        const where: Prisma.InvoiceWhereInput = { tenantId };
        
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

        // Convert decimals to number/string for PDF generation
        const invoiceForPdf = {
            ...invoice,
            amount: Number(invoice.amount),
            items: invoice.items.map(item => ({
                ...item,
                price: Number(item.price)
            }))
        };

        const pdfBuffer = await generateInvoicePdf(invoiceForPdf);

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
