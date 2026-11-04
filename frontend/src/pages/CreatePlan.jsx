import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, ErrorBanner } from "../components/UI";
import { IconPlans, IconPlus } from "../components/Icons";

function CreatePlan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billingCycle: "Monthly",
    trialPeriod: "0",
    features: "",
    maxUsers: "",
    storage: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Plan name is required.");
      return;
    }

    if (!formData.price) {
      setError("Price is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          billingCycle: formData.billingCycle.toUpperCase(),
          trialPeriod: Number(formData.trialPeriod) || 0,
          features: formData.features
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean),
          maximumUsers: formData.maxUsers ? Number(formData.maxUsers) : null,
          storageLimit: formData.storage ? Number(formData.storage) : null,
          status: formData.status.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create plan.");
        return;
      }

      navigate("/plans");
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
              <BackButton to="/plans" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconPlans className="w-6 h-6 text-indigo-400" />
                  Create New Plan
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Define pricing parameters, intervals, and entitlements
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          <GlassCard className="p-8 sm:p-10 border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Plan Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Enterprise Pro"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Short description of the plan tier and target audience"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Price (INR ₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 2999"
                    min="0"
                    step="any"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    required
                  />
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="Monthly" className="bg-slate-900 text-white">Monthly</option>
                    <option value="Quarterly" className="bg-slate-900 text-white">Quarterly</option>
                    <option value="Yearly" className="bg-slate-900 text-white">Yearly</option>
                  </select>
                </div>

                {/* Trial Period */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Trial Period (Days)
                  </label>
                  <input
                    type="number"
                    name="trialPeriod"
                    value={formData.trialPeriod}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="Active" className="bg-slate-900 text-white">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>

                {/* Max Users */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Maximum Users (Optional)
                  </label>
                  <input
                    type="number"
                    name="maxUsers"
                    value={formData.maxUsers}
                    onChange={handleChange}
                    min="1"
                    placeholder="Unlimited"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                </div>

                {/* Storage Limit */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Storage Limit in GB (Optional)
                  </label>
                  <input
                    type="number"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    min="0"
                    placeholder="Unlimited"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Features List (Separated by commas)
                  </label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    placeholder="e.g. 24/7 Priority Support, Unlimited Invoices, Custom Domains"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Separate distinct feature highlights with a comma.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/plans")}
                  className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <IconPlus className="w-4 h-4" />
                      <span>Create Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

export default CreatePlan;
