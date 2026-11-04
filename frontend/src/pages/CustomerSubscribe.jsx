import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconPlans, IconCheck } from "../components/Icons";

function CustomerSubscribe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/plans/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch plan details");
        }

        setPlan(data);
      } catch (err) {
        console.error("Plan error:", err);
        setError(err.message || "Unable to load plan specifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      setError("");
      setSubscribing(true);

      const storedUser = localStorage.getItem("customerUser");

      if (!storedUser) {
        navigate("/customer/login");
        return;
      }

      const customer = JSON.parse(storedUser);

      const response = await fetch(`${API_URL}/api/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: customer.id,
          planId: plan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription activation failed");
      }

      navigate("/customer/subscription");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not complete subscription.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-2xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/plans" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconPlans className="w-6 h-6 text-indigo-400" />
                Confirm Subscription
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Review tier terms and initiate recurring membership
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving package details..." />
          </GlassCard>
        ) : !plan ? (
          <GlassCard className="p-8 text-center text-slate-400">
            Selected plan not found.
          </GlassCard>
        ) : (
          <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
            {/* Plan Tier Highlight */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Target Plan
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{plan.description}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">₹{plan.price}</span>
                <span className="text-xs text-slate-400 block capitalize">
                  Per {plan.billingCycle?.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Trial Notice */}
            {plan.trialPeriod > 0 && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs flex items-center gap-2">
                <span className="font-semibold text-white">Complimentary Trial Included:</span>
                <span>You will enjoy {plan.trialPeriod} days of zero-charge access before recurring renewal.</span>
              </div>
            )}

            {/* Feature Entitlements */}
            {Array.isArray(plan.features) && plan.features.length > 0 && (
              <div className="space-y-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Plan Entitlements:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/customer/plans")}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {subscribing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Activating Subscription...</span>
                  </>
                ) : (
                  <span>Confirm & Activate</span>
                )}
              </button>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default CustomerSubscribe;
