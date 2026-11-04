import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconCustomers, IconPlus, IconSearch, IconEye, IconEdit } from "../components/Icons";

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/customers`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load customer directory.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cust.id).includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || cust.status === statusFilter;

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
                <IconCustomers className="w-6 h-6 text-sky-400" />
                Customer Directory
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage customer accounts, credentials, and billing statuses
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/customers/create")}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchCustomers} />}

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or ID..."
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
              <option value="ACTIVE" className="bg-slate-900 text-white">Active Only</option>
              <option value="INACTIVE" className="bg-slate-900 text-white">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Table / Content */}
        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving customer records..." />
          </GlassCard>
        ) : customers.length === 0 ? (
          <EmptyState
            icon={IconCustomers}
            title="No customers registered yet"
            description="Start growing your subscription revenue by registering your first customer account."
            actionText="+ Add Customer"
            onAction={() => navigate("/customers/create")}
          />
        ) : filteredCustomers.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate-400">
            No customers match your search criteria.
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-white/20 shadow-sm">
                            {customer.name?.charAt(0).toUpperCase() || "C"}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {customer.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              ID: #{customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {customer.email}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <GlassBadge status={customer.status} />
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <IconEye className="w-3.5 h-3.5 text-sky-400" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                            title="Edit customer"
                          >
                            <IconEdit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredCustomers.length} of {customers.length} total customers</span>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default Customers;
