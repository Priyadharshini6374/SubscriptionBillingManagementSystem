import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { FileSpreadsheet, Download, FileText, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  const { payments, invoices, subscriptions, customers, plans, analytics, settings } = useBilling();

  // Helper to trigger CSV download
  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTransactions = () => {
    const headers = ['Transaction Ref', 'Date', 'Customer ID', 'Customer Company', 'Amount (INR)', 'Currency', 'Method', 'Status', 'Refunded Amount', 'Failure Reason'];
    const rows = payments.map(p => {
      const cust = customers.find(c => c.id === p.customerId);
      return [
        p.transactionRef,
        p.date,
        p.customerId,
        `"${cust?.company || ''}"`,
        p.amount,
        p.currency,
        p.method,
        p.status,
        p.refundedAmount || 0,
        `"${p.failureReason || ''}"`
      ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`transactions_report_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const handleExportInvoices = () => {
    const headers = ['Invoice Number', 'Issue Date', 'Customer Company', 'Subtotal', 'Tax Rate (%)', 'Tax Amount', 'Discount Amount', 'Total (INR)', 'Status', 'Paid Date'];
    const rows = invoices.map(i => {
      const cust = customers.find(c => c.id === i.customerId);
      return [
        i.invoiceNumber,
        i.issueDate,
        `"${cust?.company || ''}"`,
        i.subtotal,
        i.taxRate,
        i.taxAmount,
        i.discountAmount,
        i.total,
        i.status,
        i.paidDate || 'N/A'
      ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`invoices_gst_ledger_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const handleExportSubscriptions = () => {
    const headers = ['Subscription ID', 'Customer Company', 'Plan', 'Billing Cycle', 'Status', 'Period Start', 'Period End', 'Recurring Amount (INR)', 'Auto Renew'];
    const rows = subscriptions.map(s => {
      const cust = customers.find(c => c.id === s.customerId);
      const plan = plans.find(p => p.id === s.planId);
      return [
        s.id,
        `"${cust?.company || ''}"`,
        plan?.name || '',
        s.billingCycle,
        s.status,
        s.currentPeriodStart,
        s.currentPeriodEnd,
        s.nextBillingAmount,
        s.autoRenew ? 'YES' : 'NO'
      ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`subscriptions_audit_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  // Tax calculations
  const totalTaxCollected = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.taxAmount, 0);

  const taxableTurnover = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + (curr.subtotal - curr.discountAmount), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial Statements & Compliance Reports
          </h1>
          <p className="text-xs text-slate-500">
            Export reconciliation sheets for bookkeeping, GST filing, and investor updates
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">
          GSTIN: {settings.gstin}
        </span>
      </div>

      {/* 3 Downloadable Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Report 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Transactions & Settlements Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Includes full transaction references, simulated card/UPI payment methods, and failure logs.
            </p>
            <div className="mt-4 text-xs font-mono text-slate-400">
              {payments.length} records available
            </div>
          </div>

          <button
            onClick={handleExportTransactions}
            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Ledger</span>
          </button>
        </div>

        {/* Report 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Invoices & GST Tax Filing Sheet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Audit table of issued invoices with 18% GST tax segregation and promotional coupon deductions.
            </p>
            <div className="mt-4 text-xs font-mono text-slate-400">
              {invoices.length} invoices generated
            </div>
          </div>

          <button
            onClick={handleExportInvoices}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Tax Sheet</span>
          </button>
        </div>

        {/* Report 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Active Subscriptions & MRR Run
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete customer contract register with renewal schedules, cycle lengths, and auto-renew flags.
            </p>
            <div className="mt-4 text-xs font-mono text-slate-400">
              {subscriptions.length} subscription contracts
            </div>
          </div>

          <button
            onClick={handleExportSubscriptions}
            className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit CSV</span>
          </button>
        </div>

      </div>

      {/* Tax & Reconciliation Summary Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          GST 18% Tax Audit & Reconciliation Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 block mb-1">Taxable Turnover</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
              ₹{taxableTurnover.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Excluding tax and promotional discounts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 block mb-1">Total GST Collected (18%)</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{totalTaxCollected.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Eligible for output tax liability offset
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 block mb-1">Net Realized Cashflow</span>
            <span className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
              ₹{analytics.netRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Total received in simulated gateway
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
