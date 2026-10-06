const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();


// GET all payments
// If userId is provided, return only that customer's payments
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const whereCondition = userId
      ? {
          userId: Number(userId),
        }
      : {};

    const payments = await prisma.payment.findMany({
      where: whereCondition,

      orderBy: {
        paymentDate: "desc",
      },

      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(payments);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
});


// GET payment by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { userId } = req.query;

    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },

      include: {
        invoice: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        refunds: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Check payment ownership when userId is provided
    if (userId && payment.userId !== Number(userId)) {
      return res.status(403).json({
        message: "You are not authorized to view this payment",
      });
    }

    res.json(payment);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payment",
    });
  }
});


// CREATE / RECORD PAYMENT
router.post("/", async (req, res) => {
  try {
    const {
      invoiceId,
      paymentMethod,
      status = "SUCCESS",
    } = req.body;

    if (!invoiceId || !paymentMethod) {
      return res.status(400).json({
        message: "Invoice and payment method are required",
      });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: Number(invoiceId),
      },
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    if (invoice.status === "PAID") {
      return res.status(400).json({
        message: "Invoice is already paid",
      });
    }

    if (invoice.status === "CANCELLED") {
      return res.status(400).json({
        message: "Cancelled invoice cannot be paid",
      });
    }

    const validMethods = [
      "UPI",
      "CARD",
      "NET_BANKING",
      "WALLET",
    ];

    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const validStatuses = [
      "SUCCESS",
      "FAILED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const transactionId = `TXN-${Date.now()}`;

    const result = await prisma.$transaction(async (tx) => {

      const payment = await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          userId: invoice.userId,
          amount: invoice.totalAmount,
          paymentMethod,
          transactionId,
          status,
        },
      });

      if (status === "SUCCESS") {
        await tx.invoice.update({
          where: {
            id: invoice.id,
          },

          data: {
            status: "PAID",
          },
        });
      }

      return payment;
    });

    res.status(201).json({
      message:
        status === "SUCCESS"
          ? "Payment recorded successfully"
          : "Payment failed",

      payment: result,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to record payment",
    });
  }
});


module.exports = router;