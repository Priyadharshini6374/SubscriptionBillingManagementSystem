import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconPayments, IconPlus, IconSearch, IconEye } from "../components/Icons";

function Payments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/payments`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payments");
      }

      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError(err.message || "Unable to load payments ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const txId = payment.transactionId?.toLowerCase() || "";
    const custName = payment.user?.name?.toLowerCase() || "";
    const custEmail = payment.user?.email?.toLowerCase() || "";
    const invNum = payment.invoice?.invoiceNumber?.toLowerCase() || "";

    const matchesSearch =
      txId.includes(searchTerm.toLowerCase()) ||
      custName.includes(searchTerm.toLowerCase()) ||
      custEmail.includes(searchTerm.toLowerCase()) ||
      invNum.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || payment.status === statusFilter;

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
                <IconPayments className="w-6 h-6 text-emerald-400" />
                Payment Transactions
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Audit trail of incoming settlements, payment gateway logs, and refunds
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/payments/create")}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchPayments} />}

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by transaction ID, invoice #, customer name..."
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input rounded-xl px-3 py-2.5 text-xs font-medium cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Transactions</option>
              <option value="SUCCESS" className="bg-slate-900 text-white">Success Only</option>
              <option value="FAILED" className="bg-slate-900 text-white">Failed Only</option>
              <option value="REFUNDED" className="bg-slate-900 text-white">Refunded</option>
              <option value="PENDING" className="bg-slate-900 text-white">Pending</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving transaction ledger..." />
          </GlassCard>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={IconPayments}
            title="No payment records recorded"
            description="Process an invoice settlement to log payment transactions."
            actionText="+ Record Payment"
            onAction={() => navigate("/payments/create")}
          />
        ) : filteredPayments.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate-400">
            No transactions match the selected filter.
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Invoice</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="px-6 py-4 font-mono font-medium text-slate-300">
                        {payment.transactionId}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 font-semibold text-white">
                        {payment.user?.name || "-"}
                      </td>

                      {/* Invoice */}
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {payment.invoice?.invoiceNumber || "-"}
                      </td>

                      {/* Method */}
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.05] border border-white/10 text-slate-300">
                          {payment.paymentMethod || "UPI"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <GlassBadge status={payment.status} />
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right font-bold text-emerald-400">
                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/payments/${payment.id}`)}
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <IconEye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredPayments.length} of {payments.length} transactions</span>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default Payments;
