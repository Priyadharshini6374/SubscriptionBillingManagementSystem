import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconRefunds, IconCheck, IconClose } from "../components/Icons";

function RefundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchRefund = () => {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/refunds/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch refund details");
        }
        return response.json();
      })
      .then((data) => {
        setRefund(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load refund details.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRefund();
  }, [id]);

  const updateRefundStatus = async (status) => {
    const action =
      status === "COMPLETED"
        ? "complete this refund"
        : "mark this refund as failed";

    const confirmed = window.confirm(
      `Are you sure you want to ${action}?`
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      setError("");

      const response = await fetch(`${API_URL}/api/refunds/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update refund status");
      }

      setRefund(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update refund status.");
    } finally {
      setUpdating(false);
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
              <BackButton to="/refunds" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconRefunds className="w-6 h-6 text-purple-400" />
                  Refund Entry #{id}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Dispute resolution and credit ledger voucher
                </p>
              </div>
            </div>

            {refund && refund.status === "PROCESSING" && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => updateRefundStatus("COMPLETED")}
                  disabled={updating}
                  className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
                >
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>

                <button
                  onClick={() => updateRefundStatus("FAILED")}
                  disabled={updating}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  <IconClose className="w-3.5 h-3.5 inline mr-1" />
                  <span>Mark Failed</span>
                </button>
              </div>
            )}
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving refund data..." />
            </GlassCard>
          ) : !refund ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Refund details unavailable.
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
              {/* Header Tile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Refund Amount
                  </span>
                  <p className="text-3xl font-extrabold text-rose-300 mt-1">
                    ₹{Number(refund.amount).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <GlassBadge status={refund.status} />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Account
                  </span>
                  <p className="text-sm font-bold text-white">{refund.payment?.user?.name || "Customer"}</p>
                  <p className="text-slate-400">{refund.payment?.user?.email}</p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Original Payment Transaction
                  </span>
                  <p className="font-mono text-sm text-indigo-300 bg-white/[0.03] p-2 rounded-lg border border-white/5 inline-block">
                    {refund.payment?.transactionId || "-"}
                  </p>
                  <p className="text-slate-400 mt-1">
                    Settled Amount: ₹{Number(refund.payment?.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Stated Reason
                  </span>
                  <p className="text-sm text-slate-200 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    {refund.reason || "No custom reason provided."}
                  </p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Timestamp
                  </span>
                  <p className="text-sm text-slate-300">
                    {new Date(refund.refundDate).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => navigate("/refunds")}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ← Back to Refunds
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default RefundDetails;
