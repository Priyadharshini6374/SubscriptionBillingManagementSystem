import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/customers/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load customer.");
        return;
      }

      setCustomer(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
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
              Loading customer...
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
                Customer Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View customer information
              </p>
            </div>
          </div>

          {error && (
            <div className="max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!error && customer && (
            <div className="max-w-3xl">

              {/* Customer Profile */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

                <div className="flex items-center gap-5 border-b border-gray-200 pb-6">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-semibold text-white">
                    {customer.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {customer.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Customer ID: #{customer.id}
                    </p>
                  </div>

                  <span
                    className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${
                      customer.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {customer.status}
                  </span>

                </div>

                {/* Information */}
                <div className="mt-6 space-y-5">

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {customer.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {customer.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Role
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {customer.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Account Status
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {customer.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Joined Date
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        customer.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    type="button"
                    onClick={() => navigate("/customers")}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back to Customers
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/customers/edit/${customer.id}`)
                    }
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Edit Customer
                  </button>

                </div>

              </div>

              {/* Subscription Section */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-900">
                  Subscription
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Subscription details will appear here after the
                  subscription module is implemented.
                </p>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default CustomerDetails;