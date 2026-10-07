import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function CreateRefund() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    paymentId: "",
    amount: "",
    reason: "",
  });

  useEffect(() => {
    fetch("${API_URL}/api/payments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        return response.json();
      })
      .then((data) => {
        // Only successful payments can be refunded
        const successfulPayments = data.filter(
          (payment) => payment.status === "SUCCESS"
        );

        setPayments(successfulPayments);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load successful payments");
        setLoading(false);
      });
  }, []);

  const selectedPayment = payments.find(
    (payment) => payment.id === Number(formData.paymentId)
  );

  const handlePaymentChange = (event) => {
    const paymentId = event.target.value;

    const payment = payments.find(
      (item) => item.id === Number(paymentId)
    );

    setFormData({
      ...formData,
      paymentId,
      amount: payment ? Number(payment.amount).toFixed(2) : "",
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.paymentId) {
      setError("Please select a payment");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid refund amount");
      return;
    }

    if (
      selectedPayment &&
      Number(formData.amount) > Number(selectedPayment.amount)
    ) {
      setError("Refund amount cannot exceed payment amount");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "${API_URL}/api/refunds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: Number(formData.paymentId),
            amount: Number(formData.amount),
            reason: formData.reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process refund");
      }

      alert("Refund processed successfully");

      navigate(`/refunds/${data.refund.id}`);
    } catch (error) {
      console.error(error);
      setError(error.message);
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
          <div className="mb-6 flex items-center gap-4">
            <BackButton />

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Process Refund
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Refund a successful customer payment
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

            {loading ? (
              <p className="text-gray-500">
                Loading successful payments...
              </p>
            ) : payments.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-6 text-center">

                <div className="text-4xl">
                  💳
                </div>

                <h3 className="mt-3 text-lg font-semibold text-gray-800">
                  No refundable payments
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Only successful payments can be refunded.
                </p>

                <button
                  onClick={() => navigate("/payments")}
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  View Payments
                </button>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Payment */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Payment
                  </label>

                  <select
                    value={formData.paymentId}
                    onChange={handlePaymentChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="">
                      Select a successful payment
                    </option>

                    {payments.map((payment) => (
                      <option
                        key={payment.id}
                        value={payment.id}
                      >
                        {payment.transactionId} — ₹
                        {Number(payment.amount).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Information */}
                {selectedPayment && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                    <h3 className="font-semibold text-gray-800">
                      Payment Information
                    </h3>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                      <div>
                        <p className="text-xs text-gray-500">
                          Customer
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {selectedPayment.user?.name || "Unknown"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Transaction ID
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {selectedPayment.transactionId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Invoice
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {selectedPayment.invoice?.invoiceNumber || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Payment Amount
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          ₹{Number(selectedPayment.amount).toFixed(2)}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                {/* Refund Amount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Refund Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.amount}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          amount: event.target.value,
                        })
                      }
                      placeholder="Enter refund amount"
                      className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none focus:border-gray-500"
                    />
                  </div>

                  {selectedPayment && (
                    <p className="mt-2 text-xs text-gray-500">
                      Maximum refundable amount: ₹
                      {Number(selectedPayment.amount).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Refund Reason
                  </label>

                  <textarea
                    value={formData.reason}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        reason: event.target.value,
                      })
                    }
                    placeholder="Enter reason for refund"
                    rows="4"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    type="button"
                    onClick={() => navigate("/refunds")}
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
                      ? "Processing..."
                      : "Process Refund"}
                  </button>

                </div>

              </form>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default CreateRefund;
