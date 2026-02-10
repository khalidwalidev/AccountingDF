import bcrypt from "bcryptjs";
import { PrismaClient, AccountType, RoleName } from "@prisma/client";

const prisma = new PrismaClient();

const defaultAccounts = [
  ["1000", "Cash", AccountType.ASSET, true],
  ["1010", "Bank Accounts", AccountType.ASSET, true],
  ["1020", "bKash Wallet", AccountType.ASSET, true],
  ["1100", "Accounts Receivable", AccountType.ASSET, true],
  ["3000", "Sales Income", AccountType.INCOME, true],
  ["3050", "Other Income", AccountType.INCOME, true],
  ["5000", "Office Expense", AccountType.EXPENSE, true],
  ["5010", "Travel Expense", AccountType.EXPENSE, true],
  ["5020", "Food/Entertainment Expense", AccountType.EXPENSE, true],
  ["5030", "Rent Expense", AccountType.EXPENSE, true],
  ["5040", "Others Expense", AccountType.EXPENSE, true],
  ["4000", "Owner Drawings", AccountType.EQUITY, true]
] as const;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@deshfiri.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Deshfiri Admin",
      email,
      passwordHash: hash,
      role: RoleName.ADMIN
    }
  });

  for (const [code, name, type, isSystem] of defaultAccounts) {
    await prisma.account.upsert({
      where: { code },
      update: {},
      create: { code, name, type, isSystem }
    });
  }

  await prisma.companySetting.upsert({
    where: { id: "default-company" },
    update: {},
    create: {
      id: "default-company",
      name: "Deshfiri",
      defaultCurrency: "BDT",
      fiscalYearStart: new Date("2026-01-01"),
      fiscalYearEnd: new Date("2026-12-31")
    }
  });

  const customer = await prisma.customer.upsert({
    where: { id: "sample-customer" },
    update: {},
    create: { id: "sample-customer", name: "Rahim Enterprise", phone: "01700000000" }
  });

  await prisma.invoice.upsert({
    where: { invoiceNo: "INV-1001" },
    update: {},
    create: {
      invoiceNo: "INV-1001",
      customerId: customer.id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      subtotal: 10000,
      totalAmount: 10000,
      items: {
        create: [{ description: "Program enrollment", quantity: 1, unitPrice: 10000, lineTotal: 10000 }]
      }
    }
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`Seeded admin credentials: ${email} / ${password}`);
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
