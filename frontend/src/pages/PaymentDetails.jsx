import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconPayments, IconRefunds } from "../components/Icons";

function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/payments/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment not found");
      }

      setPayment(data);
    } catch (err) {
      console.error("Failed to fetch payment:", err);
      setError(err.message || "Unable to load payment receipt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <BackButton to="/payments" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconPayments className="w-6 h-6 text-emerald-400" />
                  Payment Receipt
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Transaction details #{id}
                </p>
              </div>
            </div>

            {payment && payment.status === "SUCCESS" && (
              <button
                onClick={() => navigate(`/refunds/create?paymentId=${payment.id}`)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 text-purple-300 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer"
              >
                <IconRefunds className="w-3.5 h-3.5 text-purple-400" />
                <span>Issue Refund</span>
              </button>
            )}
          </div>

          {error && <ErrorBanner message={error} onRetry={fetchPayment} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving transaction record..." />
            </GlassCard>
          ) : !payment ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Payment record not found.
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10 space-y-8">
              {/* Top Banner with Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Amount Settled
                  </span>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <GlassBadge status={payment.status} />
                </div>
              </div>

              {/* Transaction Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Transaction ID
                  </span>
                  <p className="font-mono text-sm text-indigo-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 inline-block">
                    {payment.transactionId}
                  </p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Payment Channel
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {payment.paymentMethod || "UPI"}
                  </p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Account
                  </span>
                  <p className="text-sm font-bold text-white">{payment.user?.name || "Customer"}</p>
                  <p className="text-slate-400">{payment.user?.email}</p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Associated Invoice
                  </span>
                  <p className="text-sm font-mono font-medium text-sky-400">
                    {payment.invoice?.invoiceNumber || "-"}
                  </p>
                  {payment.invoice && (
                    <button
                      onClick={() => navigate(`/invoices/${payment.invoice.id}`)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition mt-1 underline"
                    >
                      View Linked Invoice
                    </button>
                  )}
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Payment Timestamp
                  </span>
                  <p className="text-sm text-slate-200">
                    {new Date(payment.paymentDate).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => navigate("/payments")}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ← Back to Transactions
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  Print Receipt
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default PaymentDetails;
