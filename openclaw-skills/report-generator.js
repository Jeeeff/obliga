/**
 * Report Generator Skill
 * Aggregates all financial data into a text report.
 */

const { request, log } = require('./utils');

async function run() {
    log('INFO', 'Generating Comprehensive Report...');

    try {
        const [summary, alerts, cashflow] = await Promise.all([
            request('GET', '/openclaw/summary'),
            request('GET', '/openclaw/alerts'),
            request('GET', '/openclaw/cashflow')
        ]);

        const reportDate = new Date().toLocaleString();
        
        let report = `
========================================
       OBLIGA FINANCIAL REPORT
========================================
Generated: ${reportDate}
Tenant: ${summary.tenant}
----------------------------------------

1. FINANCIAL SUMMARY
   Total Invoiced:  ${summary.financials.totalInvoiced}
   Invoice Count:   ${summary.financials.invoiceCount}
   Net Cash Flow:   ${summary.financials.netCashFlow}

2. ALERTS & RISKS
   Active Alerts: ${alerts.alerts.length}
`;

        alerts.alerts.forEach(alert => {
            report += `   [${alert.type}] ${alert.message} (${new Date(alert.date).toLocaleDateString()})\n`;
        });

        const totalIncoming = cashflow.projection.incoming.reduce((sum, i) => sum + Number(i.amount), 0);
        
        report += `
3. CASHFLOW PROJECTION
   Projected Incoming: ${totalIncoming}
   Upcoming Inflows: ${cashflow.projection.incoming.length}
   Upcoming Outflows: ${cashflow.projection.outgoing.length}

========================================
        END OF REPORT
========================================
`;

        console.log(report);
        log('INFO', 'Report Generated Successfully');

        return report;

    } catch (error) {
        log('ERROR', 'Report Generation Failed', { message: error.message });
        process.exit(1);
    }
}

if (require.main === module) {
    run();
}

module.exports = { run };
