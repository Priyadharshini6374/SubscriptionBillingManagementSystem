import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconReports, IconTrendingUp, IconPayments, IconRefunds, IconSubscriptions, IconCalendar } from "../components/Icons";

function Reports() {
  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      let url = `${API_URL}/api/reports`;
      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports");
      }

      setReport(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to compile reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    // Re-fetch without date filter
    fetch(`${API_URL}/api/reports`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => setError(err.message));
  };

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
                <IconReports className="w-6 h-6 text-purple-400" />
                Financial Reports & Audits
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Consolidated balance sheets, net realizations, and sales volume
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchReports}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Print Report
            </button>
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchReports} />}

        {/* Date Filter Bar */}
        <GlassCard className="p-4 mb-8 border-white/10">
          <form onSubmit={handleApplyFilter} className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-wider">
              <IconCalendar className="w-4 h-4 text-indigo-400" />
              <span>Reporting Window:</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="glass-input rounded-xl px-3 py-1.5 text-xs text-white"
                placeholder="Start Date"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="glass-input rounded-xl px-3 py-1.5 text-xs text-white"
                placeholder="End Date"
              />
            </div>

            <button
              type="submit"
              className="btn-primary px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Apply Filter
            </button>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="text-xs text-slate-400 hover:text-white transition underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </form>
        </GlassCard>

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Aggregating accounting records..." />
          </GlassCard>
        ) : !report ? (
          <GlassCard className="p-8 text-center text-slate-400">
            No report data available.
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* Revenue Realization Summary Cards */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Revenue & Net Margin Realization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Revenue */}
                <GlassCard hover className="p-6 border-indigo-500/20">
                  <span className="text-xs uppercase font-semibold text-slate-400">Total Gross Receipts</span>
                  <div className="text-3xl font-extrabold text-white mt-2">
                    ₹{Number(report.summary?.totalRevenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium">From verified settlements</p>
                </GlassCard>

                {/* Total Refunds */}
                <GlassCard hover className="p-6 border-rose-500/20">
                  <span className="text-xs uppercase font-semibold text-slate-400">Total Refunded Reversals</span>
                  <div className="text-3xl font-extrabold text-rose-300 mt-2">
                    ₹{Number(report.summary?.totalRefunds || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-rose-400/80 mt-2">Completed customer refunds</p>
                </GlassCard>

                {/* Net Revenue */}
                <GlassCard hover className="p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <span className="text-xs uppercase font-semibold text-emerald-300">Net Realized Revenue</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-2">
                    ₹{Number(report.summary?.netRevenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Realized income post reversals</p>
                </GlassCard>
              </div>
            </div>

            {/* Volume Stats */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Transactional Volume
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <IconPayments className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Successful Payments</span>
                      <p className="text-2xl font-bold text-white mt-0.5">{report.summary?.totalPayments || 0}</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <IconSubscriptions className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Total Subscription Count</span>
                      <p className="text-2xl font-bold text-white mt-0.5">{report.summary?.totalSubscriptions || 0}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Plan Sales Report Table */}
            <GlassCard className="overflow-hidden border-white/10">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Plan Sales Breakdown</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ranking of tier adoption</p>
              </div>

              {(!report.planSales || report.planSales.length === 0) ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No plan sales recorded for this timeframe.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-3.5">Rank</th>
                        <th className="px-6 py-3.5">Plan Tier</th>
                        <th className="px-6 py-3.5 text-right">Subscriptions Sold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {report.planSales.map((item, index) => (
                        <tr key={item.plan} className="hover:bg-white/[0.03]">
                          <td className="px-6 py-3.5 font-bold text-indigo-400">#{index + 1}</td>
                          <td className="px-6 py-3.5 font-semibold text-white capitalize">{item.plan}</td>
                          <td className="px-6 py-3.5 text-right font-bold text-white">{item.sold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}

export default Reports;
