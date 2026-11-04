import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../api";
import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconInvoices, IconCreditCard } from "../components/Icons";

function CustomerInvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer authentication not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/invoices/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load invoice.");
        }

        const invoiceUserId = Number(data.user?.id || data.userId);
        const loggedInUserId = Number(customerUser.id);

        if (invoiceUserId !== loggedInUserId) {
          setError("You are not authorized to view this invoice.");
          setLoading(false);
          return;
        }

        setInvoice(data);
      } catch (err) {
        console.error("Invoice details error:", err);
        setError(err.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, customerUser?.id]);

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-4xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/invoices" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconInvoices className="w-6 h-6 text-sky-400" />
                Invoice {invoice?.invoiceNumber || `#${id}`}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Billing statement and breakdown
              </p>
            </div>
          </div>

          {invoice && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => window.print()}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Print / Save PDF
              </button>

              {(invoice.status === "PENDING" || invoice.status === "OVERDUE") && (
                <button
                  onClick={() => navigate(`/customer/pay/${invoice.id}`)}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <IconCreditCard className="w-3.5 h-3.5" />
                  <span>Pay Invoice</span>
                </button>
              )}
            </div>
          )}
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving invoice statement..." />
          </GlassCard>
        ) : !invoice ? (
          <GlassCard className="p-8 text-center text-slate-400">
            Invoice not available.
          </GlassCard>
        ) : (
          <GlassCard className="p-8 sm:p-12 border-white/10 bg-[#0c1222]/90 shadow-2xl">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-base">
                    S
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">SubBill Customer Invoice</span>
                </div>
                <p className="text-xs text-slate-400">Official statement of subscription charges</p>
              </div>

              <div className="sm:text-right">
                <div className="mb-2">
                  <GlassBadge status={invoice.status} />
                </div>
                <p className="text-xs text-slate-400 font-mono">Invoice: {invoice.invoiceNumber}</p>
                <p className="text-xs text-slate-400">
                  Issued: {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Bill Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-white/10 text-xs">
              <div>
                <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Customer Information:
                </span>
                <p className="text-base font-bold text-white">{customerUser?.name}</p>
                <p className="text-slate-300 mt-0.5">{customerUser?.email}</p>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Payment Status:
                </span>
                <p className="text-slate-300">
                  Due: <strong className="text-white">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-IN") : "Upon Receipt"}</strong>
                </p>
                {invoice.subscription && (
                  <p className="text-slate-400">
                    Plan: <span className="text-sky-300 font-medium">{invoice.subscription.plan?.name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Line */}
            <div className="py-8">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-center">Quantity</th>
                    <th className="pb-3 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4">
                      <p className="font-bold text-white">
                        {invoice.subscription?.plan?.name || "Subscription Membership"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Platform usage fee
                      </p>
                    </td>
                    <td className="py-4 text-center text-slate-300">1</td>
                    <td className="py-4 text-right font-bold text-white">
                      ₹{Number(invoice.amount || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹{Number(invoice.amount || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax:</span>
                  <span>₹{Number(invoice.tax || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-white/10">
                  <span>Total Payable:</span>
                  <span className="text-sky-400">
                    ₹{Number(invoice.totalAmount || (Number(invoice.amount || 0) + Number(invoice.tax || 0))).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default CustomerInvoiceDetails;
