const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const paymentWhere = {
      status: "SUCCESS",
    };

    const refundWhere = {};

    if (startDate || endDate) {
      const dateFilter = {};

      if (startDate) {
        dateFilter.gte = new Date(`${startDate}T00:00:00`);
      }

      if (endDate) {
        dateFilter.lte = new Date(`${endDate}T23:59:59`);
      }

      paymentWhere.paymentDate = dateFilter;
      refundWhere.refundDate = dateFilter;
    }

    // Successful payments
    const payments = await prisma.payment.findMany({
      where: paymentWhere,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        invoice: {
          select: {
            invoiceNumber: true,
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    // Refunds
    const refunds = await prisma.refund.findMany({
      where: refundWhere,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            transactionId: true,
          },
        },
      },
      orderBy: {
        refundDate: "desc",
      },
    });

    // Subscription count
    const subscriptionWhere = {};

    if (startDate || endDate) {
      const dateFilter = {};

      if (startDate) {
        dateFilter.gte = new Date(`${startDate}T00:00:00`);
      }

      if (endDate) {
        dateFilter.lte = new Date(`${endDate}T23:59:59`);
      }

      subscriptionWhere.createdAt = dateFilter;
    }

    const subscriptions = await prisma.subscription.findMany({
      where: subscriptionWhere,
      include: {
        plan: true,
      },
    });

    // Revenue
    const totalRevenue = payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    // Refund amount
    const totalRefunds = refunds
      .filter((refund) => refund.status === "COMPLETED")
      .reduce(
        (total, refund) => total + Number(refund.amount),
        0
      );

    // Net revenue
    const netRevenue = totalRevenue - totalRefunds;

    // Plan sales
    const planSalesMap = {};

    subscriptions.forEach((subscription) => {
      const planName = subscription.plan?.name || "Unknown";

      if (!planSalesMap[planName]) {
        planSalesMap[planName] = 0;
      }

      planSalesMap[planName]++;
    });

    const planSales = Object.entries(planSalesMap)
      .map(([plan, sold]) => ({
        plan,
        sold,
      }))
      .sort((a, b) => b.sold - a.sold);

    // Payment status summary
    const paymentStatusSummary = {
      successful: payments.length,
      failed: await prisma.payment.count({
        where: {
          status: "FAILED",
        },
      }),
    };

    // Refund status summary
    const refundStatusSummary = {
      processing: refunds.filter(
        (refund) => refund.status === "PROCESSING"
      ).length,

      completed: refunds.filter(
        (refund) => refund.status === "COMPLETED"
      ).length,

      failed: refunds.filter(
        (refund) => refund.status === "FAILED"
      ).length,
    };

    res.json({
      summary: {
        totalRevenue,
        totalRefunds,
        netRevenue,
        totalPayments: payments.length,
        totalSubscriptions: subscriptions.length,
      },

      paymentStatusSummary,

      refundStatusSummary,

      planSales,

      recentPayments: payments.slice(0, 10),

      recentRefunds: refunds.slice(0, 10),
    });
  } catch (error) {
    console.error("Reports error:", error);

    res.status(500).json({
      message: "Failed to generate reports",
    });
  }
});

module.exports = router;