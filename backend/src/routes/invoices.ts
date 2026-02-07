import { Router } from 'express';
import { createInvoice, listInvoices, getInvoice, sendInvoice, payInvoice, downloadInvoicePdf } from '../controllers/invoices';

const router = Router();

// router.use(authenticate) - Moved to index.ts to allow multi-auth (JWT or API Key)

router.post('/', createInvoice);
router.get('/', listInvoices);
router.get('/:id', getInvoice);
router.get('/:id/pdf', downloadInvoicePdf);
router.post('/:id/send', sendInvoice);
router.post('/:id/pay', payInvoice);

export default router;
