import { NextResponse } from "next/server";
import { prisma, postInvoiceJournal, refreshInvoiceStatus, logAudit } from "@/lib/accounting/posting";
import { invoiceSchema } from "@/lib/validators";

export async function GET() {
  const invoices = await prisma.invoice.findMany({ include: { customer: true, payments: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  try {
    const body = invoiceSchema.parse(await request.json());
    const subtotal = body.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const total = subtotal + body.taxAmount - body.discountAmount;
    const userId = "seed-admin";
    const invoice = await prisma.$transaction(async (tx) => {
      const created = await tx.invoice.create({
        data: {
          invoiceNo: body.invoiceNo,
          customerId: body.customerId,
          issueDate: new Date(body.issueDate),
          dueDate: new Date(body.dueDate),
          notes: body.notes,
          terms: body.terms,
          subtotal,
          taxAmount: body.taxAmount,
          discountAmount: body.discountAmount,
          totalAmount: total,
          paymentInstructions: body.paymentInstructions,
          items: { create: body.items.map((i) => ({ ...i, lineTotal: i.quantity * i.unitPrice })) }
        }
      });
      await postInvoiceJournal(tx, userId, created.id, total as any, created.invoiceNo);
      await refreshInvoiceStatus(tx, created.id);
      await logAudit(tx, userId, "CREATE", "Invoice", created.id, { invoiceNo: created.invoiceNo, total });
      return created;
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid invoice payload" }, { status: 400 });
  }
}
