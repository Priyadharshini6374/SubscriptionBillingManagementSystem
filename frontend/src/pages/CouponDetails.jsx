import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

function CouponDetails() {
  const { id } = useParams();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/coupons/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Coupon not found");
        }
        return response.json();
      })
      .then((data) => {
        setCoupon(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading coupon details...</p>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50 p-8">
        <BackButton />
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-600">
            {error || "Coupon not found"}
          </p>
        </div>
      </div>
    );
  }

  const remainingUses =
    coupon.maxUses === null
      ? "Unlimited"
      : Math.max(coupon.maxUses - coupon.usedCount, 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const discountText =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}%`
      : `₹${coupon.discountValue}`;

  return (
    <div className="ml-64 min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Coupon Details
          </h1>
          <p className="mt-1 text-gray-500">
            View coupon information and usage history
          </p>
        </div>

        <div className="flex gap-3">
          <BackButton />

          <Link
            to={`/coupons/edit/${coupon.id}`}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Edit Coupon
          </Link>
        </div>
      </div>

      {/* Coupon Summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Coupon Code
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-wide text-gray-900">
              {coupon.code}
            </h2>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              coupon.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : coupon.status === "EXPIRED"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {coupon.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">
              Discount
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {discountText}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Discount Type
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {coupon.discountType}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Maximum Uses
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {coupon.maxUses ?? "Unlimited"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Used Count
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {coupon.usedCount}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Remaining Uses
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {remainingUses}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Expiry Date
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {formatDate(coupon.expiresAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Created Date
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {formatDate(coupon.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Updated
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {formatDate(coupon.updatedAt)}
            </p>
          </div>

        </div>
      </div>

      {/* Usage History */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Usage History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Subscriptions where this coupon was applied
          </p>
        </div>

        {coupon.subscriptionCoupons &&
        coupon.subscriptionCoupons.length > 0 ? (
          <div className="overflow-x-auto">

            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Applied Date</th>
                </tr>
              </thead>

              <tbody>
                {coupon.subscriptionCoupons.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      #{item.subscriptionId}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {item.subscription?.user?.name || "—"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.subscription?.user?.email || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {item.subscription?.plan?.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(item.appliedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-gray-500">
              This coupon has not been used yet.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default CouponDetails;