import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function Subscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/subscriptions"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch subscriptions"
        );
      }

      setSubscriptions(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return (
      status.charAt(0) +
      status.slice(1).toLowerCase()
    );
  };

  const formatBillingCycle = (cycle) => {
    if (!cycle) return "";

    return (
      cycle.charAt(0) +
      cycle.slice(1).toLowerCase()
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-20">
        <div className="px-8 py-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <BackButton />

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Subscriptions
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage customer subscriptions
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                navigate("/subscriptions/create")
              }
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Create Subscription
            </button>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Loading subscriptions...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">

              <p className="text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={fetchSubscriptions}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            subscriptions.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">

                <div className="text-4xl">
                  🔄
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-800">
                  No subscriptions yet
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Create a subscription for a customer
                  to get started.
                </p>

                <button
                  onClick={() =>
                    navigate("/subscriptions/create")
                  }
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Subscription
                </button>

              </div>
            )}

          {/* Table */}
          {!loading &&
            !error &&
            subscriptions.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Plan
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Price
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Start Date
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Next Billing
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {subscriptions.map(
                        (subscription) => (
                          <tr
                            key={subscription.id}
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                          >

                            {/* Customer */}
                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                  {subscription.user.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {subscription.user.name}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {subscription.user.email}
                                  </p>
                                </div>

                              </div>

                            </td>

                            {/* Plan */}
                            <td className="px-6 py-4">

                              <p className="text-sm font-medium text-gray-900">
                                {subscription.plan.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {formatBillingCycle(
                                  subscription.plan
                                    .billingCycle
                                )}
                              </p>

                            </td>

                            {/* Price */}
                            <td className="px-6 py-4">

                              <span className="text-sm font-medium text-gray-900">
                                ₹
                                {subscription.plan.price.toString()}
                              </span>

                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                  subscription.status
                                )}`}
                              >
                                {formatStatus(
                                  subscription.status
                                )}
                              </span>

                            </td>

                            {/* Start Date */}
                            <td className="px-6 py-4 text-sm text-gray-600">

                              {new Date(
                                subscription.startDate
                              ).toLocaleDateString()}

                            </td>

                            {/* Next Billing */}
                            <td className="px-6 py-4 text-sm text-gray-600">

                              {subscription.nextBillingDate
                                ? new Date(
                                    subscription.nextBillingDate
                                  ).toLocaleDateString()
                                : "-"}

                            </td>

                            {/* Action */}
                            <td className="px-6 py-4">

                              <button
                                onClick={() =>
                                  navigate(
                                    `/subscriptions/${subscription.id}`
                                  )
                                }
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                View
                              </button>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            )}

        </div>
      </main>
    </div>
  );
}

export default Subscriptions;