import { NextResponse } from "next/server";
import { simpleMoneyEntry } from "@/lib/validators";
import { prisma, postWithdrawalJournal, logAudit } from "@/lib/accounting/posting";

export async function GET() {
  return NextResponse.json(await prisma.withdrawal.findMany({ orderBy: { withdrawalDate: "desc" } }));
}

export async function POST(request: Request) {
  try {
    const body = simpleMoneyEntry.parse(await request.json());
    const userId = "seed-admin";
    const withdrawal = await prisma.$transaction(async (tx) => {
      const created = await tx.withdrawal.create({ data: { withdrawalDate: new Date(body.date), amount: body.amount, paidVia: body.method, bankAccountId: body.bankAccountId, bkashAccountId: body.bkashAccountId, note: body.note } });
      await postWithdrawalJournal(tx, userId, created.id, created.amount, created.paidVia);
      await logAudit(tx, userId, "CREATE", "Withdrawal", created.id, { amount: created.amount });
      return created;
    });
    return NextResponse.json(withdrawal, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid withdrawal payload" }, { status: 400 });
  }
}
