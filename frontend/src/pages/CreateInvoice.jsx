import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconInvoices, IconPlus } from "../components/Icons";

function CreateInvoice() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    subscriptionId: "",
    amount: "",
    tax: "0",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [customersResponse, subscriptionsResponse] = await Promise.all([
        fetch(`${API_URL}/api/customers`),
        fetch(`${API_URL}/api/subscriptions`),
      ]);

      const customersData = await customersResponse.json();
      const subscriptionsData = await subscriptionsResponse.json();

      if (!customersResponse.ok) {
        throw new Error(customersData.message || "Failed to load customers.");
      }

      if (!subscriptionsResponse.ok) {
        throw new Error(subscriptionsData.message || "Failed to load subscriptions.");
      }

      setCustomers(Array.isArray(customersData) ? customersData : []);
      setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load invoice dependency data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "userId") {
      setFormData((previous) => ({
        ...previous,
        userId: value,
        subscriptionId: "",
        amount: "",
      }));
    }
  };

  const customerSubscriptions = subscriptions.filter(
    (subscription) =>
      String(subscription.userId) === formData.userId &&
      (subscription.status === "ACTIVE" || subscription.status === "TRIAL")
  );

  const handleSubscriptionChange = (e) => {
    const subscriptionId = e.target.value;
    const subscription = subscriptions.find(
      (item) => String(item.id) === subscriptionId
    );

    setFormData((previous) => ({
      ...previous,
      subscriptionId,
      amount: subscription?.plan?.price ? subscription.plan.price.toString() : "",
    }));
  };

  const totalAmount =
    Number(formData.amount || 0) + Number(formData.tax || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userId) {
      setError("Please select a customer.");
      return;
    }

    if (!formData.amount) {
      setError("Please enter an invoice amount.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(formData.userId),
          subscriptionId: formData.subscriptionId
            ? Number(formData.subscriptionId)
            : null,
          amount: Number(formData.amount),
          tax: Number(formData.tax || 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create invoice.");
        return;
      }

      navigate("/invoices");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setSaving(false);
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
              <BackButton to="/invoices" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconInvoices className="w-6 h-6 text-sky-400" />
                  Generate Invoice
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Create a manual or recurring settlement billing document
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving customer & subscription context..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Customer */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Customer Account <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Choose a customer account...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Active Subscription */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Link Subscription (Optional)
                  </label>
                  <select
                    name="subscriptionId"
                    value={formData.subscriptionId}
                    onChange={handleSubscriptionChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    disabled={!formData.userId}
                  >
                    <option value="" className="bg-slate-900 text-white">
                      {!formData.userId
                        ? "Select a customer first"
                        : customerSubscriptions.length === 0
                        ? "No active subscriptions for this customer"
                        : "Select subscription plan..."}
                    </option>
                    {customerSubscriptions.map((sub) => (
                      <option key={sub.id} value={sub.id} className="bg-slate-900 text-white">
                        Sub #{sub.id} - {sub.plan?.name} (₹{sub.plan?.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount & Tax in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Base Amount (INR ₹) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="any"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Tax (INR ₹)
                    </label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="any"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Total Computed Preview */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Total Invoice Charge:</span>
                  <span className="text-xl font-bold text-sky-400">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/invoices")}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4" />
                        <span>Issue Invoice</span>
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

export default CreateInvoice;
