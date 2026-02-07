import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { generateInvoicePdf } from '../services/pdf.service';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const getTenantId = (req: Request): string => {
    const authReq = req as AuthRequest;
    if (authReq.user?.tenantId) return authReq.user.tenantId;
    
    // Check for OpenClaw request
    const openClawReq = req as any;
    if (openClawReq.tenant?.id) return openClawReq.tenant.id;

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

        const pdfBuffer = await generateInvoicePdf(invoice);
        
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
    } catch (error: any) {
        logger.error({ err: error }, 'Send Invoice Error');
        res.status(500).json({ error: error.message || 'Failed to send invoice' });
    }
};

export const payInvoice = async (req: Request, res: Response) => {
    try {
        const tenantId = getTenantId(req);
        const result = await InvoiceService.pay(tenantId, req.params.id as string, req.body.gateway || 'stripe');
        res.json(result);
    } catch (error: any) {
        logger.error({ err: error }, 'Pay Invoice Error');
        res.status(500).json({ error: error.message || 'Failed to process payment' });
    }
};
