import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function CreatePlan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billingCycle: "Monthly",
    trialPeriod: "0",
    features: "",
    maxUsers: "",
    storage: "",
    status: "Active",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Plan name is required.");
      return;
    }

    if (!formData.price) {
      setError("Price is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          billingCycle: formData.billingCycle.toUpperCase(),
          trialPeriod: Number(formData.trialPeriod) || 0,

          features: formData.features
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean),

          maximumUsers: formData.maxUsers
            ? Number(formData.maxUsers)
            : null,

          storageLimit: formData.storage
            ? Number(formData.storage)
            : null,

          status: formData.status.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create plan.");
        return;
      }

      alert("Plan created successfully!");

      navigate("/plans");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
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
                Create Plan
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a new subscription plan
              </p>
            </div>
          </div>

          <div className="max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Plan Name */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Plan Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Pro"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter plan description"
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

              {/* Price and Billing Cycle */}
              <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="799"
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Billing Cycle *
                  </label>

                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

              </div>

              {/* Trial Period */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Trial Period (Days)
                </label>

                <input
                  type="number"
                  name="trialPeriod"
                  value={formData.trialPeriod}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>

              {/* Features */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Features
                </label>

                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="5 Projects, Basic Support, Email Support"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate features using commas.
                </p>
              </div>

              {/* Users and Storage */}
              <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maximum Users
                  </label>

                  <input
                    type="number"
                    name="maxUsers"
                    value={formData.maxUsers}
                    onChange={handleChange}
                    placeholder="25"
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Storage Limit (GB)
                  </label>

                  <input
                    type="number"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    placeholder="50"
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

              </div>

              {/* Status */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                <button
                  type="button"
                  onClick={() => navigate("/plans")}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Plan
                </button>

              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePlan;