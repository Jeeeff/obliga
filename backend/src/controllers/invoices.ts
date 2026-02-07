import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { generateInvoicePdf } from '../services/pdf.service';
import { logger } from '../utils/logger';

const getTenantId = (req: Request): string => {
    // Check for standard AuthRequest user
    if (req.user?.tenantId) return req.user.tenantId;
    
    // Check for OpenClaw request
    if (req.tenant?.id) return req.tenant.id;

    throw new Error('Tenant context missing');
};

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        const invoice = await InvoiceService.create(tenantId, req.body);
        res.status(201).json(invoice);
    } catch (error) {
        logger.error({ err: error }, 'Create Invoice Error');
        res.status(500).json({ error: 'Failed to create invoice' });
    }
};

export const listInvoices = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        const invoices = await InvoiceService.list(tenantId, req.query);
        res.json(invoices);
    } catch (error) {
        logger.error({ err: error }, 'List Invoices Error');
        res.status(500).json({ error: 'Failed to list invoices' });
    }
};

export const getInvoice = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        const invoice = await InvoiceService.getById(tenantId, req.params.id as string);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        logger.error({ err: error }, 'Get Invoice Error');
        res.status(500).json({ error: 'Failed to get invoice' });
    }
};

export const downloadInvoicePdf = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        const invoice = await InvoiceService.getById(tenantId, req.params.id as string);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

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
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        logger.error({ err: error }, 'Download Invoice PDF Error');
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

export const sendInvoice = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        await InvoiceService.sendInvoiceEmail(tenantId, req.params.id as string);
        res.json({ message: 'Invoice sent successfully' });
    } catch (error) {
        const err = error as Error;
        logger.error({ err }, 'Send Invoice Error');
        res.status(500).json({ error: err.message || 'Failed to send invoice' });
    }
};

export const payInvoice = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        const result = await InvoiceService.pay(tenantId, req.params.id as string, req.body.gateway || 'stripe');
        res.json(result);
    } catch (error) {
        const err = error as Error;
        logger.error({ err }, 'Pay Invoice Error');
        res.status(500).json({ error: err.message || 'Failed to process payment' });
    }
};
