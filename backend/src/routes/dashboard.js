const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    });

    const activeSubscriptions = await prisma.subscription.count({
      where: {
        status: {
          in: ["ACTIVE", "TRIAL"],
        },
      },
    });

    const totalInvoices = await prisma.invoice.count();

    const successfulPayments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
      },
      select: {
        amount: true,
      },
    });

    const totalRevenue = successfulPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    const recentPayments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
      },
      orderBy: {
        paymentDate: "desc",
      },
      take: 5,
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
          },
        },
      },
    });

    res.json({
      totalCustomers,
      activeSubscriptions,
      totalInvoices,
      totalRevenue,
      recentPayments,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard data",
    });
  }
});

module.exports = router;