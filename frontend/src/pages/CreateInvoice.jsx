import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function CreateInvoice() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    subscriptionId: "",
    amount: "",
    tax: "0",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [customersResponse, subscriptionsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/customers`),
          fetch(`${API_URL}/api/subscriptions`),
        ]);

      const customersData =
        await customersResponse.json();

      const subscriptionsData =
        await subscriptionsResponse.json();

      if (!customersResponse.ok) {
        throw new Error(
          customersData.message ||
            "Failed to load customers."
        );
      }

      if (!subscriptionsResponse.ok) {
        throw new Error(
          subscriptionsData.message ||
            "Failed to load subscriptions."
        );
      }

      setCustomers(customersData);
      setSubscriptions(subscriptionsData);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load invoice data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // When customer changes, clear subscription
    if (name === "userId") {
      setFormData((previous) => ({
        ...previous,
        userId: value,
        subscriptionId: "",
        amount: "",
      }));
    }
  };

  const customerSubscriptions =
    subscriptions.filter(
      (subscription) =>
        String(subscription.userId) ===
          formData.userId &&
        (
          subscription.status === "ACTIVE" ||
          subscription.status === "TRIAL"
        )
    );

  const selectedSubscription =
    subscriptions.find(
      (subscription) =>
        String(subscription.id) ===
        formData.subscriptionId
    );

  const handleSubscriptionChange = (e) => {
    const subscriptionId = e.target.value;

    const subscription = subscriptions.find(
      (item) =>
        String(item.id) === subscriptionId
    );

    setFormData((previous) => ({
      ...previous,
      subscriptionId,
      amount: subscription
        ? subscription.plan.price.toString()
        : "",
    }));
  };

  const totalAmount =
    Number(formData.amount || 0) +
    Number(formData.tax || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.userId) {
      setError("Please select a customer.");
      return;
    }

    if (!formData.amount) {
      setError("Please enter an invoice amount.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/invoices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(formData.userId),
            subscriptionId: formData.subscriptionId
              ? Number(formData.subscriptionId)
              : null,
            amount: Number(formData.amount),
            tax: Number(formData.tax || 0),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create invoice."
        );
        return;
      }

      alert("Invoice created successfully!");

      navigate("/invoices");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };

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
                Create Invoice
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Generate a billing invoice for a customer
              </p>
            </div>
          </div>

          {loading && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading customers and subscriptions...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mb-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

              <form onSubmit={handleSubmit}>

                {/* Customer */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Customer *
                  </label>

                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="">
                      Select a customer
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name} — {customer.email}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Subscription */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subscription
                  </label>

                  <select
                    name="subscriptionId"
                    value={formData.subscriptionId}
                    onChange={handleSubscriptionChange}
                    disabled={!formData.userId}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none disabled:bg-gray-100"
                  >
                    <option value="">
                      Select a subscription
                    </option>

                    {customerSubscriptions.map(
                      (subscription) => (
                        <option
                          key={subscription.id}
                          value={subscription.id}
                        >
                          #{subscription.id} —{" "}
                          {subscription.plan.name}
                        </option>
                      )
                    )}
                  </select>

                  {formData.userId &&
                    customerSubscriptions.length === 0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        This customer has no active subscription.
                      </p>
                    )}

                </div>

                {/* Selected subscription */}
                {selectedSubscription && (
                  <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">

                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Subscription
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedSubscription.plan.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹
                      {selectedSubscription.plan.price.toString()}{" "}
                      /{" "}
                      {selectedSubscription.plan.billingCycle.toLowerCase()}
                    </p>

                  </div>
                )}

                {/* Amount */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount *
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter invoice amount"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />

                </div>

                {/* Tax */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tax
                  </label>

                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter tax amount"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />

                </div>

                {/* Total */}
                <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-gray-600">
                      Total Amount
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      ₹{totalAmount.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/invoices")
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
                      ? "Creating..."
                      : "Create Invoice"}
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

export default CreateInvoice;