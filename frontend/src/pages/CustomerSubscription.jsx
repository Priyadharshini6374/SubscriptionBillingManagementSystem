import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";
import API_URL from "../api";

function CustomerSubscription() {
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer information not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/subscriptions?userId=${customerUser.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();

        const customerSubscription = data.find(
          (item) =>
            item.userId === customerUser.id &&
            ["ACTIVE", "TRIAL"].includes(item.status)
        );

        setSubscription(customerSubscription || null);
      } catch (err) {
        console.error("Subscription error:", err);
        setError("Failed to load subscription.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [customerUser?.id]);

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
        <p className="text-gray-600">Loading subscription...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Subscription
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your current subscription
          </p>
        </div>

        <CustomerLogoutButton />
      </header>

      <main className="p-8">

        <div className="mb-6">
          <BackButton />
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!subscription && !error && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-gray-800">
              No Active Subscription
            </h2>

            <p className="mt-2 text-gray-500">
              You currently do not have an active subscription.
            </p>

            <button
              onClick={() => navigate("/customer/plans")}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Browse Plans
            </button>

          </div>
        )}

        {subscription && (
          <div className="max-w-4xl">

            {/* Subscription Overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Current Plan
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    {subscription.plan?.name || "Plan"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {subscription.plan?.description ||
                      "Your current subscription plan"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    subscription.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {subscription.status}
                </span>

              </div>

              {/* Plan Price */}
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Price
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    ₹{Number(subscription.plan?.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Billing Cycle
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {subscription.plan?.billingCycle || "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Subscription ID
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    #{subscription.id}
                  </p>
                </div>

              </div>

              {/* Dates */}
              <div className="mt-8 border-t border-gray-200 pt-6">

                <h3 className="text-lg font-semibold text-gray-900">
                  Subscription Details
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                  <div>
                    <p className="text-sm text-gray-500">
                      Start Date
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {formatDate(subscription.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Next Billing Date
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {formatDate(subscription.nextBillingDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      End Date
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {formatDate(subscription.endDate)}
                    </p>
                  </div>

                </div>

              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">

                {/* Customer Change Plan */}
                <button
                  onClick={() =>
                    navigate(
                      `/customer/change-plan/${subscription.id}`
                    )
                  }
                  className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Change Plan
                </button>

                {/* Customer Cancel Subscription */}
                <button
                  onClick={() =>
                    navigate(
                      `/customer/cancel-subscription/${subscription.id}`
                    )
                  }
                  className="rounded-lg border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Cancel Subscription
                </button>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default CustomerSubscription;