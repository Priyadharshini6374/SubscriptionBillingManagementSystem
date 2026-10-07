import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function ChangePlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subscriptionResponse, plansResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/subscriptions/${id}`),
          fetch(`${API_URL}/api/plans`),
        ]);

      const subscriptionData =
        await subscriptionResponse.json();

      const plansData = await plansResponse.json();

      if (!subscriptionResponse.ok) {
        throw new Error(
          subscriptionData.message ||
            "Failed to load subscription."
        );
      }

      if (!plansResponse.ok) {
        throw new Error(
          plansData.message ||
            "Failed to load plans."
        );
      }

      setSubscription(subscriptionData);

      const activePlans = plansData.filter(
        (plan) => plan.status === "ACTIVE"
      );

      setPlans(activePlans);

      setSelectedPlanId(
        String(subscriptionData.plan.id)
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to load subscription and plans."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(
    (plan) => String(plan.id) === selectedPlanId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!selectedPlanId) {
      setError("Please select a plan.");
      return;
    }

    if (
      subscription &&
      Number(selectedPlanId) === subscription.plan.id
    ) {
      setError("Please select a different plan.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/subscriptions/${id}/change-plan`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: Number(selectedPlanId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to change subscription plan."
        );
        return;
      }

      alert("Subscription plan changed successfully!");

      navigate(`/subscriptions/${id}`);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
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

          <div className="mb-6 flex items-center gap-4">
            <BackButton />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Change Subscription Plan
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Change the customer's current subscription plan
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {subscription && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

              <div className="mb-6 rounded-lg bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Customer
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {subscription.user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {subscription.user.email}
                </p>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Current Plan
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {subscription.plan.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{subscription.plan.price.toString()} /{" "}
                    {subscription.plan.billingCycle.toLowerCase()}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select New Plan *
                  </label>

                  <select
                    value={selectedPlanId}
                    onChange={(e) =>
                      setSelectedPlanId(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="">
                      Select a plan
                    </option>

                    {plans.map((plan) => (
                      <option
                        key={plan.id}
                        value={plan.id}
                      >
                        {plan.name} — ₹
                        {plan.price.toString()} /{" "}
                        {plan.billingCycle.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPlan &&
                  Number(selectedPlanId) !==
                    subscription.plan.id && (
                    <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-5">

                      <h2 className="text-sm font-semibold text-gray-900">
                        New Plan
                      </h2>

                      <div className="mt-4 space-y-3">

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Plan
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            {selectedPlan.name}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Price
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            ₹{selectedPlan.price.toString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Billing Cycle
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            {selectedPlan.billingCycle}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Trial Period
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            {selectedPlan.trialPeriod} days
                          </span>
                        </div>

                      </div>
                    </div>
                  )}

                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/subscriptions/${id}`)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Changing..."
                      : "Change Plan"}
                  </button>

                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ChangePlan;