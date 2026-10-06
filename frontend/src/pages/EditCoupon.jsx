import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

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

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/coupons/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Coupon not found");
        navigate("/coupons");
        return;
      }

      setFormData({
        code: data.code || "",
        discountType: data.discountType || "PERCENTAGE",
        discountValue: data.discountValue || "",
        maxUses:
          data.maxUses !== null && data.maxUses !== undefined
            ? data.maxUses
            : "",
        expiresAt: data.expiresAt
          ? data.expiresAt.split("T")[0]
          : "",
        status: data.status || "ACTIVE",
      });
    } catch (error) {
      console.error("Failed to fetch coupon:", error);
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
        `http://localhost:5000/api/coupons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update coupon");
        return;
      }

      alert("Coupon updated successfully");

      navigate("/coupons");
    } catch (error) {
      console.error("Update coupon error:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/coupons/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete coupon");
        return;
      }

      alert("Coupon deleted successfully");

      navigate("/coupons");
    } catch (error) {
      console.error("Delete coupon error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8 text-center text-gray-500">
            Loading coupon...
          </div>
        </main>
      </div>
    );
  }

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
              Edit Coupon
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update coupon details and status
            </p>
          </div>


          {/* Form */}
          <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Coupon Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-gray-900"
                />
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


              {/* Discount */}
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-gray-900"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    {formData.discountType === "PERCENTAGE"
                      ? "%"
                      : "₹"}
                  </span>

                </div>
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

                  <option value="EXPIRED">
                    Expired
                  </option>
                </select>
              </div>


              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">

                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Delete Coupon
                </button>

                <div className="flex gap-3">

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
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>
      </main>
    </div>
  );
}

export default EditCoupon;