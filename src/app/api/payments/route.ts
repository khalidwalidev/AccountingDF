import { NextResponse } from "next/server";
import { prisma, postPaymentJournal, refreshInvoiceStatus, logAudit } from "@/lib/accounting/posting";
import { paymentSchema } from "@/lib/validators";

export async function GET() {
  const payments = await prisma.payment.findMany({ include: { invoice: true }, orderBy: { paymentDate: "desc" } });
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  try {
    const body = paymentSchema.parse(await request.json());
    const userId = "seed-admin";
    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({ data: { ...body, paymentDate: new Date(body.paymentDate) } });
      await postPaymentJournal(tx, userId, created.id, created.amount, created.method, created.reference ?? undefined);
      await refreshInvoiceStatus(tx, created.invoiceId);
      await logAudit(tx, userId, "CREATE", "Payment", created.id, { invoiceId: created.invoiceId, amount: created.amount });
      return created;
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid payment payload" }, { status: 400 });
  }
}
