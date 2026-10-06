import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
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
      .catch((error) => {
        console.error(error);
        setError("Unable to load analytics data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8">
            <BackButton />

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="font-medium text-red-700">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =========================
     PLANS SOLD
  ========================= */

  const plansSold = analytics?.plansSold || [];

  const totalPlansSold = plansSold.reduce(
    (total, item) => total + item.sold,
    0
  );

  const mostSoldPlan = plansSold.length > 0 ? plansSold[0] : null;

  const getPercentage = (sold) => {
    if (totalPlansSold === 0) {
      return 0;
    }

    return ((sold / totalPlansSold) * 100).toFixed(1);
  };

  const chartData = plansSold.map((item) => ({
    ...item,
    displayName: item.plan,
  }));

  const chartColors = [
    "#4F46E5",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  /* =========================
     ACTIVE SUBSCRIPTIONS
  ========================= */

  const activeSubscriptions =
    analytics?.activeSubscriptions || [];

  const totalActiveSubscriptions =
    activeSubscriptions.reduce(
      (total, item) => total + item.active,
      0
    );

  const activeChartData = activeSubscriptions.map((item) => ({
    ...item,
    displayName: item.plan,
  }));

  const getActivePercentage = (active) => {
    if (totalActiveSubscriptions === 0) {
      return 0;
    }

    return ((active / totalActiveSubscriptions) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Page Header */}
          <div className="mb-6 flex items-center gap-4">
            <BackButton />

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Revenue Analytics
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Analyze subscription sales and revenue performance
              </p>
            </div>
          </div>

          {/* =========================
              PLANS SOLD
          ========================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Plans Sold
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Visual representation of subscriptions sold by plan
              </p>
            </div>

            {plansSold.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-gray-500">
                  No subscription sales available yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* 3D Pie Chart */}
                <div className="lg:col-span-2">

                  <div className="relative h-[450px] w-full">

                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>

                        {/* Bottom shadow / depth layer */}
                        <Pie
                          data={chartData}
                          dataKey="sold"
                          nameKey="displayName"
                          legendType="none"
                          cx="50%"
                          cy="54%"
                          outerRadius={155}
                          innerRadius={72}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`depth-${index}`}
                              fill="#CBD5E1"
                            />
                          ))}
                        </Pie>

                        {/* Main chart */}
                        <Pie
                          data={chartData}
                          dataKey="sold"
                          nameKey="displayName"
                          cx="50%"
                          cy="49%"
                          outerRadius={155}
                          innerRadius={72}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={3}
                          stroke="#FFFFFF"
                          strokeWidth={3}
                          label={({ displayName, percent }) =>
                            `${displayName} ${(percent * 100).toFixed(1)}%`
                          }
                          labelLine={true}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`main-${index}`}
                              fill={
                                chartColors[index % chartColors.length]
                              }
                            />
                          ))}
                        </Pie>

                        {/* Highlight ring */}
                        <Pie
                          data={chartData}
                          dataKey="sold"
                          nameKey="displayName"
                          legendType="none"
                          cx="50%"
                          cy="49%"
                          outerRadius={160}
                          innerRadius={155}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`ring-${index}`}
                              fill={
                                chartColors[index % chartColors.length]
                              }
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            boxShadow:
                              "0 10px 25px rgba(0, 0, 0, 0.10)",
                          }}
                          formatter={(value, name) => [
                            `${value} subscriptions`,
                            name,
                          ]}
                        />

                        <Legend
                          verticalAlign="bottom"
                          height={40}
                        />

                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center of Donut */}
                    <div className="pointer-events-none absolute left-1/2 top-[49%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Total Sold
                      </span>

                      <span className="mt-1 text-4xl font-bold text-gray-900">
                        {totalPlansSold}
                      </span>

                      <span className="text-xs text-gray-500">
                        subscriptions
                      </span>
                    </div>

                  </div>
                </div>

                {/* Most Sold Plan */}
                <div className="flex items-center">

                  <div className="w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-7 shadow-sm">

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Most Sold Plan
                      </p>
                    </div>

                    {mostSoldPlan && (
                      <>
                        <h3 className="mt-4 text-3xl font-bold capitalize text-gray-900">
                          {mostSoldPlan.plan}
                        </h3>

                        <p className="mt-2 text-lg font-medium text-gray-700">
                          {mostSoldPlan.sold} subscriptions
                        </p>

                        <div className="mt-6 border-t border-gray-200 pt-5">

                          <p className="text-sm text-gray-500">
                            Share of total subscriptions
                          </p>

                          <p className="mt-1 text-3xl font-bold text-gray-900">
                            {getPercentage(mostSoldPlan.sold)}%
                          </p>

                        </div>

                        <div className="mt-6 rounded-xl bg-gray-100 p-4">

                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Performance
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            This plan has the highest number of subscriptions.
                          </p>

                        </div>
                      </>
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* =========================
              PLAN SALES BREAKDOWN
          ========================= */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Plan Sales Breakdown
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Number of subscriptions sold for each plan
              </p>
            </div>

            <div className="mt-6 space-y-6">

              {plansSold.map((item, index) => {

                const percentage = getPercentage(item.sold);

                return (
                  <div key={item.plan}>

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              chartColors[index % chartColors.length],
                          }}
                        />

                        <span className="font-medium capitalize text-gray-700">
                          {item.plan}
                        </span>

                      </div>

                      <span className="text-sm font-medium text-gray-500">
                        {item.sold} sold · {percentage}%
                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

          {/* =========================
              ACTIVE SUBSCRIPTIONS
          ========================= */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Active Subscriptions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current active and trial subscriptions by plan
              </p>
            </div>

            {activeSubscriptions.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-gray-500">
                  No active subscriptions available yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Active Subscription Donut */}
                <div className="lg:col-span-2">

                  <div className="relative h-[420px] w-full">

                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>

                        <Pie
                          data={activeChartData}
                          dataKey="active"
                          nameKey="displayName"
                          cx="50%"
                          cy="48%"
                          outerRadius={145}
                          innerRadius={70}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={3}
                          stroke="#FFFFFF"
                          strokeWidth={3}
                          label={({ displayName, percent }) =>
                            `${displayName} ${(percent * 100).toFixed(1)}%`
                          }
                          labelLine={true}
                        >
                          {activeChartData.map((entry, index) => (
                            <Cell
                              key={`active-${index}`}
                              fill={
                                chartColors[index % chartColors.length]
                              }
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            boxShadow:
                              "0 10px 25px rgba(0, 0, 0, 0.10)",
                          }}
                          formatter={(value, name) => [
                            `${value} active subscriptions`,
                            name,
                          ]}
                        />

                        <Legend
                          verticalAlign="bottom"
                          height={40}
                        />

                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center */}
                    <div className="pointer-events-none absolute left-1/2 top-[48%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">

                      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Currently Active
                      </span>

                      <span className="mt-1 text-4xl font-bold text-gray-900">
                        {totalActiveSubscriptions}
                      </span>

                      <span className="text-xs text-gray-500">
                        subscriptions
                      </span>

                    </div>

                  </div>

                </div>

                {/* Active Subscription Summary */}
                <div className="flex items-center">

                  <div className="w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-7 shadow-sm">

                    <div className="flex items-center gap-2">

                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Active Summary
                      </p>

                    </div>

                    <h3 className="mt-4 text-4xl font-bold text-gray-900">
                      {totalActiveSubscriptions}
                    </h3>

                    <p className="mt-2 text-lg font-medium text-gray-700">
                      Active subscriptions
                    </p>

                    <div className="mt-6 border-t border-gray-200 pt-5">

                      <p className="text-sm text-gray-500">
                        Plan distribution
                      </p>

                      <div className="mt-4 space-y-4">

                        {activeSubscriptions.map((item, index) => (
                          <div key={item.plan}>

                            <div className="mb-1 flex items-center justify-between">

                              <div className="flex items-center gap-2">

                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{
                                    backgroundColor:
                                      chartColors[
                                        index % chartColors.length
                                      ],
                                  }}
                                />

                                <span className="text-sm font-medium capitalize text-gray-700">
                                  {item.plan}
                                </span>

                              </div>

                              <span className="text-sm font-semibold text-gray-700">
                                {item.active}
                              </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${getActivePercentage(
                                    item.active
                                  )}%`,
                                  backgroundColor:
                                    chartColors[
                                      index % chartColors.length
                                    ],
                                }}
                              />

                            </div>

                          </div>
                        ))}

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Analytics;