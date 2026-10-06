import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BackButton from "../components/BackButton";

function CreatePayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceIdFromUrl = searchParams.get("invoiceId");

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(
    invoiceIdFromUrl || ""
  );

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentStatus, setPaymentStatus] = useState("SUCCESS");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/invoices"
      );

      const data = await response.json();

      // Only unpaid invoices can be paid
      const pendingInvoices = data.filter(
        (invoice) =>
          invoice.status === "PENDING" ||
          invoice.status === "OVERDUE"
      );

      setInvoices(pendingInvoices);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedInvoiceData = invoices.find(
    (invoice) =>
      invoice.id === Number(selectedInvoice)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedInvoice) {
      alert("Please select an invoice");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId: Number(selectedInvoice),
            paymentMethod,
            status: paymentStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Payment failed");
        return;
      }

      alert(data.message);

      navigate("/payments");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-16">
        <div className="p-8">

          <div className="mb-6">
            <BackButton />

            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              Record Payment
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Record a simulated payment for an invoice
            </p>
          </div>

          <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            {loading ? (
              <p className="text-center text-gray-500">
                Loading invoices...
              </p>
            ) : invoices.length === 0 ? (
              <div className="py-8 text-center">

                <div className="mb-4 text-5xl">
                  🧾
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  No pending invoices
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Create a pending invoice before recording a payment.
                </p>

                <button
                  onClick={() => navigate("/invoices")}
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Go to Invoices
                </button>

              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* Invoice */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Invoice
                  </label>

                  <select
                    value={selectedInvoice}
                    onChange={(e) =>
                      setSelectedInvoice(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  >
                    <option value="">
                      Select an invoice
                    </option>

                    {invoices.map((invoice) => (
                      <option
                        key={invoice.id}
                        value={invoice.id}
                      >
                        {invoice.invoiceNumber} -{" "}
                        {invoice.user?.name} - ₹
                        {Number(invoice.totalAmount).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Information */}
                {selectedInvoiceData && (
                  <div className="rounded-lg bg-gray-50 p-5">

                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                      Invoice Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <p className="text-xs text-gray-500">
                          Customer
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {selectedInvoiceData.user?.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Invoice
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {selectedInvoiceData.invoiceNumber}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Amount
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          ₹
                          {Number(
                            selectedInvoiceData.totalAmount
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Invoice Status
                        </p>

                        <p className="mt-1 text-sm font-medium text-yellow-600">
                          {selectedInvoiceData.status}
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  >
                    <option value="UPI">
                      UPI
                    </option>

                    <option value="CARD">
                      Card
                    </option>

                    <option value="NET_BANKING">
                      Net Banking
                    </option>

                    <option value="WALLET">
                      Wallet
                    </option>
                  </select>
                </div>

                {/* Simulation Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Simulated Payment Result
                  </label>

                  <select
                    value={paymentStatus}
                    onChange={(e) =>
                      setPaymentStatus(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  >
                    <option value="SUCCESS">
                      Successful Payment
                    </option>

                    <option value="FAILED">
                      Failed Payment
                    </option>
                  </select>

                  <p className="mt-2 text-xs text-gray-500">
                    This is a simulated payment. No real money will be charged.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                  <button
                    type="button"
                    onClick={() => navigate("/payments")}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Processing..."
                      : "Record Payment"}
                  </button>

                </div>

              </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePayment;