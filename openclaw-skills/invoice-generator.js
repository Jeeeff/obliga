/**
 * Invoice Generator Skill
 * Manages invoices via OpenClaw command.
 * 
 * Commands:
 * - create <clientId> <amount> [description]
 * - get <id>
 * - send <id>
 * - list-overdue
 * 
 * Usage: node invoice-generator.js <command> [args...]
 */

const { request, log } = require('./utils');

async function create(args) {
    const [clientId, amount, description] = args;
    
    if (!clientId || !amount) {
        log('ERROR', 'Missing arguments for create. Usage: create <clientId> <amount> [description]');
        return;
    }

    // Default due date to 7 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const payload = {
        clientId,
        dueDate: dueDate.toISOString(),
        items: [
            {
                description: description || 'Service via OpenClaw',
                quantity: 1,
                price: Number(amount)
            }
        ]
    };

    try {
        const invoice = await request('POST', '/invoices', payload);
        log('INFO', 'Invoice Created Successfully', { invoiceId: invoice.id });
        console.log(`Invoice ${invoice.id} created for ${invoice.amount} due on ${invoice.dueDate}`);
        return invoice;
    } catch (error) {
        // Log handled by utils but we might want custom output
        process.exit(1);
    }
}

async function get(args) {
    const [id] = args;
    if (!id) {
        log('ERROR', 'Missing invoice ID');
        return;
    }

    try {
        const invoice = await request('GET', `/invoices/${id}`);
        log('INFO', 'Invoice Retrieved', { invoiceId: invoice.id, status: invoice.status });
        console.log(JSON.stringify(invoice, null, 2));
    } catch (error) {
        process.exit(1);
    }
}

async function send(args) {
    const [id] = args;
    if (!id) {
        log('ERROR', 'Missing invoice ID');
        return;
    }

    try {
        const result = await request('POST', `/invoices/${id}/send`);
        log('INFO', 'Invoice Sent', { invoiceId: id });
        console.log('Invoice sent successfully via email.');
    } catch (error) {
        process.exit(1);
    }
}

async function listOverdue() {
    try {
        // Assuming backend supports filter by status
        // Current implementation: listInvoices uses filters.status
        const invoices = await request('GET', '/invoices?status=OVERDUE'); // 'OVERDUE' logic depends on how statuses are managed. 
        // In i18n we saw 'overdue'. In code (Prompt 6), InvoiceService creates with 'PENDING'.
        // Does backend update to OVERDUE automatically? No, probably a scheduled task or manual.
        // Or query param supports it.
        // Let's assume we search for PENDING and filter by date locally if backend doesn't support 'overdue' logic directly?
        // Or just list PENDING for now as "Outstanding".
        // The user asked for "faturas vencidas".
        // Let's stick to listing ALL and filtering locally for now to be safe, or assume 'OVERDUE' status exists if job runs.
        // Actually, let's just list 'PENDING' and check dates.
        
        // Wait, prompt 6 code: `if (filters.status) where.status = filters.status;`
        // Statuses: PENDING, PAID. (Prompt 6 `invoice.service.ts` create sets PENDING, pay sets PAID).
        // It doesn't seem to have OVERDUE logic yet.
        // So I'll fetch PENDING and filter by date < now.
        
        const pending = await request('GET', '/invoices?status=PENDING');
        const now = new Date();
        const overdue = pending.filter(inv => new Date(inv.dueDate) < now);
        
        log('INFO', 'Overdue Invoices Found', { count: overdue.length });
        if (overdue.length === 0) {
            console.log("No overdue invoices.");
        } else {
            console.table(overdue.map(i => ({ id: i.id, client: i.client.name, amount: i.amount, due: i.dueDate })));
        }
    } catch (error) {
        process.exit(1);
    }
}

async function run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const commandArgs = args.slice(1);

    log('INFO', `Starting Invoice Skill: ${command}`);

    switch (command) {
        case 'create':
            await create(commandArgs);
            break;
        case 'get':
            await get(commandArgs);
            break;
        case 'send':
            await send(commandArgs);
            break;
        case 'list-overdue':
            await listOverdue();
            break;
        default:
            console.error('Unknown command. Available: create, get, send, list-overdue');
            process.exit(1);
    }
}

if (require.main === module) {
    run();
}

module.exports = { run };
