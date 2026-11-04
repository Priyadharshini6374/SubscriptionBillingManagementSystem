import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconRefunds, IconPlus } from "../components/Icons";

function CreateRefund() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPaymentId = searchParams.get("paymentId");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    paymentId: preselectedPaymentId || "",
    amount: "",
    reason: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/payments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }
        return response.json();
      })
      .then((data) => {
        const successfulPayments = Array.isArray(data)
          ? data.filter((payment) => payment.status === "SUCCESS")
          : [];
        setPayments(successfulPayments);

        if (preselectedPaymentId) {
          const matched = successfulPayments.find(
            (p) => String(p.id) === preselectedPaymentId
          );
          if (matched) {
            setFormData((prev) => ({
              ...prev,
              paymentId: preselectedPaymentId,
              amount: String(matched.amount),
            }));
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load successful payments list.");
        setLoading(false);
      });
  }, [preselectedPaymentId]);

  const selectedPayment = payments.find(
    (payment) => payment.id === Number(formData.paymentId)
  );

  const handlePaymentChange = (event) => {
    const paymentId = event.target.value;
    const payment = payments.find((item) => item.id === Number(paymentId));

    setFormData({
      ...formData,
      paymentId,
      amount: payment ? String(payment.amount) : "",
    });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.paymentId) {
      setError("Please select a transaction to refund.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid refund amount.");
      return;
    }

    if (selectedPayment && Number(formData.amount) > Number(selectedPayment.amount)) {
      setError(
        `Refund cannot exceed original transaction fee of ₹${selectedPayment.amount}.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/refunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: Number(formData.paymentId),
          amount: Number(formData.amount),
          reason: formData.reason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process refund");
      }

      navigate("/refunds");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to issue refund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/refunds" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconRefunds className="w-6 h-6 text-purple-400" />
                  Issue Payment Refund
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Process full or partial settlement credit to customer account
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving eligible payment records..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Payment */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Settled Transaction <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.paymentId}
                    onChange={handlePaymentChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Choose settled payment...</option>
                    {payments.map((p) => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                        {p.transactionId} — {p.user?.name} (₹{p.amount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Payment Snapshot */}
                {selectedPayment && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Customer:</span>
                      <span className="font-semibold text-white">{selectedPayment.user?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Invoice Number:</span>
                      <span className="font-mono text-indigo-300">{selectedPayment.invoice?.invoiceNumber || "-"}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Max Refundable:</span>
                      <span className="font-bold text-emerald-400">₹{selectedPayment.amount}</span>
                    </div>
                  </div>
                )}

                {/* Refund Amount */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Refund Amount (INR ₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    min="1"
                    step="any"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    required
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Refund Reason
                  </label>
                  <textarea
                    rows="3"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g. Customer requested plan cancellation within grace period"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/refunds")}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4" />
                        <span>Issue Refund</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreateRefund;
