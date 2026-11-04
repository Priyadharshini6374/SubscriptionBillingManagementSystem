import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconCoupons } from "../components/Icons";

function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxUses: "",
    expiresAt: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/coupons/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Coupon not found");
      }

      setFormData({
        code: data.code || "",
        discountType: data.discountType || "PERCENTAGE",
        discountValue: data.discountValue || "",
        maxUses:
          data.maxUses !== null && data.maxUses !== undefined
            ? data.maxUses
            : "",
        expiresAt: data.expiresAt ? data.expiresAt.split("T")[0] : "",
        status: data.status || "ACTIVE",
      });
    } catch (err) {
      console.error("Failed to fetch coupon:", err);
      setError(err.message || "Failed to load coupon.");
    } finally {
      setLoading(false);
    }
  };

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

      const response = await fetch(`${API_URL}/api/coupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update coupon");
        return;
      }

      navigate("/coupons");
    } catch (err) {
      console.error(err);
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
                  Edit Coupon #{id}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Update coupon parameters, discount values, and validity
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Retrieving coupon settings..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Coupon Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm font-mono uppercase"
                    required
                  />
                </div>

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
                      min="0"
                      step="any"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Max Redemptions
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
                      Expiration Date
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
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

export default EditCoupon;
