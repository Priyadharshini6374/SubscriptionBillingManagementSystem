import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";
import API_URL from "../api";

function CancelSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError("");

        const customerUser = JSON.parse(
          localStorage.getItem("customerUser") || "null"
        );

        if (!customerUser?.id) {
          setError("Customer information not found.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/subscriptions/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load subscription."
          );
        }

        // Make sure this subscription belongs to
        // the currently logged-in customer
        if (data.userId !== customerUser.id) {
          setError("You are not authorized to access this subscription.");
          return;
        }

        setSubscription(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/subscriptions/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel subscription."
        );
      }

      alert("Subscription cancelled successfully!");

      navigate("/customer/subscription");
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to connect to the backend."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="flex items-center justify-between border-b bg-white px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Cancel Subscription
          </h1>

          <CustomerLogoutButton />
        </header>

        <main className="p-8">
          <p className="text-sm text-gray-500">
            Loading subscription...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cancel Subscription
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your subscription
          </p>
        </div>

        <CustomerLogoutButton />

      </header>

      <main className="p-8">

        <div className="mb-6">
          <BackButton />
        </div>

        {error && (
          <div className="mb-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {subscription && !error && (
          <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Warning */}
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">

              <h2 className="text-lg font-semibold text-red-700">
                Cancel Your Subscription
              </h2>

              <p className="mt-2 text-sm text-red-600">
                Are you sure you want to cancel your current
                subscription? Your subscription will be marked
                as cancelled and will remain in the system for
                billing history.
              </p>

            </div>

            {/* Subscription Details */}
            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Current Plan
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {subscription.plan?.name || "Plan"}
                </p>

                <p className="text-sm text-gray-500">
                  ₹
                  {Number(
                    subscription.plan?.price || 0
                  ).toFixed(2)}
                  {" / "}
                  {subscription.plan?.billingCycle || ""}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Subscription ID
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  #{subscription.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Current Status
                </p>

                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {subscription.status}
                </span>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">

              <button
                type="button"
                onClick={() =>
                  navigate("/customer/subscription")
                }
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep Subscription
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Yes, Cancel Subscription"}
              </button>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default CancelSubscription;