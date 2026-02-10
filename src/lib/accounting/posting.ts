import { Prisma, PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function logAudit(tx: Prisma.TransactionClient, userId: string | null, action: string, entity: string, entityId: string, metadata?: object) {
  await tx.auditLog.create({ data: { userId: userId ?? undefined, action, entity, entityId, metadata } });
}

async function accountIdByName(tx: Prisma.TransactionClient, name: string) {
  const account = await tx.account.findUnique({ where: { name } });
  if (!account) throw new Error(`${name} account missing`);
  return account.id;
}

function paymentMethodAccount(method: PaymentMethod) {
  if (method === "CASH") return "Cash";
  if (method === "BANK") return "Bank Accounts";
  return "bKash Wallet";
}

export async function postInvoiceJournal(tx: Prisma.TransactionClient, userId: string, invoiceId: string, total: Prisma.Decimal, ref: string) {
  const ar = await accountIdByName(tx, "Accounts Receivable");
  const sales = await accountIdByName(tx, "Sales Income");
  const entry = await tx.journalEntry.create({
    data: {
      date: new Date(),
      sourceType: "INVOICE",
      sourceId: invoiceId,
      description: `Invoice ${ref}`,
      reference: ref,
      createdById: userId,
      lines: {
        create: [
          { accountId: ar, debit: total, credit: 0 },
          { accountId: sales, debit: 0, credit: total }
        ]
      }
    }
  });
  return entry;
}

export async function postPaymentJournal(tx: Prisma.TransactionClient, userId: string, paymentId: string, amount: Prisma.Decimal, method: PaymentMethod, ref?: string) {
  const cashBank = await accountIdByName(tx, paymentMethodAccount(method));
  const ar = await accountIdByName(tx, "Accounts Receivable");
  return tx.journalEntry.create({
    data: {
      date: new Date(),
      sourceType: "PAYMENT",
      sourceId: paymentId,
      description: `Payment ${ref ?? ""}`,
      createdById: userId,
      lines: {
        create: [
          { accountId: cashBank, debit: amount, credit: 0 },
          { accountId: ar, debit: 0, credit: amount }
        ]
      }
    }
  });
}

export async function postExpenseJournal(tx: Prisma.TransactionClient, userId: string, expenseId: string, amount: Prisma.Decimal, category: string, method: PaymentMethod) {
  const expenseAccountMap: Record<string, string> = {
    Office: "Office Expense",
    Travel: "Travel Expense",
    Food: "Food/Entertainment Expense",
    Rent: "Rent Expense",
    Others: "Others Expense"
  };
  const expenseAcc = await accountIdByName(tx, expenseAccountMap[category] ?? "Others Expense");
  const fromAcc = await accountIdByName(tx, paymentMethodAccount(method));
  return tx.journalEntry.create({
    data: {
      date: new Date(),
      sourceType: "EXPENSE",
      sourceId: expenseId,
      description: `Expense ${category}`,
      createdById: userId,
      lines: { create: [{ accountId: expenseAcc, debit: amount, credit: 0 }, { accountId: fromAcc, debit: 0, credit: amount }] }
    }
  });
}

export async function postWithdrawalJournal(tx: Prisma.TransactionClient, userId: string, withdrawalId: string, amount: Prisma.Decimal, method: PaymentMethod) {
  const drawings = await accountIdByName(tx, "Owner Drawings");
  const fromAcc = await accountIdByName(tx, paymentMethodAccount(method));
  return tx.journalEntry.create({
    data: {
      date: new Date(),
      sourceType: "WITHDRAWAL",
      sourceId: withdrawalId,
      description: "Owner withdrawal",
      createdById: userId,
      lines: { create: [{ accountId: drawings, debit: amount, credit: 0 }, { accountId: fromAcc, debit: 0, credit: amount }] }
    }
  });
}

export async function postManualIncomeJournal(tx: Prisma.TransactionClient, userId: string, incomeId: string, amount: Prisma.Decimal, method: PaymentMethod) {
  const income = await accountIdByName(tx, "Other Income");
  const toAcc = await accountIdByName(tx, paymentMethodAccount(method));
  return tx.journalEntry.create({
    data: {
      date: new Date(),
      sourceType: "MANUAL_INCOME",
      sourceId: incomeId,
      description: "Manual income",
      createdById: userId,
      lines: { create: [{ accountId: toAcc, debit: amount, credit: 0 }, { accountId: income, debit: 0, credit: amount }] }
    }
  });
}

export async function refreshInvoiceStatus(tx: Prisma.TransactionClient, invoiceId: string) {
  const invoice = await tx.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
  if (!invoice) return;
  const paid = invoice.payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const total = Number(invoice.totalAmount);
  let status: any = "UNPAID";
  if (invoice.isVoid) status = "VOID";
  else if (paid === 0) status = new Date(invoice.dueDate) < new Date() ? "OVERDUE" : "UNPAID";
  else if (paid < total) status = new Date(invoice.dueDate) < new Date() ? "OVERDUE" : "PARTIAL";
  else status = "PAID";
  await tx.invoice.update({ where: { id: invoiceId }, data: { status } });
}

export { prisma };
