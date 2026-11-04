import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconSettings, IconCheckCircle } from "../components/Icons";

function Settings() {
  const [formData, setFormData] = useState({
    companyName: "",
    supportEmail: "",
    currency: "INR",
    taxPercentage: "",
    invoicePrefix: "INV",
    timezone: "Asia/Kolkata",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/settings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch settings");
      }

      setFormData({
        companyName: data.companyName || "",
        supportEmail: data.supportEmail || "",
        currency: data.currency || "INR",
        taxPercentage: data.taxPercentage !== undefined && data.taxPercentage !== null ? data.taxPercentage : "",
        invoicePrefix: data.invoicePrefix || "INV",
        timezone: data.timezone || "Asia/Kolkata",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load system settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          taxPercentage: Number(formData.taxPercentage || 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      setMessage("System settings successfully persisted.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save settings.");
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconSettings className="w-6 h-6 text-indigo-400" />
                  System & Billing Preferences
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Global organization parameters, tax calculation rate, and invoice series
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {message && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-md p-4 text-emerald-300 flex items-center gap-3">
              <IconCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-semibold">{message}</span>
            </div>
          )}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving environment configurations..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Organization / Company Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. SubBill Global Inc."
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                      required
                    />
                  </div>

                  {/* Support Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Customer Support Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleChange}
                      placeholder="support@company.com"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                      required
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Default Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    >
                      <option value="INR" className="bg-slate-900 text-white">INR (₹) - Indian Rupee</option>
                      <option value="USD" className="bg-slate-900 text-white">USD ($) - US Dollar</option>
                      <option value="EUR" className="bg-slate-900 text-white">EUR (€) - Euro</option>
                      <option value="GBP" className="bg-slate-900 text-white">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  {/* Tax Percentage */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Tax Rate (%) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="taxPercentage"
                      value={formData.taxPercentage}
                      onChange={handleChange}
                      placeholder="e.g. 18"
                      min="0"
                      max="100"
                      step="any"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                      required
                    />
                  </div>

                  {/* Invoice Prefix */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Invoice Number Prefix
                    </label>
                    <input
                      type="text"
                      name="invoicePrefix"
                      value={formData.invoicePrefix}
                      onChange={handleChange}
                      placeholder="e.g. INV-"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm font-mono placeholder-slate-500"
                    />
                  </div>

                  {/* Timezone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      System Timezone
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    >
                      <option value="Asia/Kolkata" className="bg-slate-900 text-white">Asia/Kolkata (IST +5:30)</option>
                      <option value="UTC" className="bg-slate-900 text-white">UTC (+0:00)</option>
                      <option value="America/New_York" className="bg-slate-900 text-white">America/New_York (EST)</option>
                      <option value="Europe/London" className="bg-slate-900 text-white">Europe/London (GMT/BST)</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save System Preferences</span>
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

export default Settings;
