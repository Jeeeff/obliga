/**
 * Payment Tracker Skill
 * Checks for overdue invoices and obligations.
 */

const { request, log } = require('./utils');

async function run() {
    log('INFO', 'Starting Payment Tracker...');

    try {
        const data = await request('GET', '/openclaw/alerts');
        const alerts = data.alerts || [];

        const overdueInvoices = alerts.filter(a => a.type === 'INVOICE_OVERDUE');
        const overdueObligations = alerts.filter(a => a.type === 'OBLIGATION_OVERDUE');

        console.log('\n--- PAYMENT ALERTS ---');
        
        if (alerts.length === 0) {
            console.log('No overdue payments or obligations found.');
        } else {
            if (overdueInvoices.length > 0) {
                console.log(`\n[!] OVERDUE INVOICES (${overdueInvoices.length}):`);
                overdueInvoices.forEach(inv => {
                    console.log(` - ${inv.message} (Due: ${new Date(inv.date).toLocaleDateString()})`);
                });
            }

            if (overdueObligations.length > 0) {
                console.log(`\n[!] OVERDUE OBLIGATIONS (${overdueObligations.length}):`);
                overdueObligations.forEach(obl => {
                    console.log(` - ${obl.message} (Due: ${new Date(obl.date).toLocaleDateString()})`);
                });
            }
        }

        log('INFO', 'Payment Tracker Check Complete', { 
            overdueInvoices: overdueInvoices.length,
            overdueObligations: overdueObligations.length 
        });

        return alerts;

    } catch (error) {
        log('ERROR', 'Payment Tracker Failed', { message: error.message });
        process.exit(1);
    }
}

if (require.main === module) {
    run();
}

module.exports = { run };
