import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CustomerNavbar from "../components/CustomerNavbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconCreditCard, IconCheckCircle } from "../components/Icons";

export default function CustomerPay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    if (!customerUser) {
      navigate("/customer/login");
      return;
    }

    fetch(`${API_URL}/api/invoices/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch invoice");
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.id) {
          throw new Error("Invoice not found");
        }
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load invoice.");
        setLoading(false);
      });
  }, [id, navigate]);

  const handlePayment = async () => {
    if (!invoice) return;

    setPaying(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: Number(invoice.id),
          paymentMethod,
          status: "SUCCESS",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment processing failed");
      }

      navigate("/customer/invoices");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to process payment.");
    } finally {
      setPaying(false);
    }
  };

  const paymentOptions = [
    { id: "UPI", title: "UPI / QR Code", desc: "Instant transfer via GPay, PhonePe, Paytm" },
    { id: "CARD", title: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
    { id: "NETBANKING", title: "Net Banking", desc: "All major Indian retail banks" },
    { id: "BANK_TRANSFER", title: "Direct Wire / NEFT", desc: "Direct deposit transfer" },
  ];

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden">
      <AmbientBackground />
      <CustomerNavbar />

      <main className="max-w-2xl mx-auto pt-28 pb-16 px-4 sm:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton to="/customer/invoices" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <IconCreditCard className="w-6 h-6 text-sky-400" />
                Settle Invoice
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Secure checkout for invoice {invoice?.invoiceNumber || `#${id}`}
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <GlassCard className="p-12">
            <LoadingSpinner text="Connecting to payment gateway..." />
          </GlassCard>
        ) : !invoice ? (
          <GlassCard className="p-8 text-center text-slate-400">
            Invoice not available.
          </GlassCard>
        ) : (
          <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
            {/* Amount Due Banner */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Invoice Amount Due
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  ₹{Number(invoice.totalAmount || invoice.amount).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Invoice #{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {invoice.status}
                </span>
              </div>
            </div>

            {/* Select Payment Method */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Choose Payment Method
              </label>
              <div className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                      paymentMethod === opt.id
                        ? "bg-indigo-600/15 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.id}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="text-indigo-500 focus:ring-0"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{opt.title}</p>
                        <p className="text-xs text-slate-400">{opt.desc}</p>
                      </div>
                    </div>
                    {paymentMethod === opt.id && (
                      <IconCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/customer/invoices")}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={paying}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Pay ₹{Number(invoice.totalAmount || invoice.amount).toLocaleString("en-IN")}</span>
                )}
              </button>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
