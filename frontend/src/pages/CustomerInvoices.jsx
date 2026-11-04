import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../api";
import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconInvoices, IconCreditCard, IconEye } from "../components/Icons";

function CustomerInvoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer authentication not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/invoices?userId=${customerUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load invoices.");
        }

        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Invoice error:", err);
        setError(err.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [customerUser?.id]);

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/dashboard" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconInvoices className="w-6 h-6 text-sky-400" />
                My Invoices
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                View statement history and settle outstanding balances
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving your invoices..." />
          </GlassCard>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={IconInvoices}
            title="No invoices generated yet"
            description="Your billing invoices will appear here once service cycles generate statements."
          />
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-sky-400">
                        {inv.invoiceNumber}
                      </td>

                      <td className="px-6 py-4">
                        <GlassBadge status={inv.status} />
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-white text-sm">
                        ₹{Number(inv.totalAmount || inv.amount).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Immediate"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/customer/invoices/${inv.id}`)}
                            className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <IconEye className="w-3.5 h-3.5 text-sky-400" />
                            <span>View</span>
                          </button>

                          {(inv.status === "PENDING" || inv.status === "OVERDUE") && (
                            <button
                              onClick={() => navigate(`/customer/pay/${inv.id}`)}
                              className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <IconCreditCard className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

export default CustomerInvoices;
