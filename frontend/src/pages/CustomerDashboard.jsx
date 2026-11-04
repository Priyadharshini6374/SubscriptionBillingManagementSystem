import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import CustomerNavbar from "../components/CustomerNavbar";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import {
  IconPlans,
  IconSubscriptions,
  IconPayments,
  IconInvoices,
  IconTrendingUp,
  IconCreditCard,
} from "../components/Icons";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("customerUser");

    if (!storedUser) {
      navigate("/customer/login");
      return;
    }

    const user = JSON.parse(storedUser);
    setCustomer(user);

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/customer-dashboard/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data);
      } catch (err) {
        console.error("Customer dashboard error:", err);
        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const subscription = dashboard?.subscription;
  const currentPlan = subscription?.plan?.name || "No Plan";
  const subscriptionStatus = subscription?.status || "INACTIVE";
  const totalPayments = dashboard?.totalPayments || 0;
  const pendingInvoices = dashboard?.pendingInvoices || 0;

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              Customer Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {customer?.name || "Customer"}!
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor active subscriptions, billing statements, and payments
          </p>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => window.location.reload()} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving subscription status..." />
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Current Plan */}
              <GlassCard hover className="p-6 border-indigo-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-3">
                  <span>Current Plan</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <IconPlans className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {currentPlan}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400">
                  {subscription?.plan
                    ? `₹${subscription.plan.price} / ${subscription.plan.billingCycle.toLowerCase()}`
                    : "No active plan assigned"}
                </p>
              </GlassCard>

              {/* Status */}
              <GlassCard hover className="p-6 border-sky-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-3">
                  <span>Subscription Status</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <IconSubscriptions className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-1">
                  <GlassBadge status={subscriptionStatus} />
                </div>
                <p className="mt-2.5 text-xs text-slate-400">
                  {subscription ? "Recurring billing enabled" : "Explore plans below"}
                </p>
              </GlassCard>

              {/* Total Paid */}
              <GlassCard hover className="p-6 border-emerald-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-3">
                  <span>Total Payments</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <IconTrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  ₹{Number(totalPayments).toLocaleString("en-IN")}
                </h3>
                <p className="mt-1.5 text-xs text-emerald-400 font-medium">
                  Verified settlements
                </p>
              </GlassCard>

              {/* Pending Invoices */}
              <GlassCard hover className="p-6 border-amber-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-3">
                  <span>Pending Dues</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <IconInvoices className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-amber-300 tracking-tight">
                  {pendingInvoices}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400">
                  {pendingInvoices > 0 ? "Awaiting your payment" : "All settled up"}
                </p>
              </GlassCard>
            </div>

            {/* Quick Navigation Cards */}
            <div>
              <h2 className="text-base font-bold text-white mb-4">Quick Service Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate("/customer/plans")}
                  className="glass-card glass-card-hover p-6 rounded-2xl text-left border-white/10 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <IconPlans className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Browse Plans</h4>
                  <p className="text-xs text-slate-400 mt-1">Upgrade or subscribe to another tier</p>
                </button>

                <button
                  onClick={() => navigate("/customer/subscription")}
                  className="glass-card glass-card-hover p-6 rounded-2xl text-left border-white/10 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                    <IconSubscriptions className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">My Subscription</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage active plan and renewal dates</p>
                </button>

                <button
                  onClick={() => navigate("/customer/invoices")}
                  className="glass-card glass-card-hover p-6 rounded-2xl text-left border-white/10 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                    <IconInvoices className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Billing Invoices</h4>
                  <p className="text-xs text-slate-400 mt-1">Download and pay open invoices</p>
                </button>

                <button
                  onClick={() => navigate("/customer/payments")}
                  className="glass-card glass-card-hover p-6 rounded-2xl text-left border-white/10 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <IconCreditCard className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Payment Receipts</h4>
                  <p className="text-xs text-slate-400 mt-1">View previous transaction logs</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerDashboard;
