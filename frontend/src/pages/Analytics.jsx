import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconAnalytics, IconTrendingUp, IconPlans, IconSubscriptions, IconPayments } from "../components/Icons";

const PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/analytics`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        return response.json();
      })
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load analytics telemetry.");
        setLoading(false);
      });
  }, []);

  const plansSold = analytics?.plansSold || [];
  const totalPlansSold = plansSold.reduce((total, item) => total + item.sold, 0);
  const mostSoldPlan = plansSold.length > 0 ? plansSold[0] : null;

  const getPercentage = (sold) => {
    if (totalPlansSold === 0) return 0;
    return ((sold / totalPlansSold) * 100).toFixed(1);
  };

  const chartData = plansSold.map((item) => ({
    ...item,
    displayName: item.plan,
  }));

  const activeSubscriptions = analytics?.activeSubscriptions || [];
  const totalActiveSubscriptions = activeSubscriptions.reduce(
    (total, item) => total + item.active,
    0
  );

  const activeChartData = activeSubscriptions.map((item) => ({
    ...item,
    displayName: item.plan,
  }));

  const getActivePercentage = (active) => {
    if (totalActiveSubscriptions === 0) return 0;
    return ((active / totalActiveSubscriptions) * 100).toFixed(1);
  };

  const monthlyRevenue = analytics?.monthlyRevenue || [];

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
                <IconAnalytics className="w-6 h-6 text-indigo-400" />
                Revenue & Sales Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                In-depth subscription volume, plan distribution, and recurring run rate
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Compiling financial models..." />
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* KPI Summary Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard className="p-5 border-indigo-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
                  <span>Gross Revenue</span>
                  <IconTrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  ₹{Number(analytics?.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 font-medium">From successful payments</p>
              </GlassCard>

              <GlassCard className="p-5 border-emerald-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
                  <span>Settlements</span>
                  <IconPayments className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {analytics?.successfulPaymentCount || 0}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Paid transactions</p>
              </GlassCard>

              <GlassCard className="p-5 border-purple-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
                  <span>Subscriptions Sold</span>
                  <IconPlans className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {totalPlansSold}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">All-time plan activations</p>
              </GlassCard>

              <GlassCard className="p-5 border-sky-500/20">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
                  <span>Active Licenses</span>
                  <IconSubscriptions className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {totalActiveSubscriptions}
                </div>
                <p className="text-[11px] text-sky-400 mt-1 font-medium">Active & trial accounts</p>
              </GlassCard>
            </div>

            {/* Monthly Trend Area Chart */}
            {monthlyRevenue.length > 0 && (
              <GlassCard className="p-6">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <IconTrendingUp className="w-4 h-4 text-indigo-400" />
                    Monthly Revenue Run Rate
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monthly billing revenue accumulation over time
                  </p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#818cf8"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#areaGlow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}

            {/* Plans Sold Donut & Lead Plan Card */}
            <GlassCard className="p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <IconPlans className="w-4 h-4 text-purple-400" />
                  Plans Sold Breakdown
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cumulative distribution of plans subscribed by users
                </p>
              </div>

              {plansSold.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No subscription plan sales recorded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2 relative h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="sold"
                          nameKey="displayName"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={65}
                          paddingAngle={4}
                          stroke="rgba(15, 23, 42, 0.8)"
                          strokeWidth={2}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`main-${index}`}
                              fill={PALETTE[index % PALETTE.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#fff",
                          }}
                          formatter={(value, name) => [`${value} subscriptions`, name]}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Donut Center */}
                    <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Total Sold
                      </span>
                      <p className="text-2xl font-black text-white">{totalPlansSold}</p>
                    </div>
                  </div>

                  {/* Most Sold Highlight */}
                  {mostSoldPlan && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                          Top Tier Performer
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-white capitalize">
                        {mostSoldPlan.plan}
                      </h3>
                      <p className="text-sm text-slate-300 mt-1 font-medium">
                        {mostSoldPlan.sold} subscriptions assigned
                      </p>

                      <div className="mt-5 pt-4 border-t border-white/10 flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Market Share:</span>
                        <span className="text-2xl font-bold text-white">
                          {getPercentage(mostSoldPlan.sold)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>

            {/* Active Subscriptions Breakdown with Progress Bars */}
            <GlassCard className="p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <IconSubscriptions className="w-4 h-4 text-sky-400" />
                  Current Active Plan Allocations
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proportion of active recurring client engagements by tier
                </p>
              </div>

              {activeSubscriptions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active subscriptions found.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSubscriptions.map((item, index) => {
                    const percentage = getActivePercentage(item.active);
                    const color = PALETTE[index % PALETTE.length];
                    return (
                      <div key={item.plan} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-bold text-white capitalize">{item.plan}</span>
                          </div>
                          <span className="text-slate-300">
                            <strong>{item.active}</strong> active licenses ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}

export default Analytics;
