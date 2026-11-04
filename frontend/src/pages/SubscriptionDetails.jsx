import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconSubscriptions, IconPlans, IconEdit, IconAlertCircle } from "../components/Icons";

function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscription();
  }, [id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/subscriptions/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load subscription.");
      }

      setSubscription(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <BackButton to="/subscriptions" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconSubscriptions className="w-6 h-6 text-indigo-400" />
                  Subscription Details
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  License agreement #{id} lifecycle and billing timeline
                </p>
              </div>
            </div>

            {subscription && subscription.status !== "CANCELLED" && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate(`/subscriptions/change-plan/${id}`)}
                  className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <IconEdit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Change Plan</span>
                </button>

                <button
                  onClick={() => navigate(`/subscriptions/cancel/${id}`)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {error && <ErrorBanner message={error} onRetry={fetchSubscription} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving subscription telemetry..." />
            </GlassCard>
          ) : !subscription ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Subscription record not found.
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {/* Primary Header Card */}
              <GlassCard className="p-8 border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <IconPlans className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-white tracking-tight">
                          {subscription.plan?.name || "Active Plan"}
                        </h2>
                        <GlassBadge status={subscription.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Subscribed by <span className="text-slate-200 font-semibold">{subscription.user?.name || "Customer"}</span> ({subscription.user?.email || "No email"})
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-extrabold text-white">
                      ₹{Number(subscription.plan?.price || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      Per {subscription.plan?.billingCycle?.toLowerCase() || "cycle"}
                    </p>
                  </div>
                </div>

                {/* Key Lifecycle Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs">
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-slate-400">
                      Subscription ID
                    </span>
                    <p className="mt-1 text-sm font-mono font-medium text-indigo-300">
                      #{subscription.id}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold uppercase tracking-wider text-slate-400">
                      Created On
                    </span>
                    <p className="mt-1 text-sm font-medium text-white">
                      {new Date(subscription.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold uppercase tracking-wider text-slate-400">
                      Period Start
                    </span>
                    <p className="mt-1 text-sm font-medium text-white">
                      {subscription.currentPeriodStart
                        ? new Date(subscription.currentPeriodStart).toLocaleDateString("en-IN")
                        : "Immediate"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold uppercase tracking-wider text-slate-400">
                      Current Period End
                    </span>
                    <p className="mt-1 text-sm font-medium text-white">
                      {subscription.currentPeriodEnd
                        ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Indefinite"}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Plan Features Card */}
              {subscription.plan && (
                <GlassCard className="p-6 border-white/10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                    Enrolled Plan Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-slate-400">Trial Period</span>
                      <p className="text-sm font-semibold text-white mt-0.5">{subscription.plan.trialPeriod || 0} Days</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-slate-400">Max Seat Allocation</span>
                      <p className="text-sm font-semibold text-white mt-0.5">{subscription.plan.maximumUsers || "Unlimited"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-slate-400">Storage Quota</span>
                      <p className="text-sm font-semibold text-white mt-0.5">{subscription.plan.storageLimit ? `${subscription.plan.storageLimit} GB` : "Unlimited"}</p>
                    </div>
                  </div>

                  {Array.isArray(subscription.plan.features) && subscription.plan.features.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">Features:</span>
                      <div className="flex flex-wrap gap-2">
                        {subscription.plan.features.map((feat, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SubscriptionDetails;
