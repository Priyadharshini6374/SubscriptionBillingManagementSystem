const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const customerPassword = await bcrypt.hash("Customer@123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@subbill.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@subbill.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "customer@subbill.com",
    },
    update: {},
    create: {
      name: "Customer",
      email: "customer@subbill.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });

  console.log("Admin and Customer users created successfully.");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });