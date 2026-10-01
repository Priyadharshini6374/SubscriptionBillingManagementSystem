import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import { Search, CreditCard, Smartphone, Landmark, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PaymentList: React.FC = () => {
  const { payments, customers, invoices, processRefund } = useBilling();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Customer requested cancellation / trial dissatisfaction');

  const filteredPayments = payments.filter(p => {
    const cust = customers.find(c => c.id === p.customerId);
    const matchesSearch =
      p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust?.company.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      p.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenRefund = (pay: any) => {
    const remaining = pay.amount - (pay.refundedAmount || 0);
    setRefundAmount(remaining);
    setSelectedPaymentForRefund(pay);
  };

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentForRefund) return;

    processRefund(selectedPaymentForRefund.id, Number(refundAmount), refundReason);
    setSelectedPaymentForRefund(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment Transactions & Gateway Logs
          </h1>
          <p className="text-xs text-slate-500">
            Audit simulated payment gateway events, authorizations, and refunds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Total Transactions: <strong>{payments.length}</strong>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by transaction ref, customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Method Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment logs found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => {
                  const cust = customers.find(c => c.id === pay.customerId);
                  const canRefund = pay.status === 'succeeded' && (!pay.refundedAmount || pay.refundedAmount < pay.amount);

                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {pay.transactionRef}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {pay.date}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {cust?.company}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {cust?.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                          {pay.method}
                        </span>
                        {pay.methodDetails.cardLast4 && (
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {pay.methodDetails.cardBrand} •••• {pay.methodDetails.cardLast4}
                          </span>
                        )}
                        {pay.methodDetails.upiId && (
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {pay.methodDetails.upiId}
                          </span>
                        )}
                        {pay.methodDetails.bankName && (
                          <span className="text-[11px] text-slate-400 block">
                            {pay.methodDetails.bankName}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{pay.amount.toLocaleString('en-IN')}
                        {pay.refundedAmount ? (
                          <span className="text-[10px] text-purple-600 block">
                            (₹{pay.refundedAmount} refunded)
                          </span>
                        ) : null}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge status={pay.status} size="sm" />
                        {pay.failureReason && (
                          <span className="text-[10px] text-rose-500 block mt-0.5 truncate max-w-[150px]" title={pay.failureReason}>
                            {pay.failureReason}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {canRefund && (
                          <button
                            onClick={() => handleOpenRefund(pay)}
                            className="px-2.5 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold flex items-center gap-1 ml-auto transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Refund</span>
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

      {/* Process Refund Modal */}
      {selectedPaymentForRefund && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Process Simulated Refund
            </h3>
            <p className="text-xs text-slate-500">
              Refunding transaction <strong>{selectedPaymentForRefund.transactionRef}</strong> (Total: ₹{selectedPaymentForRefund.amount})
            </p>

            <form onSubmit={handleConfirmRefund} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Refund Amount (INR ₹)
                </label>
                <input
                  type="number"
                  step="any"
                  max={selectedPaymentForRefund.amount - (selectedPaymentForRefund.refundedAmount || 0)}
                  min={1}
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Refund Reason *
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Customer requested cancellation / trial dissatisfaction">Customer requested cancellation</option>
                  <option value="Accidental charge / double bill reconciliation">Accidental charge / double bill</option>
                  <option value="Goodwill gesture / SLA credit">Goodwill gesture / SLA credit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentForRefund(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
                >
                  Authorize Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
