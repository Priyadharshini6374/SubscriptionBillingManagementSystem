import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconSubscriptions, IconPlans, IconCheck, IconEdit } from "../components/Icons";

function CustomerSubscription() {
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer authentication not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/subscriptions?userId=${customerUser.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription records");
        }

        const data = await response.json();

        const activeSub = Array.isArray(data)
          ? data.find(
              (item) =>
                item.userId === customerUser.id &&
                ["ACTIVE", "TRIAL"].includes(item.status)
            )
          : null;

        setSubscription(activeSub || null);
      } catch (err) {
        console.error("Subscription error:", err);
        setError(err.message || "Failed to load subscription.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [customerUser?.id]);

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-4xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/dashboard" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconSubscriptions className="w-6 h-6 text-sky-400" />
                My Active Subscription
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your recurring service plan and renewal terms
              </p>
            </div>
          </div>

          {subscription && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate(`/customer/change-plan/${subscription.id}`)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <IconEdit className="w-3.5 h-3.5 text-sky-400" />
                <span>Switch Plan</span>
              </button>

              <button
                onClick={() => navigate(`/customer/cancel-subscription/${subscription.id}`)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition cursor-pointer"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving subscription status..." />
          </GlassCard>
        ) : !subscription ? (
          <EmptyState
            icon={IconSubscriptions}
            title="No active subscription found"
            description="You do not currently have an active plan license. Browse our pricing tiers to unlock platform features."
            actionText="Explore Available Plans"
            onAction={() => navigate("/customer/plans")}
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Subscription Card */}
            <GlassCard className="p-8 border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <IconPlans className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        {subscription.plan?.name}
                      </h2>
                      <GlassBadge status={subscription.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {subscription.plan?.description || "Recurring software license"}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-3xl font-extrabold text-white">
                    ₹{subscription.plan?.price}
                  </span>
                  <span className="text-xs text-slate-400 block capitalize">
                    Per {subscription.plan?.billingCycle?.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Subscription Timeline & Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Subscription ID
                  </span>
                  <p className="font-mono text-sm font-medium text-sky-400">
                    #{subscription.id}
                  </p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Enrolled Date
                  </span>
                  <p className="text-sm font-medium text-white">
                    {new Date(subscription.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Renewal / Period End
                  </span>
                  <p className="text-sm font-medium text-white">
                    {subscription.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Automatic continuous renewal"}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Plan Entitlements Card */}
            {subscription.plan && (
              <GlassCard className="p-6 border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Plan Entitlements & Features
                </h3>
                {Array.isArray(subscription.plan.features) && subscription.plan.features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subscription.plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <IconCheck className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Standard plan features active.</p>
                )}
              </GlassCard>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerSubscription;
