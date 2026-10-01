import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import {
  DollarSign,
  RotateCcw,
  AlertTriangle,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingDown,
  ShieldAlert,
  Download,
  CreditCard,
  FileText
} from 'lucide-react';

interface FinanceDashboardProps {
  onNavigate: (tab: string) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ onNavigate }) => {
  const { analytics, payments, invoices, setViewingInvoice } = useBilling();

  const refundCount = payments.filter(p => p.refundedAmount && p.refundedAmount > 0).length;
  const failedRevenue = invoices.filter(i => i.status === 'failed').reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      
      {/* Finance Role Restriction Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Finance Manager Access Mode
            </span>
            <p className="text-amber-700 dark:text-amber-400">
              Full visibility over Payments, Invoices, Refunds, and Financial Audits. Plan pricing and user accounts are read-only.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export Reports</span>
        </button>
      </div>

      {/* Top 4 Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Collections */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Gross Collections
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{analytics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {payments.filter(p => p.status === 'succeeded' || p.status === 'refunded').length} successful charges
          </span>
        </div>

        {/* Net Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Net Realized Revenue
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{analytics.netRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Gross less refunds issued
          </span>
        </div>

        {/* Refunds Issued */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Refunds Issued
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            ₹{analytics.totalRefunds.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {refundCount} transactions adjusted
          </span>
        </div>

        {/* At-Risk Dunning */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Failed / Outstanding Dunning
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            ₹{failedRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center mt-1">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Pending automated retry
          </span>
        </div>

      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('refunds')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Refunds & Disputes Engine →
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Authorize full or partial refunds on customer transactions with audit logging.
          </p>
        </button>

        <button
          onClick={() => onNavigate('invoices')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Tax Invoices & Reconciliation →
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile paid invoices, resolve failed renewals, and view GST breakdowns.
          </p>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Financial Statements & Exports →
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Download CSV audit ledgers for bookkeeping and accountant compliance.
          </p>
        </button>
      </div>

      {/* Recent High-Value Transactions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent Settlements & Gateway Dispatches
            </h3>
            <p className="text-xs text-slate-500">
              Live authorization stream from mock payment gateways
            </p>
          </div>
          <button
            onClick={() => onNavigate('payments')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all payments
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2.5 px-3">Transaction Ref</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.slice(0, 5).map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {pay.transactionRef}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {pay.date}
                  </td>
                  <td className="py-3 px-3 uppercase text-slate-600 dark:text-slate-300">
                    {pay.method}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge status={pay.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
