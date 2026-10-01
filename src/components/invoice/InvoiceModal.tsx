import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { Printer, Download, X, CheckCircle, AlertOctagon, RefreshCcw } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { viewingInvoice, setViewingInvoice, customers, settings, payments } = useBilling();

  if (!viewingInvoice) return null;

  const customer = customers.find(c => c.id === viewingInvoice.customerId);
  const payment = payments.find(p => p.invoiceId === viewingInvoice.id && p.status === 'succeeded');

  const handlePrint = () => {
    window.print();
  };

  const getStatusStamp = () => {
    switch (viewingInvoice.status) {
      case 'paid':
        return (
          <div className="border-4 border-emerald-600/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-2xl uppercase tracking-widest px-4 py-1.5 rounded-xl rotate-[-8deg] shadow-sm select-none">
            PAID
          </div>
        );
      case 'failed':
        return (
          <div className="border-4 border-rose-600/60 text-rose-700 dark:text-rose-400 font-extrabold text-2xl uppercase tracking-widest px-4 py-1.5 rounded-xl rotate-[-8deg] shadow-sm select-none">
            PAYMENT FAILED
          </div>
        );
      case 'refunded':
        return (
          <div className="border-4 border-purple-600/60 text-purple-700 dark:text-purple-400 font-extrabold text-2xl uppercase tracking-widest px-4 py-1.5 rounded-xl rotate-[-8deg] shadow-sm select-none">
            REFUNDED
          </div>
        );
      case 'pending':
        return (
          <div className="border-4 border-amber-600/60 text-amber-700 dark:text-amber-400 font-extrabold text-2xl uppercase tracking-widest px-4 py-1.5 rounded-xl rotate-[-8deg] shadow-sm select-none">
            PENDING
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Controls (No Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Tax Invoice Preview:
            </span>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {viewingInvoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={() => setViewingInvoice(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                  ⚡
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {settings.companyName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
                {settings.companyAddress}
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 font-mono">
                <p>Email: {settings.companyEmail}</p>
                <p>GSTIN: {settings.gstin}</p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              {getStatusStamp()}
              <div className="mt-4 text-xs space-y-1 sm:text-right">
                <div>
                  <span className="text-slate-400">Invoice No:</span>{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {viewingInvoice.invoiceNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Issue Date:</span>{' '}
                  <span className="font-medium">{viewingInvoice.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Due Date:</span>{' '}
                  <span className="font-medium">{viewingInvoice.dueDate}</span>
                </div>
                {viewingInvoice.paidDate && (
                  <div>
                    <span className="text-slate-400">Payment Date:</span>{' '}
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{viewingInvoice.paidDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Billed To
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                {customer?.company || 'Valued Customer'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Attn: {customer?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {customer?.email} • {customer?.phone}
              </p>
              {customer?.address && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {customer.address.line1}, {customer.address.city}, {customer.address.state} - {customer.address.pincode}
                </p>
              )}
            </div>

            <div className="sm:text-right flex flex-col justify-end text-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Billing Method
              </span>
              <p className="font-medium text-slate-700 dark:text-slate-200">
                {payment ? (
                  <>
                    Paid via <span className="font-semibold uppercase">{payment.method}</span>
                    {payment.methodDetails.cardLast4 && ` (Ending in ${payment.methodDetails.cardLast4})`}
                    {payment.methodDetails.upiId && ` (${payment.methodDetails.upiId})`}
                  </>
                ) : (
                  viewingInvoice.status === 'failed' ? 'Failed charge attempt' : 'Simulated Gateway Account'
                )}
              </p>
              {payment && (
                <p className="font-mono text-[11px] text-slate-400">
                  Ref: {payment.transactionRef}
                </p>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2">Item Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {viewingInvoice.items.map((item) => (
                  <tr key={item.id} className="text-slate-800 dark:text-slate-200">
                    <td className="py-3.5 px-2 font-medium">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-500">{item.quantity}</td>
                    <td className="py-3.5 px-2 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-semibold">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-6 border-t border-slate-200 dark:border-slate-800 gap-6">
            <div className="text-xs text-slate-500 max-w-sm space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Payment Terms & Notes:</p>
              <p>This is a computer-generated simulated invoice issued for subscription billing test purposes.</p>
              <p className="font-mono text-[11px] text-indigo-500">Platform: BillSphere SaaS Billing Engine</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">₹{viewingInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {viewingInvoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount ({viewingInvoice.couponCode || 'Applied'}):</span>
                  <span className="font-mono">-₹{viewingInvoice.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST ({viewingInvoice.taxRate}%):</span>
                <span className="font-mono">₹{viewingInvoice.taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  ₹{viewingInvoice.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center text-xs text-slate-400">
            Thank you for choosing {settings.companyName}. For billing questions, reach us at {settings.companyEmail}
          </div>

        </div>

      </div>
    </div>
  );
};
