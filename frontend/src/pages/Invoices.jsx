import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconInvoices, IconPlus, IconSearch, IconEye } from "../components/Icons";

function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/invoices`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load invoices.");
      }

      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const invNum = inv.invoiceNumber?.toLowerCase() || "";
    const custName = inv.user?.name?.toLowerCase() || "";
    const custEmail = inv.user?.email?.toLowerCase() || "";

    const matchesSearch =
      invNum.includes(searchTerm.toLowerCase()) ||
      custName.includes(searchTerm.toLowerCase()) ||
      custEmail.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || inv.status === statusFilter;

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
                <IconInvoices className="w-6 h-6 text-sky-400" />
                Invoices & Statements
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Track generated receivables, dues, taxes, and settlement records
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/invoices/create")}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchInvoices} />}

        {/* Filter & Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice #, customer name or email..."
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
              <option value="PAID" className="bg-slate-900 text-white">Paid</option>
              <option value="PENDING" className="bg-slate-900 text-white">Pending</option>
              <option value="OVERDUE" className="bg-slate-900 text-white">Overdue</option>
              <option value="CANCELLED" className="bg-slate-900 text-white">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Invoices Content */}
        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving invoice ledger..." />
          </GlassCard>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={IconInvoices}
            title="No invoices generated"
            description="Create your first billing invoice for customer subscription settlements."
            actionText="+ Generate Invoice"
            onAction={() => navigate("/invoices/create")}
          />
        ) : filteredInvoices.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate-400">
            No invoices match your search filters.
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total Amount</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Invoice # */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-indigo-300">
                          {inv.invoiceNumber}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            {inv.user?.name || "Customer"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {inv.user?.email || `User #${inv.userId}`}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <GlassBadge status={inv.status} />
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right font-bold text-white">
                        ₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4 text-slate-400">
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/invoices/${inv.id}`)}
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <IconEye className="w-3.5 h-3.5 text-sky-400" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default Invoices;
