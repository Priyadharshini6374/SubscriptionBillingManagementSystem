const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Subscription Billing Backend is running",
  });
});

// Routes
const dashboardRouter = require("./src/routes/dashboard");
const plansRouter = require("./src/routes/plans");
const customersRouter = require("./src/routes/customers");
const subscriptionsRouter = require("./src/routes/subscriptions");
const invoicesRouter = require("./src/routes/invoices");
const paymentsRouter = require("./src/routes/payments");
const couponsRouter = require("./src/routes/coupons");
const analyticsRouter = require("./src/routes/analytics");
const refundsRouter = require("./src/routes/refunds");
const reportsRouter = require("./src/routes/reports");
const settingsRouter = require("./src/routes/settings");
const authRouter = require("./src/routes/auth");
const customerDashboardRouter = require("./src/routes/customerDashboard");

app.use("/api/dashboard", dashboardRouter);
app.use("/api/plans", plansRouter);
app.use("/api/customers", customersRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/refunds", refundsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/auth", authRouter);
app.use(
  "/api/customer-dashboard",
  customerDashboardRouter
);

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});