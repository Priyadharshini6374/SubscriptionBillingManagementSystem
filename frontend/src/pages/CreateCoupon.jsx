import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, ErrorBanner } from "../components/UI";
import { IconCoupons, IconPlus } from "../components/Icons";

function CreateCoupon() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxUses: "",
    expiresAt: "",
    status: "ACTIVE",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    if (!formData.discountValue) {
      setError("Please enter a discount value");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create coupon");
        return;
      }

      navigate("/coupons");
    } catch (err) {
      console.error("Create coupon error:", err);
      setError("Something went wrong while connecting to the backend.");
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
              <BackButton to="/coupons" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconCoupons className="w-6 h-6 text-purple-400" />
                  Create Discount Coupon
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Configure promotion code, discount rules, and usage constraints
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          <GlassCard className="p-8 sm:p-10 border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Promo Code */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Coupon Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. FLASH30, WELCOME2026"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm font-mono uppercase placeholder-slate-500"
                  required
                />
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                  >
                    <option value="PERCENTAGE" className="bg-slate-900 text-white">Percentage (%)</option>
                    <option value="FIXED" className="bg-slate-900 text-white">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Discount Value <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={formData.discountType === "PERCENTAGE" ? "20" : "500"}
                    min="0"
                    step="any"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Max Uses & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Maximum Redemption Cap (Optional)
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleChange}
                    min="1"
                    placeholder="Unlimited"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  />
                </div>
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
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                >
                  <option value="ACTIVE" className="bg-slate-900 text-white">ACTIVE</option>
                  <option value="INACTIVE" className="bg-slate-900 text-white">INACTIVE</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/coupons")}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <IconPlus className="w-4 h-4" />
                      <span>Create Coupon</span>
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

export default CreateCoupon;
