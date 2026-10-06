const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const router = express.Router();

// GET all customers
router.get("/", async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
});

// GET customer by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const customer = await prisma.user.findFirst({
      where: {
        id: id,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
});

// CREATE customer
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingCustomer = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, email, status } = req.body;

    if (!name || !email || !status) {
      return res.status(400).json({
        message: "Name, email and status are required",
      });
    }

    const customer = await prisma.user.findFirst({
      where: {
        id: id,
        role: "CUSTOMER",
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: id,
        },
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Another user already uses this email",
      });
    }

    const updatedCustomer = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update customer",
    });
  }
});

module.exports = router;