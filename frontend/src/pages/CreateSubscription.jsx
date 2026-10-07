import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

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

      const [customersResponse, plansResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/customers`),
          fetch(`${API_URL}/api/plans`),
        ]);

      const customersData =
        await customersResponse.json();

      const plansData =
        await plansResponse.json();

      if (!customersResponse.ok) {
        throw new Error(
          customersData.message ||
            "Failed to load customers"
        );
      }

      if (!plansResponse.ok) {
        throw new Error(
          plansData.message ||
            "Failed to load plans"
        );
      }

      setCustomers(customersData);

      setPlans(
        plansData.filter(
          (plan) => plan.status === "ACTIVE"
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load customers and plans."
      );
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

    // Remove applied coupon when changing plan
    if (name === "planId") {
      setCoupon(null);
      setCouponError("");
    }
  };

  const selectedPlan = plans.find(
    (plan) => String(plan.id) === formData.planId
  );

  // Calculate prices
  const originalPrice = selectedPlan
    ? Number(selectedPlan.price)
    : 0;

  let discountAmount = 0;

  if (coupon && selectedPlan) {
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount =
        (originalPrice *
          Number(coupon.discountValue)) /
        100;
    } else {
      discountAmount = Number(
        coupon.discountValue
      );
    }

    // Discount cannot be greater than plan price
    discountAmount = Math.min(
      discountAmount,
      originalPrice
    );
  }

  const finalPrice = Math.max(
    originalPrice - discountAmount,
    0
  );

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError(
        "Please enter a coupon code."
      );
      return;
    }

    if (!selectedPlan) {
      setCouponError(
        "Please select a plan first."
      );
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCoupon(null);

      const response = await fetch(
        `${API_URL}/api/coupons/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: couponCode.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCouponError(
          data.message ||
            "Invalid coupon code."
        );
        return;
      }

      setCoupon(data.coupon);
    } catch (err) {
      console.error(err);

      setCouponError(
        "Unable to validate coupon."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userId) {
      setError(
        "Please select a customer."
      );
      return;
    }

    if (!formData.planId) {
      setError(
        "Please select a plan."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/subscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(formData.userId),
            planId: Number(formData.planId),

            // Send coupon information
            couponId: coupon
              ? Number(coupon.id)
              : null,

            discountAmount,
            finalAmount: finalPrice,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create subscription."
        );
        return;
      }

      alert(
        coupon
          ? `Subscription created successfully with ${coupon.code} coupon!`
          : "Subscription created successfully!"
      );

      navigate("/subscriptions");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-20">
        <div className="px-8 py-6">

          {/* Header */}
          <div className="mb-6 flex items-center gap-4">

            <BackButton />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Subscription
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a subscription for a customer
              </p>
            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading customers and plans...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mb-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          {!loading && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

              <form onSubmit={handleSubmit}>

                {/* Customer */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Customer *
                  </label>

                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="">
                      Select a customer
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name} —{" "}
                        {customer.email}
                      </option>
                    ))}
                  </select>

                  {customers.length === 0 && (
                    <p className="mt-2 text-xs text-red-500">
                      No customers available. Create a
                      customer first.
                    </p>
                  )}

                </div>

                {/* Plan */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subscription Plan *
                  </label>

                  <select
                    name="planId"
                    value={formData.planId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="">
                      Select a plan
                    </option>

                    {plans.map((plan) => (
                      <option
                        key={plan.id}
                        value={plan.id}
                      >
                        {plan.name} — ₹
                        {plan.price.toString()} /{" "}
                        {plan.billingCycle.toLowerCase()}
                      </option>
                    ))}
                  </select>

                  {plans.length === 0 && (
                    <p className="mt-2 text-xs text-red-500">
                      No active plans available. Create
                      an active plan first.
                    </p>
                  )}

                </div>

                {/* Selected Plan */}
                {selectedPlan && (
                  <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">

                    <h2 className="text-sm font-semibold text-gray-900">
                      Selected Plan
                    </h2>

                    <div className="mt-4 space-y-3">

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Plan
                        </span>

                        <span className="text-sm font-medium text-gray-900">
                          {selectedPlan.name}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Price
                        </span>

                        <span className="text-sm font-medium text-gray-900">
                          ₹
                          {originalPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Billing Cycle
                        </span>

                        <span className="text-sm font-medium text-gray-900">
                          {selectedPlan.billingCycle}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Trial Period
                        </span>

                        <span className="text-sm font-medium text-gray-900">
                          {selectedPlan.trialPeriod} days
                        </span>
                      </div>

                    </div>

                  </div>
                )}

                {/* Coupon */}
                {selectedPlan && (
                  <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">

                    <h2 className="text-sm font-semibold text-gray-900">
                      Apply Coupon
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Enter a valid coupon code to receive a discount.
                    </p>

                    <div className="mt-4 flex gap-3">

                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(
                            e.target.value.toUpperCase()
                          );
                          setCouponError("");
                        }}
                        placeholder="Enter coupon code"
                        disabled={coupon !== null}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-gray-500 disabled:bg-gray-100"
                      />

                      {!coupon ? (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {couponLoading
                            ? "Checking..."
                            : "Apply"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="rounded-lg border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    {/* Coupon success */}
                    {coupon && (
                      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-green-700">
                              Coupon Applied
                            </p>

                            <p className="mt-1 text-xs text-green-600">
                              {coupon.code} —{" "}
                              {coupon.discountType ===
                              "PERCENTAGE"
                                ? `${coupon.discountValue}% off`
                                : `₹${coupon.discountValue} off`}
                            </p>
                          </div>

                          <span className="text-lg font-bold text-green-700">
                            -₹
                            {discountAmount.toFixed(2)}
                          </span>
                        </div>

                      </div>
                    )}

                    {/* Coupon error */}
                    {couponError && (
                      <p className="mt-3 text-sm text-red-600">
                        {couponError}
                      </p>
                    )}

                  </div>
                )}

                {/* Price Summary */}
                {selectedPlan && (
                  <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-5">

                    <h2 className="text-sm font-semibold text-gray-900">
                      Price Summary
                    </h2>

                    <div className="mt-4 space-y-3">

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Original Price
                        </span>

                        <span className="text-sm font-medium text-gray-900">
                          ₹{originalPrice.toFixed(2)}
                        </span>
                      </div>

                      {coupon && (
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600">
                            Coupon Discount
                          </span>

                          <span className="text-sm font-medium text-green-600">
                            -₹{discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="text-base font-semibold text-gray-900">
                          Final Amount
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                          ₹{finalPrice.toFixed(2)}
                        </span>
                      </div>

                    </div>

                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/subscriptions")
                    }
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    {saving ? "Creating..." : "Create Subscription"}
                  </button>

                </div>

              </form>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default CreateSubscription;