import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function Payments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/payments`
      );

      const data = await response.json();

      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusClass = (status) => {
    if (status === "SUCCESS") {
      return "bg-green-100 text-green-700";
    }

    if (status === "FAILED") {
      return "bg-red-100 text-red-700";
    }

    if (status === "REFUNDED") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-yellow-100 text-yellow-700";
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
                Payments
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage customer payment transactions
              </p>
            </div>

            <button
              onClick={() => navigate("/payments/create")}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Record Payment
            </button>
          </div>

          {/* Payment Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading payments...
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">

                <div className="mb-4 text-5xl">
                  💳
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  No payments found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Record a payment for a pending invoice to see it here.
                </p>

                <button
                  onClick={() => navigate("/payments/create")}
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Record Payment
                </button>

              </div>
            ) : (
              <table className="w-full">

                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Transaction
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Invoice
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Method
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {payment.transactionId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {payment.user?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {payment.user?.email}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {payment.invoice?.invoiceNumber}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{Number(payment.amount).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {payment.paymentMethod?.replace(
                            "_",
                            " "
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(
                            payment.paymentDate
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/payments/${payment.id}`
                            )
                          }
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          View
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

export default Payments;