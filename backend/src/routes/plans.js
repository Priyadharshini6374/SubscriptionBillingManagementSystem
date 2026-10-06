const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// GET all plans
router.get("/", async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(plans);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch plans",
    });
  }
});

// GET one plan by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const plan = await prisma.plan.findUnique({
      where: {
        id: id,
      },
    });

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    res.json(plan);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch plan",
    });
  }
});

// CREATE a new plan
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      billingCycle,
      trialPeriod,
      features,
      maximumUsers,
      storageLimit,
      status,
    } = req.body;

    if (!name || price === undefined || !billingCycle) {
      return res.status(400).json({
        message: "Name, price and billing cycle are required",
      });
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price: Number(price),
        billingCycle,
        trialPeriod: Number(trialPeriod) || 0,
        features: features || [],
        maximumUsers:
          maximumUsers !== "" && maximumUsers !== undefined
            ? Number(maximumUsers)
            : null,
        storageLimit:
          storageLimit !== "" && storageLimit !== undefined
            ? Number(storageLimit)
            : null,
        status: status || "ACTIVE",
      },
    });

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create plan",
    });
  }
});

// UPDATE a plan
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      description,
      price,
      billingCycle,
      trialPeriod,
      features,
      maximumUsers,
      storageLimit,
      status,
    } = req.body;

    if (!name || price === undefined || !billingCycle) {
      return res.status(400).json({
        message: "Name, price and billing cycle are required",
      });
    }

    const updatedPlan = await prisma.plan.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        price: Number(price),
        billingCycle,
        trialPeriod: Number(trialPeriod) || 0,
        features: features || [],
        maximumUsers:
          maximumUsers !== "" && maximumUsers !== undefined
            ? Number(maximumUsers)
            : null,
        storageLimit:
          storageLimit !== "" && storageLimit !== undefined
            ? Number(storageLimit)
            : null,
        status: status || "ACTIVE",
      },
    });

    res.json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update plan",
    });
  }
});

module.exports = router;