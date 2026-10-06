import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    recentPayments: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      setDashboard(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Overview of your subscription billing system
              </p>
            </div>

            <BackButton />
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                Loading dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    ₹{dashboard.totalRevenue.toLocaleString("en-IN")}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    From successful payments
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Active Subscriptions
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    {dashboard.activeSubscriptions}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    Active and trial subscriptions
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Total Customers
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    {dashboard.totalCustomers}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    Registered customers
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Total Invoices
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    {dashboard.totalInvoices}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    All generated invoices
                  </p>
                </div>

              </div>

              <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Payments
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Latest successful payment transactions
                  </p>
                </div>

                {dashboard.recentPayments.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">
                    No successful payments yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 font-medium text-gray-600">
                            Transaction
                          </th>

                          <th className="px-6 py-4 font-medium text-gray-600">
                            Customer
                          </th>

                          <th className="px-6 py-4 font-medium text-gray-600">
                            Invoice
                          </th>

                          <th className="px-6 py-4 font-medium text-gray-600">
                            Amount
                          </th>

                          <th className="px-6 py-4 font-medium text-gray-600">
                            Date
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {dashboard.recentPayments.map((payment) => (
                          <tr
                            key={payment.id}
                            className="border-b border-gray-100 last:border-b-0"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {payment.transactionId}
                            </td>

                            <td className="px-6 py-4 text-gray-700">
                              {payment.user?.name || "-"}
                            </td>

                            <td className="px-6 py-4 text-gray-700">
                              {payment.invoice?.invoiceNumber || "-"}
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                              ₹
                              {Number(payment.amount).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td className="px-6 py-4 text-gray-500">
                              {new Date(
                                payment.paymentDate
                              ).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;