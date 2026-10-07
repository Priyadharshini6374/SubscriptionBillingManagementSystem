import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function Refunds() {
  const navigate = useNavigate();

  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRefunds = () => {
    setLoading(true);

    fetch(`${API_URL}/api/refunds`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch refunds");
        }

        return response.json();
      })
      .then((data) => {
        setRefunds(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load refunds");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "PROCESSING") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "FAILED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-4">
              <BackButton />

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Refunds
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage customer payment refunds
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/refunds/create")}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Process Refund
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Refund Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Refund History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  All refund transactions
                </p>
              </div>

              <button
                onClick={fetchRefunds}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Refresh
              </button>

            </div>

            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  Loading refunds...
                </p>
              </div>
            ) : refunds.length === 0 ? (
              <div className="p-12 text-center">

                <div className="text-5xl">
                  ↩️
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  No refunds yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Refunds will appear here after a payment is refunded.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50">
                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Transaction
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Invoice
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {refunds.map((refund) => (
                      <tr
                        key={refund.id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-6 py-4">

                          <div>
                            <p className="font-medium text-gray-800">
                              {refund.user?.name || "Unknown"}
                            </p>

                            <p className="text-sm text-gray-500">
                              {refund.user?.email || "-"}
                            </p>
                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {refund.payment?.transactionId || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {refund.payment?.invoice?.invoiceNumber || "-"}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          ₹{Number(refund.amount).toFixed(2)}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              refund.status
                            )}`}
                          >
                            {refund.status}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(refund.refundDate)}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              navigate(`/refunds/${refund.id}`)
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Refunds;