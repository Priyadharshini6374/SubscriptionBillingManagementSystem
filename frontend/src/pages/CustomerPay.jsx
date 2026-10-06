import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/BackButton";
import CustomerLogoutButton from "../components/CustomerLogoutButton";

export default function CustomerPay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const customerUser = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  useEffect(() => {
    if (!customerUser) {
      navigate("/customer/login");
      return;
    }

    fetch(`http://localhost:5000/api/invoices/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch invoice");
        }

        return res.json();
      })
      .then((data) => {
        if (!data || !data.id) {
          alert("Invoice not found");
          navigate("/customer/invoices");
          return;
        }

        setInvoice(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to load invoice");
        navigate("/customer/invoices");
      });
  }, [id, navigate]);

  const handlePayment = async () => {
    if (!invoice) return;

    setPaying(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId: invoice.id,
            paymentMethod: paymentMethod,
            status: "SUCCESS",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Payment failed");
        setPaying(false);
        return;
      }

      alert(
        `Payment successful!\nTransaction ID: ${data.payment.transactionId}`
      );

      navigate("/customer/payments");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while processing payment");
    }

    setPaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-between items-center p-6">
          <BackButton />
          <CustomerLogoutButton />
        </div>

        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-6">
        <BackButton />
        <CustomerLogoutButton />
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h1 className="text-2xl font-bold text-gray-900">
            Make Payment
          </h1>

          <p className="text-gray-500 mt-1">
            Complete payment for your invoice
          </p>

          {/* Invoice Details */}
          <div className="mt-8 rounded-xl bg-gray-50 border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Invoice Details
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Invoice Number
                </span>

                <span className="font-medium text-gray-900">
                  {invoice.invoiceNumber || invoice.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Amount
                </span>

                <span className="font-medium text-gray-900">
                  ₹{Number(invoice.amount || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Tax
                </span>

                <span className="font-medium text-gray-900">
                  ₹{Number(invoice.tax || 0).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-800">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-green-600">
                  ₹{Number(invoice.totalAmount || 0).toFixed(2)}
                </span>
              </div>

            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-8">

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* UPI */}
              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  paymentMethod === "UPI"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      UPI
                    </p>

                    <p className="text-xs text-gray-500">
                      Google Pay, PhonePe, etc.
                    </p>
                  </div>

                </div>
              </label>

              {/* Card */}
              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  paymentMethod === "CARD"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Card
                    </p>

                    <p className="text-xs text-gray-500">
                      Credit or Debit Card
                    </p>
                  </div>

                </div>
              </label>

              {/* Net Banking */}
              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  paymentMethod === "NET_BANKING"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NET_BANKING"
                    checked={paymentMethod === "NET_BANKING"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Net Banking
                    </p>

                    <p className="text-xs text-gray-500">
                      Pay using your bank
                    </p>
                  </div>

                </div>
              </label>

              {/* Wallet */}
              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  paymentMethod === "WALLET"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WALLET"
                    checked={paymentMethod === "WALLET"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Wallet
                    </p>

                    <p className="text-xs text-gray-500">
                      Pay using digital wallet
                    </p>
                  </div>

                </div>
              </label>

            </div>
          </div>

          {/* Pay Button */}
          <div className="mt-8 border-t border-gray-200 pt-6">

            <button
              onClick={handlePayment}
              disabled={paying}
              className={`w-full rounded-lg px-6 py-3 text-sm font-semibold text-white ${
                paying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {paying
                ? "Processing Payment..."
                : `Pay ₹${Number(
                    invoice.totalAmount || 0
                  ).toFixed(2)}`}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}