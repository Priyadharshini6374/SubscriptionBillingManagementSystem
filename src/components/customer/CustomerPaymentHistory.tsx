import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { Badge } from '../common/Badge';
import { CreditCard, Smartphone, Landmark, CheckCircle2, AlertOctagon, RefreshCcw } from 'lucide-react';

export const CustomerPaymentHistory: React.FC = () => {
  const { currentCustomer, payments, invoices, setViewingInvoice } = useBilling();

  const customerPayments = payments.filter(p => p.customerId === currentCustomer?.id);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case 'upi': return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case 'netbanking': return <Landmark className="w-4 h-4 text-amber-500" />;
      default: return <CreditCard className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Payment History & Gateway Logs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed ledger of all simulated recurring charges, card debits, and UPI transactions
        </p>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Gateway Response / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customerPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                customerPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {pay.transactionRef}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {pay.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(pay.method)}
                        <span className="capitalize font-medium text-slate-700 dark:text-slate-200">
                          {pay.method}
                        </span>
                        {pay.methodDetails.cardLast4 && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            •••• {pay.methodDetails.cardLast4}
                          </span>
                        )}
                        {pay.methodDetails.upiId && (
                          <span className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
                            {pay.methodDetails.upiId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge status={pay.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs">
                      {pay.status === 'failed' ? (
                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                          {pay.failureReason || 'Declined by bank'}
                        </span>
                      ) : pay.status === 'refunded' ? (
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          Refunded: {pay.refundReason || 'Processed by finance'}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Authorized & Captured via Simulated Gateway
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
