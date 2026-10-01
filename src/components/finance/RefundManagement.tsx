import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import { RotateCcw, Search, CheckCircle2, AlertCircle, DollarSign, X } from 'lucide-react';

export const RefundManagement: React.FC = () => {
  const { payments, customers, invoices, processRefund } = useBilling();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Customer dissatisfaction within trial window');

  const eligiblePayments = payments.filter(p => p.status === 'succeeded' || p.status === 'refunded');

  const filtered = eligiblePayments.filter(p => {
    const cust = customers.find(c => c.id === p.customerId);
    return (
      p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust?.company.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      p.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenRefund = (p: any) => {
    const remaining = p.amount - (p.refundedAmount || 0);
    setRefundAmount(remaining);
    setSelectedPayment(p);
  };

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    processRefund(selectedPayment.id, Number(refundAmount), refundReason);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Refunds & Dispute Resolution
          </h1>
          <p className="text-xs text-slate-500">
            Process full and partial credit reversals to simulated customer payment accounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            Total Reversals: ₹{payments.reduce((acc, curr) => acc + (curr.refundedAmount || 0), 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by transaction ref, company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Original Amount</th>
                <th className="py-3 px-4 text-right">Refunded</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Refund Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((pay) => {
                  const cust = customers.find(c => c.id === pay.customerId);
                  const remaining = pay.amount - (pay.refundedAmount || 0);
                  const isFullyRefunded = remaining <= 0;

                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {pay.transactionRef}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {pay.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {cust?.company}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-slate-600 dark:text-slate-300">
                        {pay.method}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-purple-600 dark:text-purple-400 font-semibold">
                        ₹{(pay.refundedAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge status={pay.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isFullyRefunded ? (
                          <span className="text-[11px] text-slate-400 italic">Fully Refunded</span>
                        ) : (
                          <button
                            onClick={() => handleOpenRefund(pay)}
                            className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1 ml-auto transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Issue Refund</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Authorize Simulated Refund
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Refunding transaction <strong>{selectedPayment.transactionRef}</strong>. Remaining refundable balance: <strong className="font-mono text-slate-900 dark:text-white">₹{selectedPayment.amount - (selectedPayment.refundedAmount || 0)}</strong>
            </p>

            <form onSubmit={handleProcessRefund} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Refund Amount (INR ₹)
                </label>
                <input
                  type="number"
                  step="any"
                  max={selectedPayment.amount - (selectedPayment.refundedAmount || 0)}
                  min={1}
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Audit Reason for Refund *
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Customer dissatisfaction within trial window">Customer dissatisfaction within trial window</option>
                  <option value="Duplicate billing error / reconciliation">Duplicate billing error / reconciliation</option>
                  <option value="Plan downgrade prorated credit reversal">Plan downgrade prorated credit reversal</option>
                  <option value="Service downtime compensation">Service downtime compensation</option>
                  <option value="Chargeback dispute settlement">Chargeback dispute settlement</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
                >
                  Execute Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
