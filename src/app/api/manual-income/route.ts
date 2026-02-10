import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, postManualIncomeJournal, logAudit } from "@/lib/accounting/posting";

const schema = z.object({ date: z.string(), amount: z.number().positive(), method: z.enum(["CASH", "BANK", "BKASH"]), category: z.string().default("Other Income"), bankAccountId: z.string().optional(), bkashAccountId: z.string().optional(), note: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.manualIncome.findMany({ orderBy: { incomeDate: "desc" } }));
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const userId = "seed-admin";
    const income = await prisma.$transaction(async (tx) => {
      const created = await tx.manualIncome.create({ data: { incomeDate: new Date(body.date), amount: body.amount, receivedVia: body.method, category: body.category, bankAccountId: body.bankAccountId, bkashAccountId: body.bkashAccountId, note: body.note } });
      await postManualIncomeJournal(tx, userId, created.id, created.amount, created.receivedVia);
      await logAudit(tx, userId, "CREATE", "ManualIncome", created.id, { amount: created.amount });
      return created;
    });
    return NextResponse.json(income, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid manual income payload" }, { status: 400 });
  }
}
