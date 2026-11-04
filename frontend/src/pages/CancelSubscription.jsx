import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconAlertCircle } from "../components/Icons";

function CancelSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );
  const adminUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const isAdmin = Boolean(adminUser && adminUser.role === "ADMIN");

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError("");

        if (!customerUser?.id && !isAdmin) {
          setError("User authentication not found.");
          return;
        }

        const response = await fetch(`${API_URL}/api/subscriptions/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load subscription.");
        }

        if (!isAdmin && data.userId !== customerUser?.id) {
          setError("You are not authorized to access this subscription.");
          return;
        }

        setSubscription(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id, isAdmin, customerUser?.id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription? This will stop recurring renewals."
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/subscriptions/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel subscription.");
      }

      if (isAdmin) {
        navigate(`/subscriptions/${id}`);
      } else {
        navigate("/customer/subscription");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      {isAdmin ? (
        <>
          <Sidebar />
          <Topbar />
        </>
      ) : (
        <CustomerNavbar />
      )}

      <main className={`${isAdmin ? "lg:ml-64 pt-20" : "pt-24"} pb-12 px-4 sm:px-8 relative z-10`}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to={isAdmin ? `/subscriptions/${id}` : "/customer/subscription"} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  Cancel Subscription #{id}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Deactivate recurring entitlement and cycle renewals
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving subscription status..." />
            </GlassCard>
          ) : !subscription ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Subscription record not available.
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-rose-500/20">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 mb-6">
                <IconAlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Cancellation Notice</p>
                  <p className="mt-0.5 text-rose-300/90">
                    Cancelling will immediately terminate the active billing cycle. Entitlements associated with the {subscription.plan?.name} tier will cease.
                  </p>
                </div>
              </div>

              {/* Subscription Summary */}
              <div className="space-y-4 mb-8 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Customer Account</span>
                  <span className="font-semibold text-white">{subscription.user?.name || `Customer #${subscription.userId}`}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Current Plan Tier</span>
                  <span className="font-semibold text-white">{subscription.plan?.name} (₹{subscription.plan?.price}/{subscription.plan?.billingCycle?.toLowerCase()})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Current Status</span>
                  <span className="font-semibold text-amber-300">{subscription.status}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate(isAdmin ? `/subscriptions/${id}` : "/customer/subscription")}
                  className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Keep Subscription
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling || subscription.status === "CANCELLED"}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-950/50 cursor-pointer disabled:opacity-50"
                >
                  {cancelling ? "Processing..." : "Confirm Cancellation"}
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default CancelSubscription;
