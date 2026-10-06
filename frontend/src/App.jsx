import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Plans from "./pages/Plans";
import CreatePlan from "./pages/CreatePlan";
import EditPlan from "./pages/EditPlan";

import Customers from "./pages/Customers";
import CreateCustomer from "./pages/CreateCustomer";
import EditCustomer from "./pages/EditCustomer";
import CustomerDetails from "./pages/CustomerDetails";

import Subscriptions from "./pages/Subscriptions";
import CreateSubscription from "./pages/CreateSubscription";
import ChangePlan from "./pages/ChangePlan";
import CancelSubscription from "./pages/CancelSubscription";
import SubscriptionDetails from "./pages/SubscriptionDetails";

import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetails from "./pages/InvoiceDetails";

import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import PaymentDetails from "./pages/PaymentDetails";

import Coupons from "./pages/Coupons";
import CreateCoupon from "./pages/CreateCoupon";
import EditCoupon from "./pages/EditCoupon";
import CouponDetails from "./pages/CouponDetails";

import Analytics from "./pages/Analytics";

import Refunds from "./pages/Refunds";
import CreateRefund from "./pages/CreateRefund";
import RefundDetails from "./pages/RefundDetails";

import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";

import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerPlans from "./pages/CustomerPlans";
import CustomerSubscribe from "./pages/CustomerSubscribe";
import CustomerSubscription from "./pages/CustomerSubscription";
import CustomerChangePlan from "./pages/CustomerChangePlan";
import CustomerInvoices from "./pages/CustomerInvoices";
import CustomerInvoiceDetails from "./pages/CustomerInvoiceDetails";
import CustomerPayments from "./pages/CustomerPayments";
import CustomerPay from "./pages/CustomerPay";
import CustomerPaymentDetails from "./pages/CustomerPaymentDetails";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================== ADMIN LOGIN ==================== */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}

        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* Plans */}

          <Route
            path="/plans"
            element={<Plans />}
          />

          <Route
            path="/plans/create"
            element={<CreatePlan />}
          />

          <Route
            path="/plans/edit/:id"
            element={<EditPlan />}
          />


          {/* Customers */}

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/customers/create"
            element={<CreateCustomer />}
          />

          <Route
            path="/customers/edit/:id"
            element={<EditCustomer />}
          />

          <Route
            path="/customers/:id"
            element={<CustomerDetails />}
          />


          {/* Subscriptions */}

          <Route
            path="/subscriptions"
            element={<Subscriptions />}
          />

          <Route
            path="/subscriptions/create"
            element={<CreateSubscription />}
          />

          <Route
            path="/subscriptions/change-plan/:id"
            element={<ChangePlan />}
          />

          <Route
            path="/subscriptions/cancel/:id"
            element={<CancelSubscription />}
          />

          <Route
            path="/subscriptions/:id"
            element={<SubscriptionDetails />}
          />


          {/* Invoices */}

          <Route
            path="/invoices"
            element={<Invoices />}
          />

          <Route
            path="/invoices/create"
            element={<CreateInvoice />}
          />

          <Route
            path="/invoices/:id"
            element={<InvoiceDetails />}
          />


          {/* Payments */}

          <Route
            path="/payments"
            element={<Payments />}
          />

          <Route
            path="/payments/create"
            element={<CreatePayment />}
          />

          <Route
            path="/payments/:id"
            element={<PaymentDetails />}
          />


          {/* Coupons */}

          <Route
            path="/coupons"
            element={<Coupons />}
          />

          <Route
            path="/coupons/create"
            element={<CreateCoupon />}
          />

          <Route
            path="/coupons/edit/:id"
            element={<EditCoupon />}
          />

          <Route
            path="/coupons/:id"
            element={<CouponDetails />}
          />


          {/* Analytics */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />


          {/* Refunds */}

          <Route
            path="/refunds"
            element={<Refunds />}
          />

          <Route
            path="/refunds/create"
            element={<CreateRefund />}
          />

          <Route
            path="/refunds/:id"
            element={<RefundDetails />}
          />


          {/* Reports */}

          <Route
            path="/reports"
            element={<Reports />}
          />


          {/* Settings */}

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>


        {/* ==================== PROTECTED CUSTOMER ROUTES ==================== */}

<Route element={<CustomerProtectedRoute />}>
  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
  <Route path="/customer/subscription" element={<CustomerSubscription />} />
  <Route path="/customer/change-plan/:id" element={<CustomerChangePlan />} />
  <Route path="/customer/invoices" element={<CustomerInvoices />} />
  <Route path="/customer/invoices/:id" element={<CustomerInvoiceDetails />} />
  <Route path="/customer/payments" element={<CustomerPayments />} />
  <Route path="/customer/plans" element={<CustomerPlans />} />
  <Route path="/customer/subscribe/:id" element={<CustomerSubscribe />} />
  <Route path="/customer/pay/:id" element={<CustomerPay />} />
  <Route
  path="/customer/payments/:id"
  element={<CustomerPaymentDetails />}
/>
  <Route path="/customer/cancel-subscription/:id" element={<CancelSubscription />} />
</Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;