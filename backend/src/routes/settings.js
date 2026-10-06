const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// Get settings
router.get("/", async (req, res) => {
  try {
    let settings = await prisma.systemSetting.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: {
          companyName: "SubBill",
          supportEmail: "support@subbill.com",
          currency: "INR",
          taxPercentage: 18,
          invoicePrefix: "INV",
          timezone: "Asia/Kolkata",
        },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
});

// Update settings
router.put("/", async (req, res) => {
  try {
    const {
      companyName,
      supportEmail,
      currency,
      taxPercentage,
      invoicePrefix,
      timezone,
    } = req.body;

    if (!companyName || !supportEmail) {
      return res.status(400).json({
        message: "Company name and support email are required",
      });
    }

    const existingSettings = await prisma.systemSetting.findFirst();

    let settings;

    if (existingSettings) {
      settings = await prisma.systemSetting.update({
        where: {
          id: existingSettings.id,
        },
        data: {
          companyName,
          supportEmail,
          currency: currency || "INR",
          taxPercentage: Number(taxPercentage) || 0,
          invoicePrefix: invoicePrefix || "INV",
          timezone: timezone || "Asia/Kolkata",
        },
      });
    } else {
      settings = await prisma.systemSetting.create({
        data: {
          companyName,
          supportEmail,
          currency: currency || "INR",
          taxPercentage: Number(taxPercentage) || 0,
          invoicePrefix: invoicePrefix || "INV",
          timezone: timezone || "Asia/Kolkata",
        },
      });
    }

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      message: "Failed to update settings",
    });
  }
});

module.exports = router;