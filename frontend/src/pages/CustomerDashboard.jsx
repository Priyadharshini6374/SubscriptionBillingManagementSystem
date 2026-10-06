import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLogoutButton from "../components/CustomerLogoutButton";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("customerUser");

    if (!storedUser) {
      navigate("/customer/login");
      return;
    }

    const user = JSON.parse(storedUser);

    setCustomer(user);

    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/customer-dashboard/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error("Customer dashboard error:", error);

        setError(
          error.message || "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const subscription = dashboard?.subscription;

  const currentPlan = subscription?.plan?.name || "No Plan";

  const subscriptionStatus =
    subscription?.status || "INACTIVE";

  const totalPayments =
    dashboard?.totalPayments || 0;

  const pendingInvoices =
    dashboard?.pendingInvoices || 0;

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

          <div className="flex items-center gap-5">

            <div className="text-right">

              <p className="text-sm font-medium text-gray-800">
                {customer?.name || "Customer"}
              </p>

              <p className="text-xs text-gray-500">
                {customer?.email || ""}
              </p>

            </div>

            <CustomerLogoutButton />

          </div>

        </div>

      </header>


      {/* ==================== MAIN CONTENT ==================== */}

      <main className="px-8 pb-10 pt-24">

        {/* Welcome */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {customer?.name || "Customer"}!
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your subscription, payments and invoices
            from one place.
          </p>

        </div>


        {/* ==================== SUMMARY CARDS ==================== */}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* Current Plan */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Current Plan
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              {currentPlan}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {subscription?.plan
                ? `₹${subscription.plan.price} / ${subscription.plan.billingCycle.toLowerCase()}`
                : "No active subscription"}
            </p>

          </div>


          {/* Subscription Status */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Subscription Status
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              {subscriptionStatus}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {subscription
                ? "Your subscription is active"
                : "Subscribe to a plan"}
            </p>

          </div>


          {/* Total Payments */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Payments
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              ₹{totalPayments.toLocaleString("en-IN")}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Successful payments
            </p>

          </div>


          {/* Pending Invoices */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Pending Invoices
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              {pendingInvoices}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Pending or overdue invoices
            </p>

          </div>

        </div>


        {/* ==================== QUICK ACTIONS ==================== */}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your subscription and billing.
          </p>


          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">


            {/* Browse Plans */}

            <button
              onClick={() => navigate("/customer/plans")}
              className="rounded-lg border border-gray-200 p-5 text-left transition hover:border-gray-400 hover:shadow-sm"
            >

              <div className="text-2xl">
                📦
              </div>

              <h4 className="mt-3 font-semibold text-gray-900">
                Browse Plans
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                View available subscription plans.
              </p>

            </button>


            {/* My Subscription */}

            <button
              onClick={() =>
                navigate("/customer/subscription")
              }
              className="rounded-lg border border-gray-200 p-5 text-left transition hover:border-gray-400 hover:shadow-sm"
            >

              <div className="text-2xl">
                🔄
              </div>

              <h4 className="mt-3 font-semibold text-gray-900">
                My Subscription
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your subscription.
              </p>

            </button>


            {/* Payment History */}

            <button
              onClick={() =>
                navigate("/customer/payments")
              }
              className="rounded-lg border border-gray-200 p-5 text-left transition hover:border-gray-400 hover:shadow-sm"
            >

              <div className="text-2xl">
                💳
              </div>

              <h4 className="mt-3 font-semibold text-gray-900">
                Payment History
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                View your previous payments.
              </p>

            </button>


            {/* Invoices */}

            <button
              onClick={() =>
                navigate("/customer/invoices")
              }
              className="rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:border-gray-400 hover:shadow-sm"
            >

              <div className="text-2xl">
                🧾
              </div>

              <h4 className="mt-3 font-semibold text-gray-900">
                My Invoices
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your invoices.
              </p>

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default CustomerDashboard;