const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();


// GET all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(coupons);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch coupons",
    });
  }
});


// VALIDATE coupon
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Coupon code is required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: {
        code: normalizedCode,
      },
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon code",
      });
    }

    // Check coupon status
    if (coupon.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Coupon is not active",
      });
    }

    // Check expiry
    if (
      coupon.expiresAt &&
      new Date(coupon.expiresAt) < new Date()
    ) {
      return res.status(400).json({
        message: "Coupon has expired",
      });
    }

    // Check maximum usage
    if (
      coupon.maxUses !== null &&
      coupon.usedCount >= coupon.maxUses
    ) {
      return res.status(400).json({
        message: "Coupon usage limit reached",
      });
    }

    res.json({
      valid: true,
      message: "Coupon is valid",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUses: coupon.maxUses,
        usedCount: coupon.usedCount,
        expiresAt: coupon.expiresAt,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    res.status(500).json({
      message: "Failed to validate coupon",
    });
  }
});


// GET coupon by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
      include: {
        subscriptionCoupons: {
          include: {
            subscription: {
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    res.json(coupon);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch coupon",
    });
  }
});


// CREATE coupon
router.post("/", async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxUses,
      expiresAt,
      status = "ACTIVE",
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        message:
          "Code, discount type and discount value are required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        code: normalizedCode,
      },
    });

    if (existingCoupon) {
      return res.status(409).json({
        message: "Coupon code already exists",
      });
    }

    if (
      discountType !== "PERCENTAGE" &&
      discountType !== "FIXED"
    ) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    const value = Number(discountValue);

    if (value <= 0) {
      return res.status(400).json({
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "PERCENTAGE" && value > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        discountType,
        discountValue: value,
        maxUses:
          maxUses === "" || maxUses === undefined
            ? null
            : Number(maxUses),
        expiresAt:
          expiresAt === "" || !expiresAt
            ? null
            : new Date(expiresAt),
        status,
      },
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create coupon",
    });
  }
});


// UPDATE coupon
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      code,
      discountType,
      discountValue,
      maxUses,
      expiresAt,
      status,
    } = req.body;

    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!existingCoupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    if (
      discountType !== "PERCENTAGE" &&
      discountType !== "FIXED"
    ) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    const value = Number(discountValue);

    if (value <= 0) {
      return res.status(400).json({
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "PERCENTAGE" && value > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: {
        id,
      },
      data: {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: value,
        maxUses:
          maxUses === "" || maxUses === undefined
            ? null
            : Number(maxUses),
        expiresAt:
          expiresAt === "" || !expiresAt
            ? null
            : new Date(expiresAt),
        status,
      },
    });

    res.json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update coupon",
    });
  }
});


// DELETE coupon
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    await prisma.coupon.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete coupon",
    });
  }
});


module.exports = router;

