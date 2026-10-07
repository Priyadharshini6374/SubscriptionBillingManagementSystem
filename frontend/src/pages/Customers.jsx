import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/customers`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
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
                  Customers
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your customers
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/customers/create")}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Add Customer
            </button>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Loading customers...
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
                onClick={fetchCustomers}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && customers.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <div className="text-4xl">
                👥
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                No customers yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add your first customer to get started.
              </p>

              <button
                onClick={() => navigate("/customers/create")}
                className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Add Customer
              </button>
            </div>
          )}

          {/* Customer Table */}
          {!loading && !error && customers.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Email
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                              {customer.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                ID: #{customer.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {customer.email}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              customer.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(
                            customer.createdAt
                          ).toLocaleDateString()}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(
                                `/customers/${customer.id}`
                              )
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Customers;