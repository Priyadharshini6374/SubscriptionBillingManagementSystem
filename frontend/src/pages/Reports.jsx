import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";
import API_URL from "../api";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/reports`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reports"
        );
      }

      setReport(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8">
            <p className="text-gray-600">
              Loading reports...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8">
            <BackButton />

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="font-medium text-red-700">
                {error}
              </p>

              <button
                onClick={fetchReports}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const {
    summary,
    paymentStatusSummary,
    refundStatusSummary,
    planSales,
    recentPayments,
    recentRefunds,
  } = report;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Reports
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Business and financial reports
                </p>
              </div>
            </div>

            <button
              onClick={fetchReports}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Revenue Summary */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Revenue Summary
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ₹{Number(summary.totalRevenue).toFixed(2)}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  From successful payments
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Refunds
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ₹{Number(summary.totalRefunds).toFixed(2)}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Completed refunds
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Net Revenue
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ₹{Number(summary.netRevenue).toFixed(2)}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Revenue after refunds
                </p>
              </div>

            </div>
          </section>

          {/* Business Summary */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Business Summary
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Payments
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {summary.totalPayments}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Subscriptions
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {summary.totalSubscriptions}
                </p>
              </div>

            </div>
          </section>

          {/* Plan Sales */}
          <section className="mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Plan Sales Report
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Number of subscriptions sold for each plan
                </p>
              </div>

              {planSales.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No plan sales available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-6 py-4 font-semibold">
                          Rank
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Plan
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Subscriptions Sold
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {planSales.map((item, index) => (
                        <tr
                          key={item.plan}
                          className="border-t border-gray-100"
                        >
                          <td className="px-6 py-4 font-medium text-gray-700">
                            #{index + 1}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-900">
                            {item.plan}
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {item.sold}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </section>

          {/* Payment & Refund Status */}
          <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                Payment Report
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">
                    Successful Payments
                  </span>

                  <span className="font-semibold text-gray-900">
                    {paymentStatusSummary.successful}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">
                    Failed Payments
                  </span>

                  <span className="font-semibold text-gray-900">
                    {paymentStatusSummary.failed}
                  </span>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                Refund Report
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">
                    Processing
                  </span>

                  <span className="font-semibold text-gray-900">
                    {refundStatusSummary.processing}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">
                    Completed
                  </span>

                  <span className="font-semibold text-gray-900">
                    {refundStatusSummary.completed}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">
                    Failed
                  </span>

                  <span className="font-semibold text-gray-900">
                    {refundStatusSummary.failed}
                  </span>
                </div>

              </div>
            </div>

          </section>

          {/* Recent Payments */}
          <section className="mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Payments
                </h2>
              </div>

              {recentPayments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No successful payments found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">

                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-6 py-4 font-semibold">
                          Customer
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Transaction
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Plan
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Amount
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {payment.user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {payment.user?.email}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {payment.transactionId}
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {payment.invoice?.subscription?.plan?.name ||
                              "N/A"}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-900">
                            ₹{Number(payment.amount).toFixed(2)}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {new Date(
                              payment.paymentDate
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </section>

          {/* Recent Refunds */}
          <section>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Refunds
                </h2>
              </div>

              {recentRefunds.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No refunds found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">

                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-6 py-4 font-semibold">
                          Customer
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Transaction
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Amount
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Status
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentRefunds.map((refund) => (
                        <tr
                          key={refund.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {refund.user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {refund.user?.email}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {refund.payment?.transactionId}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-900">
                            ₹{Number(refund.amount).toFixed(2)}
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {refund.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {new Date(
                              refund.refundDate
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Reports;