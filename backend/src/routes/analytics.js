const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Total revenue from successful payments
    const successfulPayments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
      },
      select: {
        amount: true,
        paymentDate: true,
        invoice: {
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalRevenue = successfulPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    // Successful payment count
    const successfulPaymentCount = successfulPayments.length;

    // Monthly revenue
    const monthlyRevenueMap = {};

    successfulPayments.forEach((payment) => {
      const date = new Date(payment.paymentDate);

      const month = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyRevenueMap[month]) {
        monthlyRevenueMap[month] = 0;
      }

      monthlyRevenueMap[month] += Number(payment.amount);
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(
      ([month, revenue]) => ({
        month,
        revenue,
      })
    );

    // Revenue by plan
    const revenueByPlanMap = {};

    successfulPayments.forEach((payment) => {
      const planName =
        payment.invoice?.subscription?.plan?.name || "Unknown";

      if (!revenueByPlanMap[planName]) {
        revenueByPlanMap[planName] = 0;
      }

      revenueByPlanMap[planName] += Number(payment.amount);
    });

    const revenueByPlan = Object.entries(revenueByPlanMap).map(
      ([plan, revenue]) => ({
        plan,
        revenue,
      })
    );

    // Plans sold
    const subscriptions = await prisma.subscription.findMany({
      include: {
        plan: true,
      },
    });

    const plansSoldMap = {};

    subscriptions.forEach((subscription) => {
      const planName = subscription.plan?.name || "Unknown";

      if (!plansSoldMap[planName]) {
        plansSoldMap[planName] = 0;
      }

      plansSoldMap[planName] += 1;
    });

    const plansSold = Object.entries(plansSoldMap)
      .map(([plan, sold]) => ({
        plan,
        sold,
      }))
      .sort((a, b) => b.sold - a.sold);

    // Current active subscriptions
    // Includes both ACTIVE and TRIAL subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: {
          in: ["ACTIVE", "TRIAL"],
        },
      },
      include: {
        plan: true,
      },
    });

    const activeSubscriptionsMap = {};

    activeSubscriptions.forEach((subscription) => {
      const planName = subscription.plan?.name || "Unknown";

      if (!activeSubscriptionsMap[planName]) {
        activeSubscriptionsMap[planName] = 0;
      }

      activeSubscriptionsMap[planName] += 1;
    });

    const activeSubscriptionsByPlan = Object.entries(
      activeSubscriptionsMap
    )
      .map(([plan, active]) => ({
        plan,
        active,
      }))
      .sort((a, b) => b.active - a.active);

    // Send analytics data
    res.json({
      totalRevenue,
      successfulPaymentCount,
      monthlyRevenue,
      revenueByPlan,
      plansSold,
      activeSubscriptions: activeSubscriptionsByPlan,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch analytics data",
    });
  }
});

module.exports = router;