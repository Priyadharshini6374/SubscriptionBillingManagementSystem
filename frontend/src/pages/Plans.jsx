import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/plans");

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();

      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load plans from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const formatBillingCycle = (cycle) => {
    if (!cycle) return "";

    return cycle.charAt(0) + cycle.slice(1).toLowerCase();
  };

  const handleCreatePlan = () => {
    navigate("/plans/create");
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
                  Plans
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage subscription plans
                </p>
              </div>
            </div>

            <button
              onClick={handleCreatePlan}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Create Plan
            </button>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Loading plans...
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
                onClick={fetchPlans}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Plans */}
          {!loading && !error && plans.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                No plans found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your first subscription plan.
              </p>
            </div>
          )}

          {/* Plans */}
          {!loading && !error && plans.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                  {/* Plan Name */}
                  <div className="mb-4 flex items-start justify-between">

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {plan.description || "No description"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        plan.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {plan.status}
                    </span>

                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>

                    <span className="ml-2 text-sm text-gray-500">
                      / {formatBillingCycle(plan.billingCycle)}
                    </span>
                  </div>

                  {/* Plan Details */}
                  <div className="space-y-3 border-t border-gray-100 pt-5">

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Trial Period
                      </span>

                      <span className="font-medium text-gray-800">
                        {plan.trialPeriod} days
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Maximum Users
                      </span>

                      <span className="font-medium text-gray-800">
                        {plan.maximumUsers || "Unlimited"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Storage
                      </span>

                      <span className="font-medium text-gray-800">
                        {plan.storageLimit
                          ? `${plan.storageLimit} GB`
                          : "Unlimited"}
                      </span>
                    </div>

                  </div>

                  {/* Features */}
                  <div className="mt-5 border-t border-gray-100 pt-5">

                    <p className="mb-3 text-sm font-semibold text-gray-800">
                      Features
                    </p>

                    {Array.isArray(plan.features) &&
                    plan.features.length > 0 ? (
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <span className="text-green-600">
                              ✓
                            </span>

                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No features added
                      </p>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">

                    <button
                      onClick={() =>
                        navigate(`/plans/edit/${plan.id}`)
                      }
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={fetchPlans}
                      className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Refresh
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Plans;