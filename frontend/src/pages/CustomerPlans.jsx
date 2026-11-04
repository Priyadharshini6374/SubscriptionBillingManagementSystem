import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconPlans, IconCheck } from "../components/Icons";

function CustomerPlans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/plans`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch plans");
      }

      const activePlans = Array.isArray(data)
        ? data.filter((plan) => plan.status === "ACTIVE")
        : [];

      setPlans(activePlans);
    } catch (err) {
      console.error("Customer plans error:", err);
      setError(err.message || "Unable to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const formatBillingCycle = (cycle) => {
    if (cycle === "MONTHLY") return "month";
    if (cycle === "QUARTERLY") return "quarter";
    if (cycle === "YEARLY") return "year";
    return cycle?.toLowerCase() || "cycle";
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Subscription Tiers
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Pick the optimal plan for your organizational scale and access premier billing privileges
          </p>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchPlans} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Loading subscription plans..." />
          </GlassCard>
        ) : plans.length === 0 ? (
          <GlassCard className="p-12 text-center text-slate-400">
            No active subscription packages currently available for subscription.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <GlassCard
                key={plan.id}
                hover
                className="p-8 flex flex-col justify-between border-white/10 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                        {plan.description || "Recurring service plan"}
                      </p>
                    </div>
                    <GlassBadge status="ACTIVE" label="Available" />
                  </div>

                  {/* Price */}
                  <div className="my-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        ₹{Number(plan.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {formatBillingCycle(plan.billingCycle)}
                      </span>
                    </div>
                    {plan.trialPeriod > 0 && (
                      <p className="text-[11px] text-sky-400 font-medium mt-1">
                        Includes {plan.trialPeriod}-day risk-free trial
                      </p>
                    )}
                  </div>

                  {/* Limits and quotas */}
                  <div className="space-y-2 py-3 border-y border-white/5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">User Seats:</span>
                      <span className="font-semibold text-white">{plan.maximumUsers || "Unlimited"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Storage Capacity:</span>
                      <span className="font-semibold text-white">{plan.storageLimit ? `${plan.storageLimit} GB` : "Unlimited"}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Included Capabilities:
                    </span>
                    {Array.isArray(plan.features) && plan.features.length > 0 ? (
                      plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <IconCheck className="w-2.5 h-2.5" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">All core features included.</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={() => navigate(`/customer/subscribe/${plan.id}`)}
                    className="w-full btn-primary py-3 rounded-xl font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-950/50"
                  >
                    <span>Subscribe to {plan.name}</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerPlans;
