import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import {
  IconSubscriptions,
  IconPlus,
  IconSearch,
  IconEye,
  IconPlans,
} from "../components/Icons";

function Subscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/subscriptions`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscriptions");
      }

      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const customerName = sub.user?.name?.toLowerCase() || "";
    const customerEmail = sub.user?.email?.toLowerCase() || "";
    const planName = sub.plan?.name?.toLowerCase() || "";
    const subId = String(sub.id);

    const matchesSearch =
      customerName.includes(searchTerm.toLowerCase()) ||
      customerEmail.includes(searchTerm.toLowerCase()) ||
      planName.includes(searchTerm.toLowerCase()) ||
      subId.includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                <IconSubscriptions className="w-6 h-6 text-indigo-400" />
                Customer Subscriptions
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Track recurring licenses, billing schedules, and cycle renewals
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/subscriptions/create")}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Create Subscription</span>
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchSubscriptions} />}

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, plan name, or subscription ID..."
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input rounded-xl px-3 py-2.5 text-xs font-medium cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Statuses</option>
              <option value="ACTIVE" className="bg-slate-900 text-white">Active</option>
              <option value="TRIAL" className="bg-slate-900 text-white">Trial</option>
              <option value="PAST_DUE" className="bg-slate-900 text-white">Past Due</option>
              <option value="CANCELLED" className="bg-slate-900 text-white">Cancelled</option>
              <option value="EXPIRED" className="bg-slate-900 text-white">Expired</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving subscription records..." />
          </GlassCard>
        ) : subscriptions.length === 0 ? (
          <EmptyState
            icon={IconSubscriptions}
            title="No subscriptions active yet"
            description="Assign customer accounts to subscription packages to begin recurring billing."
            actionText="+ Create Subscription"
            onAction={() => navigate("/subscriptions/create")}
          />
        ) : filteredSubscriptions.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate-400">
            No subscriptions matched your filters.
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Plan Tier</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Rate</th>
                    <th className="px-6 py-4">Period End / Renews</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSubscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-xs">
                            {sub.user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {sub.user?.name || "Unknown Customer"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {sub.user?.email || `Sub #${sub.id}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          <IconPlans className="w-3.5 h-3.5 text-purple-400" />
                          <span>{sub.plan?.name || "Custom Plan"}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <GlassBadge status={sub.status} />
                      </td>

                      {/* Rate */}
                      <td className="px-6 py-4 font-bold text-white">
                        ₹{Number(sub.plan?.price || 0).toLocaleString("en-IN")}
                        <span className="text-[10px] text-slate-400 font-normal">
                          /{sub.plan?.billingCycle?.toLowerCase() || "cycle"}
                        </span>
                      </td>

                      {/* Period End */}
                      <td className="px-6 py-4 text-slate-400">
                        {sub.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/subscriptions/${sub.id}`)}
                            className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <IconEye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions</span>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default Subscriptions;
