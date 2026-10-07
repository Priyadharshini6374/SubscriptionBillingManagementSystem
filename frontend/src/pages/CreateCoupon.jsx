import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.code.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    if (!formData.discountValue) {
      alert("Please enter a discount value");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/coupons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create coupon");
        return;
      }

      alert("Coupon created successfully");

      navigate("/coupons");
    } catch (error) {
      console.error("Create coupon error:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div className="mb-6">
            <BackButton />

            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              Create Coupon
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create a discount coupon for customers
            </p>
          </div>

          {/* Form */}
          <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Coupon Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Coupon Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Example: WELCOME20"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-gray-900"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Coupon codes are automatically converted to uppercase.
                </p>
              </div>

              {/* Discount Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Type
                </label>

                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                >
                  <option value="PERCENTAGE">
                    Percentage
                  </option>

                  <option value="FIXED">
                    Fixed Amount
                  </option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Value
                </label>

                <div className="relative">

                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder={
                      formData.discountType === "PERCENTAGE"
                        ? "Example: 20"
                        : "Example: 100"
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-gray-900"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    {formData.discountType === "PERCENTAGE"
                      ? "%"
                      : "₹"}
                  </span>

                </div>

                {formData.discountType === "PERCENTAGE" && (
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a value between 1 and 100.
                  </p>
                )}
              </div>

              {/* Maximum Uses */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Maximum Uses
                </label>

                <input
                  type="number"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  min="1"
                  placeholder="Leave empty for unlimited"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty if the coupon can be used unlimited times.
                </p>
              </div>

              {/* Expiry */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty if the coupon does not expire.
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Preview */}
              <div className="rounded-lg bg-gray-50 p-5">

                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Coupon Preview
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <p className="text-xs text-gray-500">
                      Code
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {formData.code
                        ? formData.code.toUpperCase()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Discount
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {formData.discountValue
                        ? formData.discountType === "PERCENTAGE"
                          ? `${formData.discountValue}%`
                          : `₹${formData.discountValue}`
                        : "—"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                <button
                  type="button"
                  onClick={() => navigate("/coupons")}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Coupon"}
                </button>

              </div>

            </form>

          </div>

        </div>
      </main>
    </div>
  );
}

export default CreateCoupon;