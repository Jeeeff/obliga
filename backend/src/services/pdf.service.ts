import PDFDocument from 'pdfkit';

interface InvoiceItemForPdf {
    description: string;
    quantity: number;
    price: number | string; // handling both just in case
}

interface InvoiceForPdf {
    id: string;
    createdAt: Date;
    dueDate: Date;
    amount: number | string;
    client: {
        name: string;
        email?: string | null;
    };
    items: InvoiceItemForPdf[];
}

export const generateInvoicePdf = async (invoice: InvoiceForPdf): Promise<Buffer> => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Header
        doc.fillColor('#444444')
           .fontSize(20)
           .text('OBLIGA INVOICE', 110, 57)
           .fontSize(10)
           .text(invoice.id, 200, 65, { align: 'right' })
           .text(`Date: ${invoice.createdAt.toISOString().split('T')[0]}`, 200, 80, { align: 'right' })
           .text(`Due Date: ${invoice.dueDate.toISOString().split('T')[0]}`, 200, 95, { align: 'right' })
           .moveDown();

        // Client Info
        doc.text(`Client: ${invoice.client.name}`, 50, 200)
           .text(`Email: ${invoice.client.email || 'N/A'}`, 50, 215)
           .moveDown();

        // Items Table Header
        const tableTop = 330;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Quantity', 300, tableTop);
        doc.text('Price', 370, tableTop);
        doc.text('Total', 440, tableTop);

        // Items
        let i = 0;
        doc.font('Helvetica');
        let position = 0;

        for (const item of invoice.items) {
            position = tableTop + (i + 1) * 30;
            const total = item.quantity * Number(item.price);
            
            doc.text(item.description, 50, position);
            doc.text(item.quantity.toString(), 300, position);
            doc.text(`$${Number(item.price).toFixed(2)}`, 370, position);
            doc.text(`$${total.toFixed(2)}`, 440, position);
            i++;
        }

        // Total
        const subtotalPosition = position + 30;
        doc.font('Helvetica-Bold');
        doc.text(`Total: $${Number(invoice.amount).toFixed(2)}`, 440, subtotalPosition);

        // Footer
        doc.fontSize(10)
           .text('Payment is due within 15 days. Thank you for your business.', 50, 700, { align: 'center', width: 500 });

        doc.end();
    });
};
