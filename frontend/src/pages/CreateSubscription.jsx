import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";
import { AmbientBackground, GlassCard, LoadingSpinner, ErrorBanner } from "../components/UI";
import { IconSubscriptions, IconPlus, IconCheck } from "../components/Icons";

function CreateSubscription() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    planId: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

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

      const [customersResponse, plansResponse] = await Promise.all([
        fetch(`${API_URL}/api/customers`),
        fetch(`${API_URL}/api/plans`),
      ]);

      const customersData = await customersResponse.json();
      const plansData = await plansResponse.json();

      if (!customersResponse.ok) {
        throw new Error(customersData.message || "Failed to load customers");
      }

      if (!plansResponse.ok) {
        throw new Error(plansData.message || "Failed to load plans");
      }

      setCustomers(Array.isArray(customersData) ? customersData : []);
      setPlans(
        Array.isArray(plansData)
          ? plansData.filter((plan) => plan.status === "ACTIVE")
          : []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load customers and plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "planId") {
      setCoupon(null);
      setCouponError("");
    }
  };

  const selectedPlan = plans.find(
    (plan) => String(plan.id) === formData.planId
  );

  const originalPrice = selectedPlan ? Number(selectedPlan.price) : 0;
  let discountAmount = 0;

  if (coupon && selectedPlan) {
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (originalPrice * Number(coupon.discountValue)) / 100;
    } else {
      discountAmount = Number(coupon.discountValue);
    }
    discountAmount = Math.min(discountAmount, originalPrice);
  }

  const finalPrice = Math.max(originalPrice - discountAmount, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (!selectedPlan) {
      setCouponError("Please select a plan first.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCoupon(null);

      const response = await fetch(`${API_URL}/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.message || "Invalid coupon code.");
        return;
      }

      setCoupon(data.coupon);
    } catch (err) {
      console.error(err);
      setCouponError("Unable to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userId) {
      setError("Please select a customer.");
      return;
    }

    if (!formData.planId) {
      setError("Please select a plan.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(formData.userId),
          planId: Number(formData.planId),
          couponCode: coupon ? coupon.code : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create subscription.");
        return;
      }

      navigate("/subscriptions");
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/subscriptions" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <IconSubscriptions className="w-6 h-6 text-indigo-400" />
                  Assign New Subscription
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Select customer, choose service tier, and apply promotional discounts
                </p>
              </div>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <GlassCard className="p-12">
              <LoadingSpinner text="Loading customers and plan catalog..." />
            </GlassCard>
          ) : (
            <GlassCard className="p-8 sm:p-10 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Select Customer <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Choose a registered customer...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id} className="bg-slate-900 text-white">
                        {customer.name} ({customer.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Select Subscription Plan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="planId"
                    value={formData.planId}
                    onChange={handleChange}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-white">Choose a pricing package...</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id} className="bg-slate-900 text-white">
                        {plan.name} — ₹{plan.price} / {plan.billingCycle?.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Plan Details & Coupon */}
                {selectedPlan && (
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <p className="font-bold text-white text-base">{selectedPlan.name}</p>
                        <p className="text-xs text-slate-400">
                          {selectedPlan.description || "Active plan license"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-extrabold text-white">₹{selectedPlan.price}</p>
                        <p className="text-[11px] text-slate-400 capitalize">{selectedPlan.billingCycle?.toLowerCase()}</p>
                      </div>
                    </div>

                    {/* Coupon Input */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Promo / Coupon Code
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError("");
                          }}
                          placeholder="e.g. SAVE20"
                          className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {couponLoading ? "Checking..." : "Apply"}
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-2 text-xs text-rose-400 font-medium">{couponError}</p>
                      )}

                      {coupon && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                          <IconCheck className="w-4 h-4" />
                          <span>
                            Coupon applied: {coupon.code} ({coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Original Rate</span>
                        <span>₹{originalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                          <span>Discount Deduction</span>
                          <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                        <span>Net Subscription Fee</span>
                        <span className="text-indigo-400 text-base">₹{finalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Actions */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/subscriptions")}
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
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4" />
                        <span>Activate Subscription</span>
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

export default CreateSubscription;
