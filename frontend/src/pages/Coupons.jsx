import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function Coupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/coupons"
      );

      const data = await response.json();

      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const getStatusClass = (status) => {
    if (status === "ACTIVE") {
      return "bg-green-100 text-green-700";
    }

    if (status === "EXPIRED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${Number(coupon.discountValue)}%`;
    }

    return `₹${Number(coupon.discountValue).toFixed(2)}`;
  };

  const formatExpiry = (expiresAt) => {
    if (!expiresAt) {
      return "No expiry";
    }

    return new Date(expiresAt).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">

            <div>
              <div className="mb-3">
                <BackButton />
              </div>

              <h1 className="text-2xl font-bold text-gray-800">
                Coupons
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage discount coupons and promotional offers
              </p>
            </div>

            <button
              onClick={() => navigate("/coupons/create")}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Create Coupon
            </button>

          </div>


          {/* Coupon Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading coupons...
              </div>
            ) : coupons.length === 0 ? (
              <div className="p-12 text-center">

                <div className="mb-4 text-5xl">
                  🎟️
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  No coupons found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first coupon to offer discounts to customers.
                </p>

                <button
                  onClick={() => navigate("/coupons/create")}
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Coupon
                </button>

              </div>
            ) : (
              <table className="w-full">

                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Coupon
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Discount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Usage
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Expires
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {coupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <p className="text-sm font-bold text-gray-800">
                          {coupon.code}
                        </p>

                        <p className="text-xs text-gray-500">
                          ID #{coupon.id}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <span className="text-sm font-semibold text-gray-800">
                          {formatDiscount(coupon)}
                        </span>

                        <p className="text-xs text-gray-500">
                          {coupon.discountType === "PERCENTAGE"
                            ? "Percentage"
                            : "Fixed amount"}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-700">
                          {coupon.usedCount}
                          {coupon.maxUses !== null
                            ? ` / ${coupon.maxUses}`
                            : " / Unlimited"}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-600">
                          {formatExpiry(coupon.expiresAt)}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            coupon.status
                          )}`}
                        >
                          {coupon.status}
                        </span>

                      </td>


                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            navigate(
                              `/coupons/${coupon.id}`
                            )
                          }
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/coupons/edit/${coupon.id}`
                            )
                          }
                          className="ml-4 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Coupons;