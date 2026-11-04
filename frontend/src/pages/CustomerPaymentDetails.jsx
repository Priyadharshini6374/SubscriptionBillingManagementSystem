import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconPayments } from "../components/Icons";

function CustomerPaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer authentication not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/payments/${id}?userId=${customerUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load payment details.");
        }

        const paymentUserId = Number(data.user?.id || data.userId);
        const loggedInUserId = Number(customerUser.id);

        if (paymentUserId !== loggedInUserId) {
          setError("You are not authorized to view this payment.");
          return;
        }

        setPayment(data);
      } catch (err) {
        console.error("Payment details error:", err);
        setError(err.message || "Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id, customerUser?.id]);

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-2xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/payments" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconPayments className="w-6 h-6 text-emerald-400" />
                Payment Receipt
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Official transaction record #{id}
              </p>
            </div>
          </div>

          {payment && (
            <button
              onClick={() => window.print()}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Print Receipt
            </button>
          )}
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving transaction receipt..." />
          </GlassCard>
        ) : !payment ? (
          <GlassCard className="p-8 text-center text-slate-400">
            Payment receipt unavailable.
          </GlassCard>
        ) : (
          <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
            {/* Amount Banner */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Payment Amount
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  ₹{Number(payment.amount).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <GlassBadge status={payment.status} />
              </div>
            </div>

            {/* Receipt Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Transaction Reference
                </span>
                <p className="font-mono text-sm text-indigo-300 bg-white/[0.03] p-2 rounded-lg border border-white/5 inline-block">
                  {payment.transactionId}
                </p>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Payment Gateway
                </span>
                <p className="text-sm font-semibold text-white">
                  {payment.paymentMethod || "UPI"}
                </p>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Settlement Date
                </span>
                <p className="text-sm text-slate-200">
                  {new Date(payment.paymentDate).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Invoice Settled
                </span>
                <p className="text-sm font-mono text-sky-400 font-medium">
                  {payment.invoice?.invoiceNumber || `Invoice #${payment.invoiceId || "-"}`}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => navigate("/customer/payments")}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                ← Back to Payments
              </button>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default CustomerPaymentDetails;
