const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            billingCycle: true,
          },
        },
      },
    });

    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch subscriptions",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const subscription = await prisma.subscription.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: true,
        invoices: true,
        subscriptionCoupons: {
          include: {
            coupon: true,
          },
        },
      },
    });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch subscription",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const planId = req.body.planId;
    const couponId = req.body.couponId;

    if (!userId || !planId) {
      return res.status(400).json({
        message: "Customer and plan are required",
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

    if (customer.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Customer account is not active",
      });
    }

    const plan = await prisma.plan.findFirst({
      where: {
        id: Number(planId),
        status: "ACTIVE",
      },
    });

    if (!plan) {
      return res.status(404).json({
        message: "Active plan not found",
      });
    }

    const existingSubscription =
      await prisma.subscription.findFirst({
        where: {
          userId: Number(userId),
          status: {
            in: ["TRIAL", "ACTIVE"],
          },
        },
      });

    if (existingSubscription) {
      return res.status(409).json({
        message: "Customer already has an active subscription",
      });
    }

    let coupon = null;
    let discountAmount = 0;
    let finalAmount = Number(plan.price);

    if (couponId) {
      coupon = await prisma.coupon.findUnique({
        where: {
          id: Number(couponId),
        },
      });

      if (!coupon) {
        return res.status(404).json({
          message: "Coupon not found",
        });
      }

      if (coupon.status !== "ACTIVE") {
        return res.status(400).json({
          message: "Coupon is not active",
        });
      }

      if (
        coupon.expiresAt &&
        new Date(coupon.expiresAt) < new Date()
      ) {
        return res.status(400).json({
          message: "Coupon has expired",
        });
      }

      if (
        coupon.maxUses !== null &&
        coupon.usedCount >= coupon.maxUses
      ) {
        return res.status(400).json({
          message: "Coupon usage limit reached",
        });
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount =
          (Number(plan.price) *
            Number(coupon.discountValue)) /
          100;
      }

      if (coupon.discountType === "FIXED") {
        discountAmount = Number(coupon.discountValue);
      }

      discountAmount = Math.min(
        discountAmount,
        Number(plan.price)
      );

      finalAmount =
        Number(plan.price) - discountAmount;
    }

    const startDate = new Date();
    const nextBillingDate = new Date(startDate);

    if (plan.billingCycle === "MONTHLY") {
      nextBillingDate.setMonth(
        nextBillingDate.getMonth() + 1
      );
    }

    if (plan.billingCycle === "QUARTERLY") {
      nextBillingDate.setMonth(
        nextBillingDate.getMonth() + 3
      );
    }

    if (plan.billingCycle === "YEARLY") {
      nextBillingDate.setFullYear(
        nextBillingDate.getFullYear() + 1
      );
    }

    let status = "ACTIVE";
    let endDate = null;

    if (plan.trialPeriod > 0) {
      status = "TRIAL";

      endDate = new Date(startDate);

      endDate.setDate(
        endDate.getDate() + plan.trialPeriod
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.create({
        data: {
          userId: Number(userId),
          planId: Number(planId),
          status: status,
          startDate: startDate,
          endDate: endDate,
          nextBillingDate: nextBillingDate,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          plan: true,
        },
      });

      if (coupon) {
        await tx.subscriptionCoupon.create({
          data: {
            subscriptionId: subscription.id,
            couponId: coupon.id,
          },
        });

        await tx.coupon.update({
          where: {
            id: coupon.id,
          },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: "INV-" + Date.now(),
          userId: Number(userId),
          subscriptionId: subscription.id,
          amount: finalAmount,
          tax: 0,
          totalAmount: finalAmount,
          status: "PENDING",
          issueDate: new Date(),
          dueDate: nextBillingDate,
        },
      });

      return {
        subscription: subscription,
        invoice: invoice,
      };
    });

    res.status(201).json({
      message: "Subscription and invoice created successfully",
      subscription: result.subscription,
      invoice: result.invoice,
      pricing: {
        originalAmount: Number(plan.price),
        discountAmount: discountAmount,
        finalAmount: finalAmount,
      },
      coupon: coupon
        ? {
            id: coupon.id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: Number(coupon.discountValue),
          }
        : null,
    });
  } catch (error) {
    console.error("Create subscription error:", error);

    res.status(500).json({
      message: "Failed to create subscription and invoice",
      error: error.message,
    });
  }
});

router.put("/:id/change-plan", async (req, res) => {
  try {
    const subscriptionId = Number(req.params.id);
    const planId = req.body.planId;

    if (!planId) {
      return res.status(400).json({
        message: "New plan is required",
      });
    }

    const subscription =
      await prisma.subscription.findUnique({
        where: {
          id: subscriptionId,
        },
      });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (
      subscription.status !== "ACTIVE" &&
      subscription.status !== "TRIAL"
    ) {
      return res.status(400).json({
        message:
          "Only active or trial subscriptions can change plan",
      });
    }

    const newPlan = await prisma.plan.findFirst({
      where: {
        id: Number(planId),
        status: "ACTIVE",
      },
    });

    if (!newPlan) {
      return res.status(404).json({
        message: "Active plan not found",
      });
    }

    if (subscription.planId === Number(planId)) {
      return res.status(400).json({
        message:
          "Customer is already subscribed to this plan",
      });
    }

    const nextBillingDate = new Date();

    if (newPlan.billingCycle === "MONTHLY") {
      nextBillingDate.setMonth(
        nextBillingDate.getMonth() + 1
      );
    }

    if (newPlan.billingCycle === "QUARTERLY") {
      nextBillingDate.setMonth(
        nextBillingDate.getMonth() + 3
      );
    }

    if (newPlan.billingCycle === "YEARLY") {
      nextBillingDate.setFullYear(
        nextBillingDate.getFullYear() + 1
      );
    }

    const updatedSubscription =
      await prisma.subscription.update({
        where: {
          id: subscriptionId,
        },
        data: {
          planId: Number(planId),
          nextBillingDate: nextBillingDate,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          plan: true,
        },
      });

    res.json({
      message: "Subscription plan changed successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to change subscription plan",
    });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const subscriptionId = Number(req.params.id);

    const subscription =
      await prisma.subscription.findUnique({
        where: {
          id: subscriptionId,
        },
      });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (subscription.status === "CANCELLED") {
      return res.status(400).json({
        message: "Subscription is already cancelled",
      });
    }

    if (
      subscription.status !== "ACTIVE" &&
      subscription.status !== "TRIAL"
    ) {
      return res.status(400).json({
        message:
          "Only active or trial subscriptions can be cancelled",
      });
    }

    const cancelledSubscription =
      await prisma.subscription.update({
        where: {
          id: subscriptionId,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          plan: true,
        },
      });

    res.json({
      message: "Subscription cancelled successfully",
      subscription: cancelledSubscription,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to cancel subscription",
    });
  }
});

module.exports = router;