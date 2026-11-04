import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconPayments, IconPlus } from "../components/Icons";

function CreatePayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceIdFromUrl = searchParams.get("invoiceId");

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(
    invoiceIdFromUrl || ""
  );

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentStatus, setPaymentStatus] = useState("SUCCESS");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        throw new Error(data.message || "Failed to fetch invoices");
      }

      const pendingInvoices = Array.isArray(data)
        ? data.filter(
            (invoice) =>
              invoice.status === "PENDING" || invoice.status === "OVERDUE"
          )
        : [];

      setInvoices(pendingInvoices);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setError(err.message || "Failed to load unpaid invoices.");
    } finally {
      setLoading(false);
    }
  };

  const selectedInvoiceData = invoices.find(
    (invoice) => invoice.id === Number(selectedInvoice)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedInvoice) {
      setError("Please select an invoice to settle.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: Number(selectedInvoice),
          paymentMethod,
          status: paymentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to record payment");
      }

      navigate("/payments");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error processing payment record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <Sidebar />
      <Topbar />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/payments" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconPayments className="w-6 h-6 text-emerald-400" />
                  Record Manual Payment
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Log external or direct offline customer payments
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving unpaid invoice statements..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Invoice */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Pending Invoice <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedInvoice}
                    onChange={(e) => setSelectedInvoice(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Choose unpaid invoice...</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id} className="bg-slate-900 text-white">
                        {inv.invoiceNumber} — {inv.user?.name} (₹{inv.totalAmount || inv.amount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Preview */}
                {selectedInvoiceData && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Customer:</span>
                      <span className="font-semibold text-white">{selectedInvoiceData.user?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-amber-400 font-semibold">{selectedInvoiceData.status}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                      <span>Settlement Amount:</span>
                      <span className="text-emerald-400 text-base">
                        ₹{Number(selectedInvoiceData.totalAmount || selectedInvoiceData.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Payment Gateway / Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                  >
                    <option value="UPI" className="bg-slate-900 text-white">UPI / QR Code</option>
                    <option value="CARD" className="bg-slate-900 text-white">Credit / Debit Card</option>
                    <option value="NETBANKING" className="bg-slate-900 text-white">Net Banking</option>
                    <option value="BANK_TRANSFER" className="bg-slate-900 text-white">Bank Wire / NEFT</option>
                    <option value="CASH" className="bg-slate-900 text-white">Direct Cash</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Transaction Result
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                  >
                    <option value="SUCCESS" className="bg-slate-900 text-white">SUCCESS (Mark invoice paid)</option>
                    <option value="PENDING" className="bg-slate-900 text-white">PENDING (Processing)</option>
                    <option value="FAILED" className="bg-slate-900 text-white">FAILED (Declined)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/payments")}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Recording...</span>
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4" />
                        <span>Record Settlement</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreatePayment;
