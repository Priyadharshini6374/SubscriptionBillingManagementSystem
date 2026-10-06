const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const customer = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ["ACTIVE", "TRIAL"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: true,
      },
    });

    const payments = await prisma.payment.findMany({
      where: {
        userId,
        status: "SUCCESS",
      },
      select: {
        amount: true,
      },
    });

    const pendingInvoices = await prisma.invoice.count({
      where: {
        userId,
        status: {
          in: ["PENDING", "OVERDUE"],
        },
      },
    });

    const totalPayments = payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    res.json({
      customer,

      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            nextBillingDate: subscription.nextBillingDate,
            plan: {
              id: subscription.plan.id,
              name: subscription.plan.name,
              price: Number(subscription.plan.price),
              billingCycle: subscription.plan.billingCycle,
            },
          }
        : null,

      totalPayments,

      pendingInvoices,
    });
  } catch (error) {
    console.error("Customer dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch customer dashboard",
    });
  }
});

module.exports = router;