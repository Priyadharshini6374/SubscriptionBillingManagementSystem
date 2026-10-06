import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";

function CustomerPaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer information not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/payments/${id}?userId=${customerUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load payment details."
          );
        }

        if (data.user?.id !== customerUser.id) {
          setError(
            "You are not authorized to view this payment."
          );
          return;
        }

        setPayment(data);
      } catch (err) {
        console.error("Payment details error:", err);

        setError(
          err.message || "Failed to load payment details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id, customerUser?.id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <BackButton />

        <div className="mt-6 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-600">
            Unable to load payment
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your payment transaction details
          </p>
        </div>

        <CustomerLogoutButton />
      </header>

      <main className="p-8">

        <div className="mb-6">
          <BackButton />
        </div>

        <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

          <div className="flex items-start justify-between border-b border-gray-200 pb-6">

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Transaction
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {payment.transactionId || "—"}
              </h2>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusClass(
                payment.status
              )}`}
            >
              {payment.status || "—"}
            </span>

          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Amount
              </p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                ₹{Number(payment.amount || 0).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Payment Method
              </p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {payment.paymentMethod
                  ? payment.paymentMethod.replace("_", " ")
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Payment Date
              </p>

              <p className="mt-2 text-sm text-gray-700">
                {formatDate(payment.paymentDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Payment ID
              </p>

              <p className="mt-2 text-sm text-gray-700">
                #{payment.id}
              </p>
            </div>

          </div>

          <div className="mt-8 rounded-lg bg-gray-50 p-5">

            <h3 className="text-sm font-semibold text-gray-900">
              Invoice Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-gray-500">
                  Invoice Number
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {payment.invoice?.invoiceNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Invoice Amount
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  ₹
                  {Number(
                    payment.invoice?.totalAmount || 0
                  ).toFixed(2)}
                </p>
              </div>

            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">

            <button
              onClick={() =>
                navigate("/customer/payments")
              }
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Payments
            </button>

            {payment.invoice?.id && (
              <button
                onClick={() =>
                  navigate(
                    `/customer/invoices/${payment.invoice.id}`
                  )
                }
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                View Invoice
              </button>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}

export default CustomerPaymentDetails;