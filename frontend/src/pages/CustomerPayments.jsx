import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassBadge, GlassCard, LoadingSpinner, ErrorBanner, EmptyState } from "../components/UI";
import { IconPayments, IconEye } from "../components/Icons";

function CustomerPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer authentication not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/payments?userId=${customerUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load payments.");
        }

        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Payment error:", err);
        setError(err.message || "Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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
                <IconPayments className="w-6 h-6 text-emerald-400" />
                Payment History
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Audit records of completed billing transactions and receipts
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Retrieving transaction records..." />
          </GlassCard>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={IconPayments}
            title="No payment records found"
            description="Your settled invoices and transaction confirmations will be cataloged here."
          />
        ) : (
          <GlassCard className="overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Transaction #</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-300">
                        {payment.transactionId}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.05] border border-white/10 text-slate-300">
                          {payment.paymentMethod || "UPI"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <GlassBadge status={payment.status} />
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-emerald-400 text-sm">
                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/customer/payments/${payment.id}`)}
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <IconEye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View</span>
                        </button>
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

export default CustomerPayments;
