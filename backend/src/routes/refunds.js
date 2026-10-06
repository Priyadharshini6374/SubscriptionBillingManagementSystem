const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// Get all refunds
router.get("/", async (req, res) => {
  try {
    const refunds = await prisma.refund.findMany({
      orderBy: {
        refundDate: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            id: true,
            transactionId: true,
            amount: true,
            paymentMethod: true,
            status: true,
            invoice: {
              select: {
                invoiceNumber: true,
              },
            },
          },
        },
      },
    });

    res.json(refunds);
  } catch (error) {
    console.error("Get refunds error:", error);

    res.status(500).json({
      message: "Failed to fetch refunds",
    });
  }
});

// Get refund by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid refund ID",
      });
    }

    const refund = await prisma.refund.findUnique({
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
        payment: {
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
          },
        },
      },
    });

    if (!refund) {
      return res.status(404).json({
        message: "Refund not found",
      });
    }

    res.json(refund);
  } catch (error) {
    console.error("Get refund details error:", error);

    res.status(500).json({
      message: "Failed to fetch refund details",
    });
  }
});

// Create refund
router.post("/", async (req, res) => {
  try {
    const {
      paymentId,
      amount,
      reason,
    } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({
        message: "Payment ID and refund amount are required",
      });
    }

    const refundAmount = Number(amount);

    if (isNaN(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({
        message: "Refund amount must be greater than 0",
      });
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: Number(paymentId),
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (payment.status !== "SUCCESS") {
      return res.status(400).json({
        message: "Only successful payments can be refunded",
      });
    }

    const paymentAmount = Number(payment.amount);

    if (refundAmount > paymentAmount) {
      return res.status(400).json({
        message: "Refund amount cannot exceed payment amount",
      });
    }

    // Find previous refunds
    const previousRefunds = await prisma.refund.findMany({
      where: {
        paymentId: Number(paymentId),
        status: {
          in: ["PENDING", "PROCESSING", "COMPLETED"],
        },
      },
    });

    const alreadyRefunded = previousRefunds.reduce(
      (total, refund) => total + Number(refund.amount),
      0
    );

    if (alreadyRefunded + refundAmount > paymentAmount) {
      return res.status(400).json({
        message: "Total refund amount cannot exceed payment amount",
      });
    }

    // Create refund as PROCESSING
    const refund = await prisma.refund.create({
      data: {
        paymentId: Number(paymentId),
        userId: payment.userId,
        amount: refundAmount,
        reason: reason || null,
        status: "PROCESSING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            id: true,
            transactionId: true,
            amount: true,
            paymentMethod: true,
            status: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Refund request created successfully",
      refund,
    });
  } catch (error) {
    console.error("Create refund error:", error);

    res.status(500).json({
      message: "Failed to create refund",
    });
  }
});

// Update refund status
router.put("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid refund ID",
      });
    }

    if (!["COMPLETED", "FAILED"].includes(status)) {
      return res.status(400).json({
        message: "Status must be COMPLETED or FAILED",
      });
    }

    const refund = await prisma.refund.findUnique({
      where: {
        id,
      },
      include: {
        payment: true,
      },
    });

    if (!refund) {
      return res.status(404).json({
        message: "Refund not found",
      });
    }

    if (refund.status !== "PROCESSING") {
      return res.status(400).json({
        message: "Only processing refunds can be updated",
      });
    }

    const updatedRefund = await prisma.$transaction(async (tx) => {
      const updated = await tx.refund.update({
        where: {
          id,
        },
        data: {
          status,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payment: true,
        },
      });

      // If refund completed, check whether full payment was refunded
      if (status === "COMPLETED") {
        const completedRefunds = await tx.refund.findMany({
          where: {
            paymentId: refund.paymentId,
            status: "COMPLETED",
          },
        });

        const totalRefunded = completedRefunds.reduce(
          (total, item) => total + Number(item.amount),
          0
        );

        const paymentAmount = Number(refund.payment.amount);

        if (totalRefunded >= paymentAmount) {
          await tx.payment.update({
            where: {
              id: refund.paymentId,
            },
            data: {
              status: "REFUNDED",
            },
          });
        }
      }

      return updated;
    });

    res.json({
      message:
        status === "COMPLETED"
          ? "Refund completed successfully"
          : "Refund marked as failed",
      refund: updatedRefund,
    });
  } catch (error) {
    console.error("Update refund status error:", error);

    res.status(500).json({
      message: "Failed to update refund status",
    });
  }
});

module.exports = router;