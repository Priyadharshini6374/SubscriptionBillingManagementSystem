import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconCustomers, IconEdit, IconSubscriptions } from "../components/Icons";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/customers/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load customer.");
        return;
      }

      setCustomer(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/customers" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconCustomers className="w-6 h-6 text-sky-400" />
                  Customer Profile
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Account telemetry, billing identity, and assigned licenses
                </p>
              </div>
            </div>

            {customer && (
              <button
                onClick={() => navigate(`/customers/edit/${customer.id}`)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <IconEdit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {error && <ErrorBanner message={error} onRetry={fetchCustomer} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving customer record..." />
            </GlassCard>
          ) : !customer ? (
            <GlassCard className="p-8 text-center text-slate-400">
              Customer not found.
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {/* Profile Card */}
              <GlassCard className="p-8 border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white border border-white/20 shadow-lg">
                      {customer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {customer.name}
                      </h2>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Customer ID: #{customer.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <GlassBadge status={customer.status} />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email Address
                    </span>
                    <p className="mt-1 text-sm font-medium text-white truncate">
                      {customer.email}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      User Role
                    </span>
                    <p className="mt-1 text-sm font-medium text-indigo-300">
                      {customer.role || "CUSTOMER"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Account Status
                    </span>
                    <p className="mt-1 text-sm font-medium text-white">
                      {customer.status}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Joined On
                    </span>
                    <p className="mt-1 text-sm font-medium text-slate-300">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Quick Actions / Link to Subscriptions */}
              <GlassCard className="p-6 border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <IconSubscriptions className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Customer Subscriptions</h3>
                    <p className="text-xs text-slate-400">Manage plan allocations and billing statements for this customer</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/subscriptions")}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  View All Subscriptions →
                </button>
              </GlassCard>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CustomerDetails;
