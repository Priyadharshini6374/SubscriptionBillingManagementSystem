import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconSubscriptions, IconPlans } from "../components/Icons";

function ChangePlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subscriptionResponse, plansResponse] = await Promise.all([
        fetch(`${API_URL}/api/subscriptions/${id}`),
        fetch(`${API_URL}/api/plans`),
      ]);

      const subscriptionData = await subscriptionResponse.json();
      const plansData = await plansResponse.json();

      if (!subscriptionResponse.ok) {
        throw new Error(subscriptionData.message || "Failed to load subscription.");
      }

      if (!plansResponse.ok) {
        throw new Error(plansData.message || "Failed to load plans.");
      }

      setSubscription(subscriptionData);
      const activePlans = Array.isArray(plansData)
        ? plansData.filter((plan) => plan.status === "ACTIVE")
        : [];
      setPlans(activePlans);
      setSelectedPlanId(String(subscriptionData.plan?.id || ""));
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load subscription and plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedPlanId) {
      setError("Please select a target plan.");
      return;
    }

    if (String(subscription?.plan?.id) === selectedPlanId) {
      setError("Customer is already enrolled in this plan.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/subscriptions/${id}/change-plan`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPlanId: Number(selectedPlanId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update subscription plan.");
        return;
      }

      navigate(`/subscriptions/${id}`);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setSaving(false);
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
              <BackButton to={`/subscriptions/${id}`} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconSubscriptions className="w-6 h-6 text-indigo-400" />
                  Upgrade / Change Plan
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Switch subscription tier for {subscription?.user?.name || `Sub #${id}`}
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving subscription and available plans..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              {/* Current Plan Summary */}
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Current Plan
                  </span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {subscription?.plan?.name || "None"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-indigo-300">
                    ₹{subscription?.plan?.price}
                  </span>
                  <span className="text-xs text-slate-400">/{subscription?.plan?.billingCycle?.toLowerCase()}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Select New Service Tier <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Choose replacement plan...</option>
                    {plans.map((plan) => (
                      <option
                        key={plan.id}
                        value={plan.id}
                        className="bg-slate-900 text-white"
                        disabled={plan.id === subscription?.plan?.id}
                      >
                        {plan.name} — ₹{plan.price} / {plan.billingCycle?.toLowerCase()}
                        {plan.id === subscription?.plan?.id ? " (Current)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/subscriptions/${id}`)}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || selectedPlanId === String(subscription?.plan?.id)}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating Plan...</span>
                      </>
                    ) : (
                      <span>Apply Plan Migration</span>
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

export default ChangePlan;
