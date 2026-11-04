import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../api";
import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconSubscriptions } from "../components/Icons";

function CustomerChangePlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionResponse, plansResponse] = await Promise.all([
          fetch(`${API_URL}/api/subscriptions/${id}`),
          fetch(`${API_URL}/api/plans`),
        ]);

        if (!subscriptionResponse.ok || !plansResponse.ok) {
          throw new Error("Failed to load subscription data");
        }

        const subscriptionData = await subscriptionResponse.json();
        const plansData = await plansResponse.json();

        setSubscription(subscriptionData);

        const activePlans = Array.isArray(plansData)
          ? plansData.filter((plan) => plan.status === "ACTIVE")
          : [];

        setPlans(activePlans);

        if (subscriptionData.plan?.id) {
          setSelectedPlan(String(subscriptionData.plan.id));
        }
      } catch (err) {
        console.error("Change plan error:", err);
        setError("Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChangePlan = async () => {
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }

    if (Number(selectedPlan) === Number(subscription?.plan?.id)) {
      setError("Please select a different plan.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/subscriptions/${id}/change-plan`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: Number(selectedPlan),
            newPlanId: Number(selectedPlan),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change subscription plan.");
      }

      navigate("/customer/subscription");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-2xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/subscription" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconSubscriptions className="w-6 h-6 text-sky-400" />
                Change Subscription Plan
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Upgrade or switch to a different recurring tier
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Loading plan options..." />
          </GlassCard>
        ) : (
          <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
            {/* Current Plan Indicator */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">
                  Current Plan
                </span>
                <p className="text-base font-bold text-white mt-0.5">
                  {subscription?.plan?.name}
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-sky-400">
                  ₹{subscription?.plan?.price}
                </span>
                <span className="text-slate-400 block capitalize">
                  Per {subscription?.plan?.billingCycle?.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Select New Plan */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select New Plan Tier <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
              >
                {plans.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    className="bg-slate-900 text-white"
                    disabled={p.id === subscription?.plan?.id}
                  >
                    {p.name} — ₹{p.price} / {p.billingCycle?.toLowerCase()}
                    {p.id === subscription?.plan?.id ? " (Current Tier)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/customer/subscription")}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePlan}
                disabled={saving || Number(selectedPlan) === Number(subscription?.plan?.id)}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Migrating Plan...</span>
                  </>
                ) : (
                  <span>Confirm Plan Migration</span>
                )}
              </button>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default CustomerChangePlan;
