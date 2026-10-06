import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function Settings() {
  const [formData, setFormData] = useState({
    companyName: "",
    supportEmail: "",
    currency: "INR",
    taxPercentage: "",
    invoicePrefix: "INV",
    timezone: "Asia/Kolkata",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/settings"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch settings"
        );
      }

      setFormData({
        companyName: data.companyName || "",
        supportEmail: data.supportEmail || "",
        currency: data.currency || "INR",
        taxPercentage: data.taxPercentage || "",
        invoicePrefix: data.invoicePrefix || "INV",
        timezone: data.timezone || "Asia/Kolkata",
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            taxPercentage: Number(formData.taxPercentage),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update settings"
        );
      }

      setMessage("Settings updated successfully.");

      setFormData({
        companyName: data.settings.companyName,
        supportEmail: data.settings.supportEmail,
        currency: data.settings.currency,
        taxPercentage: data.settings.taxPercentage,
        invoicePrefix: data.settings.invoicePrefix,
        timezone: data.settings.timezone,
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <BackButton />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your billing system configuration
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-gray-600">
                Loading settings...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* Company Settings */}
              <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Company Settings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Basic information about your billing platform
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Company Name
                    </label>

                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Support Email
                    </label>

                    <input
                      type="email"
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
                      placeholder="support@example.com"
                    />
                  </div>

                </div>
              </div>

              {/* Billing Settings */}
              <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Billing Settings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Configure currency, tax and invoice preferences
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Currency
                    </label>

                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
                    >
                      <option value="INR">
                        INR - Indian Rupee
                      </option>

                      <option value="USD">
                        USD - US Dollar
                      </option>

                      <option value="EUR">
                        EUR - Euro
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tax Percentage
                    </label>

                    <input
                      type="number"
                      name="taxPercentage"
                      value={formData.taxPercentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Invoice Prefix
                    </label>

                    <input
                      type="text"
                      name="invoicePrefix"
                      value={formData.invoicePrefix}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
                      placeholder="INV"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Timezone
                    </label>

                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
                    >
                      <option value="Asia/Kolkata">
                        Asia/Kolkata
                      </option>

                      <option value="UTC">
                        UTC
                      </option>

                      <option value="America/New_York">
                        America/New_York
                      </option>

                      <option value="Europe/London">
                        Europe/London
                      </option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Messages */}
              {message && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Save */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>
    </div>
  );
}

export default Settings;