import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconPlus, IconPlans, IconCheck, IconEdit } from "../components/Icons";

function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/plans`);

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load plans from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const formatBillingCycle = (cycle) => {
    if (!cycle) return "";
    return cycle.charAt(0) + cycle.slice(1).toLowerCase();
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconPlans className="w-6 h-6 text-indigo-400" />
                Subscription Plans
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Configure billing frequencies, feature sets, and tier pricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/plans/create")}
              className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              <span>Create Plan</span>
            </button>
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchPlans} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving subscription plans..." />
          </GlassCard>
        ) : plans.length === 0 ? (
          <EmptyState
            icon={IconPlans}
            title="No subscription plans found"
            description="Create your initial pricing plan to start onboarding customers to recurring subscriptions."
            actionText="+ Create Plan"
            onAction={() => navigate("/plans/create")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isActive = plan.status === "ACTIVE";
              return (
                <GlassCard
                  key={plan.id}
                  hover
                  className={`p-6 flex flex-col justify-between border-white/10 ${
                    isActive ? "hover:border-indigo-500/40" : "opacity-85"
                  }`}
                >
                  <div>
                    {/* Top Row: Plan Name & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                          {plan.name}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                          {plan.description || "General subscription package"}
                        </p>
                      </div>
                      <GlassBadge status={plan.status} />
                    </div>

                    {/* Price Block */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-white tracking-tight">
                          ₹{Number(plan.price).toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          / {formatBillingCycle(plan.billingCycle)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Trial: <strong className="text-indigo-300">{plan.trialPeriod || 0} days</strong></span>
                        <span>•</span>
                        <span>Users: <strong className="text-slate-200">{plan.maximumUsers || "Unlimited"}</strong></span>
                        <span>•</span>
                        <span>Storage: <strong className="text-slate-200">{plan.storageLimit ? `${plan.storageLimit} GB` : "Unlimited"}</strong></span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-6">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Included Features
                      </div>
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        <ul className="space-y-2.5">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2.5 text-xs text-slate-300"
                            >
                              <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                <IconCheck className="w-2.5 h-2.5" />
                              </div>
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No custom feature bullets listed.</p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/plans/edit/${plan.id}`)}
                      className="flex-1 btn-secondary py-2 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <IconEdit className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit Plan</span>
                    </button>
                    <button
                      onClick={fetchPlans}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
                      title="Refresh plan details"
                    >
                      Refresh
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Plans;
