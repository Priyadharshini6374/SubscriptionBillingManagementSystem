import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function RefundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchRefund = () => {
    setLoading(true);

    fetch(`http://localhost:5000/api/refunds/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch refund details");
        }

        return response.json();
      })
      .then((data) => {
        setRefund(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load refund details");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRefund();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const updateRefundStatus = async (status) => {
    const action =
      status === "COMPLETED"
        ? "complete this refund"
        : "mark this refund as failed";

    const confirmed = window.confirm(
      `Are you sure you want to ${action}?`
    );

    if (!confirmed) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/refunds/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update refund"
        );
      }

      setRefund(data.refund);

      alert(
        status === "COMPLETED"
          ? "Refund completed successfully"
          : "Refund marked as failed"
      );

      fetchRefund();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8">
            <p className="text-gray-500">
              Loading refund details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !refund) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8">

            <BackButton />

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="font-medium text-red-700">
                {error || "Refund not found"}
              </p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  const payment = refund.payment;
  const invoice = payment?.invoice;
  const subscription = invoice?.subscription;
  const plan = subscription?.plan;

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
                  Refund Details
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Refund #{refund.id}
                </p>
              </div>

            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                refund.status
              )}`}
            >
              {refund.status}
            </span>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Processing Actions */}
          {refund.status === "PROCESSING" && (
            <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>
                  <h2 className="text-lg font-semibold text-yellow-900">
                    Refund Awaiting Action
                  </h2>

                  <p className="mt-1 text-sm text-yellow-800">
                    Review the refund request and choose whether to
                    complete or reject it.
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      updateRefundStatus("FAILED")
                    }
                    disabled={updating}
                    className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Fail Refund"}
                  </button>

                  <button
                    onClick={() =>
                      updateRefundStatus("COMPLETED")
                    }
                    disabled={updating}
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Complete Refund"}
                  </button>

                </div>

              </div>

            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Refund Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

              <h2 className="text-lg font-semibold text-gray-800">
                Refund Summary
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Refund ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    #{refund.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Refund Amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    ₹{Number(refund.amount).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Refund Date
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {formatDate(refund.refundDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Reason
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {refund.reason || "No reason provided"}
                  </p>
                </div>

              </div>

            </div>

            {/* Customer */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-800">
                Customer
              </h2>

              <div className="mt-5">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                  {refund.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  {refund.user?.name || "Unknown"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {refund.user?.email || "-"}
                </p>

                <button
                  onClick={() =>
                    navigate(`/customers/${refund.user?.id}`)
                  }
                  className="mt-5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View Customer →
                </button>

              </div>

            </div>

            {/* Payment Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

              <h2 className="text-lg font-semibold text-gray-800">
                Original Payment
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Transaction ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {payment?.transactionId || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    ₹{Number(payment?.amount || 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {payment?.paymentMethod || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {payment?.status || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Invoice
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {invoice?.invoiceNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Plan
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                    {plan?.name || "-"}
                  </p>
                </div>

              </div>

            </div>

            {/* Refund Calculation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-800">
                Refund Calculation
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Original Payment
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{Number(payment?.amount || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Refund Amount
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{Number(refund.amount).toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">

                  <div className="flex justify-between">

                    <span className="font-semibold text-gray-800">
                      Remaining
                    </span>

                    <span className="font-bold text-gray-900">
                      ₹
                      {(
                        Number(payment?.amount || 0) -
                        Number(refund.amount)
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default RefundDetails;