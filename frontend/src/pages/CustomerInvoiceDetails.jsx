import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../api";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";

function CustomerInvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer information not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/invoices/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load invoice."
          );
        }

        // Compare both IDs as numbers
        const invoiceUserId = Number(data.user?.id);
        const loggedInUserId = Number(customerUser.id);

        if (invoiceUserId !== loggedInUserId) {
          setError("You are not authorized to view this invoice.");
          setLoading(false);
          return;
        }

        setInvoice(data);
      } catch (err) {
        console.error("Invoice details error:", err);

        setError(
          err.message || "Failed to load invoice."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
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
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "OVERDUE":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      case "DRAFT":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading invoice...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your invoice and payment information
          </p>
        </div>

        <CustomerLogoutButton />
      </header>

      <main className="p-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {error && (
          <div className="max-w-4xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {invoice && (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Invoice Number
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    {invoice.invoiceNumber}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Invoice ID: #{invoice.id}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </div>

              {/* Subscription */}
              <div className="mt-6 rounded-lg border border-gray-200 p-5">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Subscription
                </p>

                {invoice.subscription ? (
                  <>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {invoice.subscription.plan?.name || "—"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Subscription #{invoice.subscription.id}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    No subscription linked
                  </p>
                )}
              </div>

              {/* Invoice Information */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Invoice Information
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Issue Date
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(invoice.issueDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Due Date
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Amount Summary
                </h3>

                <div className="mt-5 ml-auto max-w-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Amount
                    </span>

                    <span className="text-sm text-gray-900">
                      ₹{Number(invoice.amount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Tax
                    </span>

                    <span className="text-sm text-gray-900">
                      ₹{Number(invoice.tax || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      ₹{Number(invoice.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment Information
                </h3>

                {invoice.payments &&
                invoice.payments.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {invoice.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {payment.transactionId}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {payment.paymentMethod ||
                                "Payment method not specified"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ₹{Number(payment.amount || 0).toFixed(2)}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {payment.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                      No payment has been recorded for this invoice yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Pay Now */}
              {(invoice.status === "PENDING" ||
                invoice.status === "OVERDUE") && (
                <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                  <button
                    onClick={() =>
                      navigate(`/customer/pay/${invoice.id}`)
                    }
                    className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    💳 Pay Now
                  </button>
                </div>
              )}

              {/* Back Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    navigate("/customer/invoices")
                  }
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Back to Invoices
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerInvoiceDetails;
