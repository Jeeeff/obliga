/**
 * Cashflow Monitor Skill
 * Monitors financial summary and cashflow projections.
 */

const { request, log } = require('./utils');

async function run() {
    log('INFO', 'Starting Cashflow Monitor...');

    try {
        // 1. Get Financial Summary
        const summary = await request('GET', '/openclaw/summary');
        log('INFO', 'Fetched Financial Summary', summary);

        // 2. Get Cashflow Projection
        const cashflow = await request('GET', '/openclaw/cashflow');
        
        // Analyze for issues
        const totalIncoming = cashflow.projection.incoming.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalOutgoing = cashflow.projection.outgoing.reduce((sum, item) => sum + Number(item.amount), 0);
        
        const netProjection = totalIncoming - totalOutgoing;

        console.log('\n--- CASHFLOW REPORT ---');
        console.log(`Tenant: ${summary.tenant}`);
        console.log(`Current Net Cashflow: ${summary.financials.netCashFlow}`);
        console.log(`Projected Incoming: ${totalIncoming}`);
        console.log(`Projected Outgoing: ${totalOutgoing}`); // Note: Outgoing might be 0 if amounts unknown
        console.log(`Net Projection: ${netProjection}`);
        
        if (netProjection < 0) {
            console.log('WARNING: Negative cashflow projected!');
        } else {
            console.log('STATUS: Healthy cashflow projection.');
        }

        return {
            status: 'success',
            data: { summary, projection: { totalIncoming, totalOutgoing } }
        };

    } catch (error) {
        log('ERROR', 'Cashflow Monitor Failed', { message: error.message });
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    run();
}

module.exports = { run };
