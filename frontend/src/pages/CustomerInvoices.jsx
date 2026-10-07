import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../api";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";

function CustomerInvoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (!customerUser?.id) {
          setError("Customer information not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/invoices?userId=${customerUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load invoices."
          );
        }

        setInvoices(data);
      } catch (err) {
        console.error("Invoice error:", err);
        setError(err.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [customerUser?.id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Invoices
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your billing invoices
          </p>
        </div>

        <CustomerLogoutButton />
      </header>

      <main className="p-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && invoices.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Invoices Found
            </h2>

            <p className="mt-2 text-gray-500">
              You currently do not have any invoices.
            </p>
          </div>
        )}

        {!error && invoices.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Invoice
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Date
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
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {invoice.invoiceNumber || `#${invoice.id}`}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        ₹
                        {Number(
                          invoice.totalAmount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {invoice.status || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(invoice.issueDate)}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/customer/invoices/${invoice.id}`
                            )
                          }
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
      </main>
    </div>
  );
}

export default CustomerInvoices;
