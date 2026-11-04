import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconInvoices, IconCreditCard } from "../components/Icons";

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/invoices/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load invoice.");
      }

      setInvoice(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div className="flex items-center gap-4">
              <BackButton to="/invoices" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconInvoices className="w-6 h-6 text-sky-400" />
                  Invoice {invoice?.invoiceNumber || `#${id}`}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Tax invoice & formal payment settlement statement
                </p>
              </div>
            </div>

            {invoice && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrint}
                  className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Print / PDF
                </button>

                {invoice.status !== "PAID" && (
                  <button
                    onClick={() => navigate(`/payments/create?invoiceId=${invoice.id}`)}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconCreditCard className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {error && <ErrorBanner message={error} onRetry={fetchInvoice} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving invoice document..." />
            </GlassCard>
          ) : !invoice ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Invoice document not found.
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-12 border-white/10 bg-[#0c1222]/90 shadow-2xl">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
                      S
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">SubBill Suite</span>
                  </div>
                  <p className="text-xs text-slate-400">Subscription & Recurring Billing Management</p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="mb-2">
                    <GlassBadge status={invoice.status} />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Invoice: {invoice.invoiceNumber}</p>
                  <p className="text-xs text-slate-400">
                    Date: {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Bill To & Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-white/10 text-xs">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Billed To:
                  </span>
                  <p className="text-base font-bold text-white">{invoice.user?.name || "Customer"}</p>
                  <p className="text-slate-300 mt-1">{invoice.user?.email}</p>
                  <p className="text-slate-400 mt-0.5">Account ID: #{invoice.userId}</p>
                </div>

                <div className="sm:text-right space-y-1.5">
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Payment Terms:
                  </span>
                  <p className="text-slate-300">
                    Due Date: <strong className="text-white">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-IN") : "Upon receipt"}</strong>
                  </p>
                  {invoice.subscription && (
                    <p className="text-slate-400">
                      Linked Plan: <span className="text-indigo-300 font-medium">{invoice.subscription.plan?.name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="py-8">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="pb-3">Description</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-right">Unit Price</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-4">
                        <p className="font-bold text-white">
                          {invoice.subscription?.plan?.name || "Subscription Fee"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Recurring service cycle billing
                        </p>
                      </td>
                      <td className="py-4 text-center text-slate-300">1</td>
                      <td className="py-4 text-right text-slate-300">
                        ₹{Number(invoice.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 text-right font-bold text-white">
                        ₹{Number(invoice.amount || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>₹{Number(invoice.amount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Applicable Tax:</span>
                    <span>₹{Number(invoice.tax || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-white/10">
                    <span>Total Amount:</span>
                    <span className="text-sky-400">
                      ₹{Number(invoice.totalAmount || (Number(invoice.amount || 0) + Number(invoice.tax || 0))).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-12 pt-6 border-t border-white/5 text-center text-[11px] text-slate-400">
                Thank you for your business. For any billing inquiries, please contact support.
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default InvoiceDetails;
