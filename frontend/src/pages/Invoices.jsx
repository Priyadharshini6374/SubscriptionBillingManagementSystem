import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/invoices`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load invoices."
        );
      }

      setInvoices(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "OVERDUE":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      case "DRAFT":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
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
                  Invoices
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage customer invoices and billing records
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/invoices/create")
              }
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Create Invoice
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading invoices...
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

              {invoices.length === 0 ? (
                <div className="px-6 py-16 text-center">

                  <div className="text-4xl">
                    🧾
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-gray-900">
                    No invoices yet
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Create your first invoice to start
                    tracking customer billing.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/invoices/create")
                    }
                    className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Create Invoice
                  </button>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="border-b border-gray-200 bg-gray-50">

                      <tr>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Invoice
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Plan
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Issue Date
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {invoices.map((invoice) => (

                        <tr
                          key={invoice.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >

                          <td className="px-6 py-4">

                            <p className="text-sm font-semibold text-gray-900">
                              {invoice.invoiceNumber}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID #{invoice.id}
                            </p>

                          </td>

                          <td className="px-6 py-4">

                            <p className="text-sm font-medium text-gray-900">
                              {invoice.user?.name || "-"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {invoice.user?.email || "-"}
                            </p>

                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {invoice.subscription?.plan?.name || "-"}
                          </td>

                          <td className="px-6 py-4">

                            <p className="text-sm font-semibold text-gray-900">
                              ₹{invoice.totalAmount.toString()}
                            </p>

                            {Number(invoice.tax) > 0 && (
                              <p className="text-xs text-gray-500">
                                Tax: ₹{invoice.tax.toString()}
                              </p>
                            )}

                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                invoice.status
                              )}`}
                            >
                              {invoice.status}
                            </span>

                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(invoice.issueDate)}
                          </td>

                          <td className="px-6 py-4">

                            <button
                              onClick={() =>
                                navigate(
                                  `/invoices/${invoice.id}`
                                )
                              }
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Invoices;