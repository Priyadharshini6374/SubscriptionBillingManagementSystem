import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";
import API_URL from "../api";

function CustomerPlans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/plans`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch plans"
        );
      }

      // Show only active plans to customers
      const activePlans = data.filter(
        (plan) => plan.status === "ACTIVE"
      );

      setPlans(activePlans);
    } catch (error) {
      console.error("Customer plans error:", error);

      setError(
        error.message || "Unable to load plans"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const formatBillingCycle = (cycle) => {
    if (cycle === "MONTHLY") return "month";
    if (cycle === "QUARTERLY") return "3 months";
    if (cycle === "YEARLY") return "year";

    return cycle?.toLowerCase() || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================== TOPBAR ==================== */}

      <header className="fixed left-0 right-0 top-0 z-10 h-16 border-b border-gray-200 bg-white">

        <div className="flex h-full items-center justify-between px-8">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              SubBill
            </h1>

            <p className="text-xs text-gray-500">
              Customer Portal
            </p>
          </div>

          <CustomerLogoutButton />

        </div>

      </header>


      {/* ==================== MAIN CONTENT ==================== */}

      <main className="px-8 pb-10 pt-24">

        {/* Header */}

        <div className="mb-8">

          <BackButton />

          <div className="mt-6">

            <h2 className="text-3xl font-bold text-gray-900">
              Choose a Plan
            </h2>

            <p className="mt-2 text-gray-500">
              Select the subscription plan that works best
              for you.
            </p>

          </div>

        </div>


        {/* Loading */}

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">

            <p className="text-sm text-gray-500">
              Loading plans...
            </p>

          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={fetchPlans}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>

          </div>
        )}


        {/* No Plans */}

        {!loading && !error && plans.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">

            <h3 className="text-lg font-semibold text-gray-800">
              No plans available
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no active subscription
              plans.
            </p>

          </div>
        )}


        {/* Plans */}

        {!loading && !error && plans.length > 0 && (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {plans.map((plan) => (

              <div
                key={plan.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Plan Name */}

                <div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm text-gray-500">
                    {plan.description ||
                      "Subscription plan"}
                  </p>

                </div>


                {/* Price */}

                <div className="mt-6">

                  <span className="text-4xl font-bold text-gray-900">
                    ₹{Number(plan.price).toLocaleString("en-IN")}
                  </span>

                  <span className="ml-1 text-sm text-gray-500">
                    / {formatBillingCycle(plan.billingCycle)}
                  </span>

                </div>


                {/* Trial */}

                {plan.trialPeriod > 0 && (

                  <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2">

                    <p className="text-sm font-medium text-gray-700">
                      {plan.trialPeriod}-day free trial
                    </p>

                  </div>

                )}


                {/* Features */}

                <div className="mt-6 flex-1">

                  <h4 className="text-sm font-semibold text-gray-800">
                    Features
                  </h4>

                  <ul className="mt-3 space-y-2">

                    {Array.isArray(plan.features) &&
                    plan.features.length > 0 ? (

                      plan.features.map(
                        (feature, index) => (

                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="mt-0.5 text-green-600">
                              ✓
                            </span>

                            <span>
                              {feature}
                            </span>
                          </li>

                        )
                      )

                    ) : (

                      <li className="text-sm text-gray-500">
                        Standard features included
                      </li>

                    )}

                  </ul>

                </div>


                {/* Limits */}

                <div className="mt-6 space-y-2 border-t border-gray-100 pt-5">

                  {plan.maximumUsers !== null &&
                    plan.maximumUsers !== undefined && (

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Maximum Users
                      </span>

                      <span className="font-medium text-gray-800">
                        {plan.maximumUsers}
                      </span>

                    </div>

                  )}


                  {plan.storageLimit !== null &&
                    plan.storageLimit !== undefined && (

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Storage
                      </span>

                      <span className="font-medium text-gray-800">
                        {plan.storageLimit} GB
                      </span>

                    </div>

                  )}

                </div>


                {/* Choose Plan */}

                <button
                  onClick={() =>
                    navigate(
                      `/customer/subscribe/${plan.id}`
                    )
                  }
                  className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Choose Plan
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default CustomerPlans;