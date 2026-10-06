const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// GET all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: {
        issueDate: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.json(invoices);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch invoices",
    });
  }
});

// GET invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch invoice",
    });
  }
});

// CREATE invoice
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      subscriptionId,
      amount,
      tax = 0,
    } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        message: "Customer and amount are required",
      });
    }

    const customer = await prisma.user.findFirst({
      where: {
        id: Number(userId),
        role: "CUSTOMER",
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (subscriptionId) {
      const subscription =
        await prisma.subscription.findUnique({
          where: {
            id: Number(subscriptionId),
          },
        });

      if (!subscription) {
        return res.status(404).json({
          message: "Subscription not found",
        });
      }
    }

    const invoiceNumber =
      `INV-${Date.now()}`;

    const totalAmount =
      Number(amount) + Number(tax);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: Number(userId),
        subscriptionId: subscriptionId
          ? Number(subscriptionId)
          : null,
        amount: Number(amount),
        tax: Number(tax),
        totalAmount,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create invoice",
    });
  }
});

module.exports = router;