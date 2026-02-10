import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, postExpenseJournal, logAudit } from "@/lib/accounting/posting";

const schema = z.object({ date: z.string(), category: z.string(), description: z.string(), amount: z.number().positive(), paidVia: z.enum(["CASH", "BANK", "BKASH"]), bankAccountId: z.string().optional(), bkashAccountId: z.string().optional(), receiptUrl: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.expenseEntry.findMany({ orderBy: { expenseDate: "desc" } }));
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const userId = "seed-admin";
    const expense = await prisma.$transaction(async (tx) => {
      const created = await tx.expenseEntry.create({ data: { ...body, expenseDate: new Date(body.date) } });
      await postExpenseJournal(tx, userId, created.id, created.amount, created.category, created.paidVia);
      await logAudit(tx, userId, "CREATE", "Expense", created.id, { amount: created.amount, category: created.category });
      return created;
    });
    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid expense payload" }, { status: 400 });
  }
}
