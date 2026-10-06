import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscription();
  }, [id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/subscriptions/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load subscription."
        );
        return;
      }

      setSubscription(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .replace("_", " ")
      .charAt(0)
      .toUpperCase() +
      status
        .replace("_", " ")
        .slice(1)
        .toLowerCase();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "TRIAL":
        return "bg-blue-100 text-blue-700";

      case "PAST_DUE":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "EXPIRED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-20">
          <div className="px-8 py-10 text-center">
            <p className="text-sm text-gray-500">
              Loading subscription...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-20">
        <div className="px-8 py-6">

          {/* Header */}
          <div className="mb-6 flex items-center gap-4">

            <BackButton />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Subscription Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View subscription information
              </p>
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="max-w-4xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Details */}
          {!error && subscription && (
            <div className="max-w-4xl space-y-6">

              {/* Main Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 pb-6">

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Subscription ID
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      #{subscription.id}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                      subscription.status
                    )}`}
                  >
                    {formatStatus(
                      subscription.status
                    )}
                  </span>

                </div>

                {/* Customer + Plan */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Customer */}
                  <div className="rounded-lg border border-gray-200 p-5">

                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Customer
                    </p>

                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {subscription.user.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {subscription.user.email}
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                      Customer ID: #{subscription.user.id}
                    </p>

                  </div>

                  {/* Plan */}
                  <div className="rounded-lg border border-gray-200 p-5">

                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Subscription Plan
                    </p>

                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {subscription.plan.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹
                      {subscription.plan.price.toString()}{" "}
                      /{" "}
                      {subscription.plan.billingCycle.toLowerCase()}
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                      Plan ID: #{subscription.plan.id}
                    </p>

                  </div>

                </div>

                {/* Dates */}
                <div className="mt-6 border-t border-gray-200 pt-6">

                  <h3 className="text-sm font-semibold text-gray-900">
                    Billing Information
                  </h3>

                  <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Start Date
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(
                          subscription.startDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Trial / End Date
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(
                          subscription.endDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Next Billing
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(
                          subscription.nextBillingDate
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    onClick={() =>
                      navigate(
                        `/subscriptions/change-plan/${subscription.id}`
                      )
                    }
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Change Plan
                  </button>

                  {(subscription.status === "ACTIVE" ||
                    subscription.status === "TRIAL") && (
                    <button
                      onClick={() =>
                        navigate(
                          `/subscriptions/cancel/${subscription.id}`
                        )
                      }
                      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Cancel Subscription
                    </button>
                  )}

                </div>

              </div>

              {/* Invoice Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-900">
                  Invoices
                </h2>

                {subscription.invoices &&
                subscription.invoices.length > 0 ? (
                  <div className="mt-5 overflow-x-auto">

                    <table className="w-full text-left">

                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                            Invoice
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                            Amount
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                            Status
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                            Date
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {subscription.invoices.map(
                          (invoice) => (
                            <tr
                              key={invoice.id}
                              className="border-b border-gray-100 last:border-0"
                            >

                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {invoice.invoiceNumber}
                              </td>

                              <td className="px-4 py-3 text-sm text-gray-600">
                                ₹
                                {invoice.totalAmount.toString()}
                              </td>

                              <td className="px-4 py-3 text-sm text-gray-600">
                                {invoice.status}
                              </td>

                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatDate(
                                  invoice.issueDate
                                )}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">
                    No invoices generated yet.
                  </p>
                )}

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default SubscriptionDetails;