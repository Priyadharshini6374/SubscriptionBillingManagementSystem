import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Payment not found");
        navigate("/payments");
        return;
      }

      setPayment(data);
    } catch (error) {
      console.error("Failed to fetch payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "SUCCESS") {
      return "bg-green-100 text-green-700";
    }

    if (status === "FAILED") {
      return "bg-red-100 text-red-700";
    }

    if (status === "REFUNDED") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />

        <main className="ml-64 pt-16">
          <div className="p-8 text-center text-gray-500">
            Loading payment...
          </div>
        </main>
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          {/* Header */}
          <div className="mb-6">
            <BackButton />

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Payment Details
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Transaction information and payment status
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                  payment.status
                )}`}
              >
                {payment.status}
              </span>
            </div>
          </div>

          {/* Main Details */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Payment Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Payment Information
              </h2>

              <div className="space-y-5">

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Transaction ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {payment.transactionId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {payment.paymentMethod?.replace(
                      "_",
                      " "
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    ₹{Number(payment.amount).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Payment Date
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {new Date(
                      payment.paymentDate
                    ).toLocaleString()}
                  </p>
                </div>

              </div>
            </div>


            {/* Customer Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Customer Information
              </h2>

              <div className="space-y-5">

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {payment.user?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {payment.user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Invoice
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/invoices/${payment.invoice?.id}`
                      )
                    }
                    className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {payment.invoice?.invoiceNumber}
                  </button>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Invoice Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    ₹
                    {Number(
                      payment.invoice?.totalAmount
                    ).toFixed(2)}
                  </p>
                </div>

              </div>
            </div>

          </div>


          {/* Subscription Information */}
          {payment.invoice?.subscription && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Subscription Information
              </h2>

              <div className="grid gap-6 md:grid-cols-3">

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Subscription ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    #{payment.invoice.subscription.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Plan
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {payment.invoice.subscription.plan?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Subscription Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {payment.invoice.subscription.status}
                  </p>
                </div>

              </div>

            </div>
          )}


          {/* Refund History */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              Refund History
            </h2>

            {payment.refunds?.length === 0 ? (
              <p className="text-sm text-gray-500">
                No refunds recorded for this payment.
              </p>
            ) : (
              <div className="space-y-3">

                {payment.refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex justify-between">

                      <span className="text-sm font-medium text-gray-800">
                        ₹{Number(refund.amount).toFixed(2)}
                      </span>

                      <span className="text-xs font-semibold text-gray-600">
                        {refund.status}
                      </span>

                    </div>

                    {refund.reason && (
                      <p className="mt-1 text-xs text-gray-500">
                        {refund.reason}
                      </p>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default PaymentDetails;