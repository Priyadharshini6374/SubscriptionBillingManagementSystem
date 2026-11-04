import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconRefunds, IconPlus, IconSearch, IconEye } from "../components/Icons";

function Refunds() {
  const navigate = useNavigate();

  const [refunds, setRefunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRefunds = () => {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/refunds`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch refunds");
        }
        return response.json();
      })
      .then((data) => {
        setRefunds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load refunds ledger.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const filteredRefunds = refunds.filter((refund) => {
    const custName = refund.payment?.user?.name?.toLowerCase() || "";
    const txId = refund.payment?.transactionId?.toLowerCase() || "";
    const reason = refund.reason?.toLowerCase() || "";

    const matchesSearch =
      custName.includes(searchTerm.toLowerCase()) ||
      txId.includes(searchTerm.toLowerCase()) ||
      reason.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || refund.status === statusFilter;

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
                <IconRefunds className="w-6 h-6 text-purple-400" />
                Refunds & Reversals
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Process dispute resolutions, credit notes, and payment clawbacks
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/refunds/create")}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Process Refund</span>
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchRefunds} />}

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, transaction ID, or refund reason..."
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input rounded-xl px-3 py-2.5 text-xs font-medium cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Refund Statuses</option>
              <option value="COMPLETED" className="bg-slate-900 text-white">Completed</option>
              <option value="PROCESSING" className="bg-slate-900 text-white">Processing</option>
              <option value="FAILED" className="bg-slate-900 text-white">Failed</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving refund records..." />
          </GlassCard>
        ) : refunds.length === 0 ? (
          <EmptyState
            icon={IconRefunds}
            title="No refunds issued"
            description="All payment transactions remain settled with zero reversals."
            actionText="+ Process Refund"
            onAction={() => navigate("/refunds/create")}
          />
        ) : filteredRefunds.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate-400">
            No refunds match your current filters.
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Refund Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRefunds.map((refund) => (
                    <tr
                      key={refund.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-6 py-4 font-semibold text-white">
                        {refund.payment?.user?.name || "Customer"}
                      </td>

                      {/* Transaction ID */}
                      <td className="px-6 py-4 font-mono text-slate-300">
                        {refund.payment?.transactionId || "-"}
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                        {refund.reason || "Customer requested refund"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <GlassBadge status={refund.status} />
                      </td>

                      {/* Refund Amount */}
                      <td className="px-6 py-4 text-right font-bold text-rose-300">
                        ₹{Number(refund.amount).toLocaleString("en-IN")}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(refund.refundDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/refunds/${refund.id}`)}
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <IconEye className="w-3.5 h-3.5 text-purple-400" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredRefunds.length} of {refunds.length} refund entries</span>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default Refunds;
