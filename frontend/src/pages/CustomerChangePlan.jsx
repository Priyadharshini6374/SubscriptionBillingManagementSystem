import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../api";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";

function CustomerChangePlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionResponse, plansResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/subscriptions/${id}`
            ),
            fetch(`${API_URL}/api/plans`),
          ]);

        if (!subscriptionResponse.ok || !plansResponse.ok) {
          throw new Error("Failed to load data");
        }

        const subscriptionData =
          await subscriptionResponse.json();

        const plansData = await plansResponse.json();

        setSubscription(subscriptionData);

        const activePlans = plansData.filter(
          (plan) => plan.status === "ACTIVE"
        );

        setPlans(activePlans);

        if (subscriptionData.plan?.id) {
          setSelectedPlan(
            String(subscriptionData.plan.id)
          );
        }
      } catch (err) {
        console.error("Change plan error:", err);
        setError("Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChangePlan = async () => {
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }

    if (
      Number(selectedPlan) ===
      Number(subscription?.plan?.id)
    ) {
      setError("Please select a different plan.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/subscriptions/${id}/change-plan`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: Number(selectedPlan),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change plan"
        );
      }

      alert("Plan changed successfully!");

      navigate("/customer/subscription");
    } catch (err) {
      console.error("Change plan error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading subscription...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Change Plan
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Choose a different subscription plan
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

        {subscription && (
          <div className="max-w-5xl">

            {/* Current Plan */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-gray-500">
                Current Plan
              </p>

              <div className="mt-2 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {subscription.plan?.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    ₹
                    {Number(
                      subscription.plan?.price || 0
                    ).toFixed(2)}{" "}
                    / {subscription.plan?.billingCycle}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  {subscription.status}
                </span>

              </div>
            </div>

            {/* Available Plans */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Available Plans
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {plans.map((plan) => {
                  const isCurrent =
                    Number(plan.id) ===
                    Number(subscription.plan?.id);

                  const isSelected =
                    Number(selectedPlan) ===
                    Number(plan.id);

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlan(String(plan.id))
                      }
                      className={`rounded-xl border p-6 text-left shadow-sm transition ${
                        isSelected
                          ? "border-gray-900 ring-2 ring-gray-900"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">

                        <h3 className="text-lg font-bold text-gray-900">
                          {plan.name}
                        </h3>

                        {isCurrent && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            Current
                          </span>
                        )}

                      </div>

                      <p className="mt-4 text-2xl font-bold text-gray-900">
                        ₹{Number(plan.price).toFixed(2)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {plan.billingCycle}
                      </p>

                      <p className="mt-4 text-sm text-gray-600">
                        {plan.description ||
                          "Subscription plan"}
                      </p>

                      {Array.isArray(plan.features) && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700">
                            Features
                          </p>

                          <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            {plan.features.map(
                              (feature, index) => (
                                <li key={index}>
                                  ✓ {feature}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    </button>
                  );
                })}

              </div>
            </div>

            {/* Confirm */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Plan Change
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Your subscription will be updated to the
                selected plan.
              </p>

              <button
                onClick={handleChangePlan}
                disabled={saving}
                className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Changing Plan..."
                  : "Confirm Change"}
              </button>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default CustomerChangePlan;

