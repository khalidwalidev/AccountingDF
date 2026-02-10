import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const lines = await prisma.journalLine.findMany({ include: { account: true, journalEntry: true } });
  const trialBalance = Object.values(lines.reduce((acc, l) => {
    const key = l.account.name;
    if (!acc[key]) acc[key] = { account: key, debit: 0, credit: 0 };
    acc[key].debit += Number(l.debit);
    acc[key].credit += Number(l.credit);
    return acc;
  }, {} as Record<string, { account: string; debit: number; credit: number }>));

  return NextResponse.json({ trialBalance, generalLedger: lines });
}
