import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";
import API_URL from "../api";

function CustomerSubscribe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/plans/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch plan"
          );
        }

        setPlan(data);
      } catch (error) {
        console.error("Plan error:", error);

        setError(
          error.message || "Unable to load plan"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      setError("");
      setSubscribing(true);

      const storedUser = localStorage.getItem(
        "customerUser"
      );

      if (!storedUser) {
        navigate("/customer/login");
        return;
      }

      const customer = JSON.parse(storedUser);

      const response = await fetch(
        `${API_URL}/api/subscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: customer.id,
            planId: plan.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Subscription failed"
        );
      }

      alert(
        "Subscription created successfully!"
      );

      navigate("/customer/subscription");
    } catch (error) {
      console.error(
        "Subscription error:",
        error
      );

      setError(
        error.message ||
          "Unable to create subscription"
      );
    } finally {
      setSubscribing(false);
    }
  };

  const formatBillingCycle = (cycle) => {
    if (cycle === "MONTHLY") return "month";
    if (cycle === "QUARTERLY") return "3 months";
    if (cycle === "YEARLY") return "year";

    return cycle?.toLowerCase() || "";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading plan...
        </p>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 pb-10 pt-24">
        <BackButton />

        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

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

        <BackButton />

        <div className="mx-auto mt-8 max-w-3xl">

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-gray-900">
              Subscribe to {plan.name}
            </h2>

            <p className="mt-2 text-gray-500">
              Review your plan details before subscribing.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}


          {/* Plan Summary */}

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col justify-between gap-6 md:flex-row">

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {plan.description ||
                    "Subscription plan"}
                </p>

              </div>


              <div className="md:text-right">

                <p className="text-3xl font-bold text-gray-900">
                  ₹
                  {Number(plan.price).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-sm text-gray-500">
                  per{" "}
                  {formatBillingCycle(
                    plan.billingCycle
                  )}
                </p>

              </div>

            </div>


            {/* Trial */}

            {plan.trialPeriod > 0 && (

              <div className="mt-6 rounded-lg bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-800">
                  Free Trial
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  This plan includes a{" "}
                  {plan.trialPeriod}-day free trial.
                </p>

              </div>

            )}


            {/* Features */}

            <div className="mt-8 border-t border-gray-100 pt-6">

              <h4 className="font-semibold text-gray-900">
                Plan Features
              </h4>

              <ul className="mt-4 space-y-3">

                {Array.isArray(plan.features) &&
                plan.features.length > 0 ? (

                  plan.features.map(
                    (feature, index) => (

                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >

                        <span className="font-semibold text-green-600">
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

            {(plan.maximumUsers !== null ||
              plan.storageLimit !== null) && (

              <div className="mt-8 border-t border-gray-100 pt-6">

                <h4 className="font-semibold text-gray-900">
                  Plan Limits
                </h4>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  {plan.maximumUsers !== null && (
                    <div className="rounded-lg bg-gray-50 p-4">

                      <p className="text-xs text-gray-500">
                        Maximum Users
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {plan.maximumUsers}
                      </p>

                    </div>
                  )}

                  {plan.storageLimit !== null && (
                    <div className="rounded-lg bg-gray-50 p-4">

                      <p className="text-xs text-gray-500">
                        Storage
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {plan.storageLimit} GB
                      </p>

                    </div>
                  )}

                </div>

              </div>

            )}


            {/* Subscribe */}

            <div className="mt-8 border-t border-gray-100 pt-6">

              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {subscribing
                  ? "Creating Subscription..."
                  : "Confirm Subscription"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                This is a simulated subscription and does
                not process real payments.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default CustomerSubscribe;