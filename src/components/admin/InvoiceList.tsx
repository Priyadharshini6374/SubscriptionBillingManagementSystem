import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import { Search, FileText, CheckCircle2, RefreshCw, Printer, DollarSign } from 'lucide-react';

export const InvoiceList: React.FC = () => {
  const { invoices, customers, setViewingInvoice, markInvoicePaid, settings } = useBilling();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter(inv => {
    const cust = customers.find(c => c.id === inv.customerId);
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust?.company.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (cust?.name.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.total, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'failed' || i.status === 'pending').reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Invoice & Billing Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Generate, audit, and track customer subscription tax invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            Collected: <span className="font-mono font-bold">₹{totalPaid.toLocaleString('en-IN')}</span>
          </div>
          {totalOutstanding > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 font-semibold">
              Failed/Due: <span className="font-mono font-bold">₹{totalOutstanding.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
          {['all', 'paid', 'failed', 'refunded', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">GST (18%)</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No invoices matching filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const cust = customers.find(c => c.id === inv.customerId);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {cust?.company || 'Unknown Customer'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {cust?.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {inv.issueDate}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                        ₹{inv.subtotal.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        ₹{inv.taxAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{inv.total.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge status={inv.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(inv.status === 'failed' || inv.status === 'pending') && (
                            <button
                              onClick={() => markInvoicePaid(inv.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              title="Mark as Paid manually"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Paid</span>
                            </button>
                          )}

                          <button
                            onClick={() => setViewingInvoice(inv)}
                            className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
