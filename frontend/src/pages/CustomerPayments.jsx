import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";
import API_URL from "../api";

function CustomerPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer information not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/payments?userId=${customerUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load payments."
          );
        }

        setPayments(data);
      } catch (err) {
        console.error("Payment error:", err);

        setError(
          err.message || "Failed to load payments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [customerUser?.id]);

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

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading payments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your payment transactions
          </p>
        </div>

        <CustomerLogoutButton />
      </header>

      <main className="p-8">

        <div className="mb-6">
          <BackButton />
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && payments.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <div className="mb-4 text-5xl">
              💳
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              No Payments Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You currently do not have any payment transactions.
            </p>

          </div>
        )}

        {!error && payments.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Transaction
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
                          {payment.transactionId || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {payment.invoice?.invoiceNumber || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{Number(payment.amount || 0).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {payment.paymentMethod
                            ? payment.paymentMethod.replace(
                                "_",
                                " "
                              )
                            : "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status || "—"}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-600">
                          {formatDate(payment.paymentDate)}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            navigate(
                              `/customer/payments/${payment.id}`
                            )
                          }
                          className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default CustomerPayments;