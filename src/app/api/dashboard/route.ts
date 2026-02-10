import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const [invoices, expenses, incomes] = await Promise.all([
    prisma.invoice.findMany({ include: { payments: true } }),
    prisma.expenseEntry.findMany(),
    prisma.manualIncome.findMany()
  ]);
  const totalSales = invoices.reduce((s, i) => s + Number(i.totalAmount), 0);
  const collected = invoices.reduce((s, i) => s + i.payments.reduce((p, pm) => p + Number(pm.amount), 0), 0);
  const outstanding = totalSales - collected;
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalManualIncome = incomes.reduce((s, m) => s + Number(m.amount), 0);
  const overdueCount = invoices.filter((i) => new Date(i.dueDate) < new Date() && i.status !== "PAID" && i.status !== "VOID").length;

  return NextResponse.json({ totalSales, collected, outstanding, totalExpenses, netProfit: totalSales + totalManualIncome - totalExpenses, overdueCount });
}
