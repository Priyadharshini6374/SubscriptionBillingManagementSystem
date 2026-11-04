import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import {
  IconPlus,
  IconTrendingUp,
  IconCustomers,
  IconSubscriptions,
  IconInvoices,
  IconPayments,
  IconCreditCard,
  IconPlans,
} from "../components/Icons";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    recentPayments: [],
  });

  const [analytics, setAnalytics] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashRes, analyticsRes, invoicesRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard`),
        fetch(`${API_URL}/api/analytics`).catch(() => null),
        fetch(`${API_URL}/api/invoices`).catch(() => null),
      ]);

      if (!dashRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashData = await dashRes.json();
      setDashboard(dashData);

      if (analyticsRes && analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      if (invoicesRes && invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute derived values from real backend data
  const pendingInvoicesCount = invoices.filter(
    (inv) => inv.status === "PENDING"
  ).length;

  const overdueInvoicesCount = invoices.filter(
    (inv) => inv.status === "OVERDUE"
  ).length;

  // Compute estimated Monthly Recurring Revenue (MRR) from analytics monthly revenue or revenueByPlan
  const latestMonthRevenue =
    analytics?.monthlyRevenue && analytics.monthlyRevenue.length > 0
      ? analytics.monthlyRevenue[analytics.monthlyRevenue.length - 1].revenue
      : dashboard.totalRevenue > 0
      ? Math.round(dashboard.totalRevenue / Math.max(1, analytics?.monthlyRevenue?.length || 1))
      : 0;

  // Chart data for revenue trend
  const revenueChartData =
    analytics?.monthlyRevenue && analytics.monthlyRevenue.length > 0
      ? analytics.monthlyRevenue
      : [
          { month: "Jan", revenue: 0 },
          { month: "Current", revenue: dashboard.totalRevenue },
        ];

  // Chart data for plan distribution
  const planDistributionData =
    analytics?.plansSold && analytics.plansSold.length > 0
      ? analytics.plansSold.map((item) => ({
          name: item.plan,
          value: item.sold,
        }))
      : analytics?.activeSubscriptions && analytics.activeSubscriptions.length > 0
      ? analytics.activeSubscriptions.map((item) => ({
          name: item.plan,
          value: item.active,
        }))
      : [];

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        {/* Header & Quick Action Buttons */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Performance Overview
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Revenue & Subscription Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time financial telemetry, recurring revenue metrics, and accounts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate("/customers/create")}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <IconPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Customer</span>
            </button>

            <button
              onClick={() => navigate("/plans/create")}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <IconPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>New Plan</span>
            </button>

            <button
              onClick={() => navigate("/subscriptions/create")}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>New Subscription</span>
            </button>

            <BackButton />
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchDashboardData} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Connecting to billing telemetry..." />
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* ==================== 6 TOP KPI CARDS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Total Revenue */}
              <GlassCard hover className="p-5 relative overflow-hidden border-indigo-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <IconTrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  ₹{Number(dashboard.totalRevenue).toLocaleString("en-IN")}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span>Collected payments</span>
                </div>
              </GlassCard>

              {/* Monthly Recurring Revenue */}
              <GlassCard hover className="p-5 relative overflow-hidden border-purple-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>MRR (Monthly)</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <IconCreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  ₹{Number(latestMonthRevenue).toLocaleString("en-IN")}
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Current monthly pace
                </div>
              </GlassCard>

              {/* Active Subscriptions */}
              <GlassCard hover className="p-5 relative overflow-hidden border-sky-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>Active Subs</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <IconSubscriptions className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {dashboard.activeSubscriptions}
                </div>
                <div className="mt-2 text-[11px] text-sky-400 font-medium">
                  Active & trial licenses
                </div>
              </GlassCard>

              {/* Total Customers */}
              <GlassCard hover className="p-5 relative overflow-hidden border-blue-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>Total Customers</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <IconCustomers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {dashboard.totalCustomers}
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Registered accounts
                </div>
              </GlassCard>

              {/* Pending Payments */}
              <GlassCard hover className="p-5 relative overflow-hidden border-amber-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>Pending Invoices</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <IconInvoices className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-300 tracking-tight">
                  {pendingInvoicesCount}
                </div>
                <div className="mt-2 text-[11px] text-amber-400/80">
                  Awaiting settlement
                </div>
              </GlassCard>

              {/* Overdue Invoices */}
              <GlassCard hover className="p-5 relative overflow-hidden border-rose-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>Overdue Invoices</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <IconInvoices className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-rose-300 tracking-tight">
                  {overdueInvoicesCount}
                </div>
                <div className="mt-2 text-[11px] text-rose-400/80">
                  Requires attention
                </div>
              </GlassCard>
            </div>

            {/* ==================== CHARTS ROW ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Analytics Chart (2 Columns) */}
              <GlassCard className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <IconTrendingUp className="w-4 h-4 text-indigo-400" />
                      Revenue Velocity & Trends
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Historical billing performance across monthly cycles
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/analytics")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                  >
                    Detailed Analytics →
                  </button>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: "#334155", opacity: 0.5 }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "12px",
                          color: "#fff",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                        }}
                        formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#818cf8"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#revenueGlow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Plan Distribution / Subscription Growth Chart (1 Column) */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <IconPlans className="w-4 h-4 text-purple-400" />
                      Plan Distribution
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Subscription allocation by product tier
                    </p>
                  </div>
                </div>

                {planDistributionData.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
                    <p>No plan distribution data recorded yet.</p>
                  </div>
                ) : (
                  <div>
                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={planDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {planDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(15, 23, 42, 0.9)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "10px",
                              color: "#fff",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {planDistributionData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-xs text-slate-300 py-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                              }}
                            />
                            <span className="truncate max-w-[140px]">{item.name}</span>
                          </div>
                          <span className="font-semibold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* ==================== RECENT ACTIVITY ROW ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <IconPayments className="w-4 h-4 text-emerald-400" />
                      Recent Payment Transactions
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Latest successful settlements processed
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/payments")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                  >
                    View All →
                  </button>
                </div>

                {dashboard.recentPayments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No successful payments processed yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-white/5 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-6 py-3">Transaction</th>
                          <th className="px-6 py-3">Customer</th>
                          <th className="px-6 py-3">Invoice</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {dashboard.recentPayments.map((payment) => (
                          <tr
                            key={payment.id}
                            onClick={() => navigate(`/payments/${payment.id}`)}
                            className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-3.5 font-mono text-slate-300">
                              {payment.transactionId}
                            </td>
                            <td className="px-6 py-3.5 text-white font-medium">
                              {payment.user?.name || "-"}
                            </td>
                            <td className="px-6 py-3.5 text-slate-400">
                              {payment.invoice?.invoiceNumber || "-"}
                            </td>
                            <td className="px-6 py-3.5 text-right font-bold text-emerald-400">
                              ₹{Number(payment.amount).toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-3.5 text-slate-400">
                              {new Date(payment.paymentDate).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>

              {/* Recent Invoices */}
              <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <IconInvoices className="w-4 h-4 text-sky-400" />
                      Recent Invoices
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Latest billing statements generated
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/invoices")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                  >
                    View All →
                  </button>
                </div>

                {recentInvoices.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No invoices generated yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-white/5 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-6 py-3">Invoice #</th>
                          <th className="px-6 py-3">Customer</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentInvoices.map((inv) => (
                          <tr
                            key={inv.id}
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                            className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-3.5 font-mono text-slate-300">
                              {inv.invoiceNumber}
                            </td>
                            <td className="px-6 py-3.5 text-white font-medium">
                              {inv.user?.name || "-"}
                            </td>
                            <td className="px-6 py-3.5">
                              <GlassBadge status={inv.status} />
                            </td>
                            <td className="px-6 py-3.5 text-right font-bold text-slate-200">
                              ₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-3.5 text-slate-400">
                              {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
