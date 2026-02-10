import { z } from "zod";

export const invoiceSchema = z.object({
  invoiceNo: z.string().min(3),
  customerId: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  taxAmount: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
  items: z.array(z.object({ description: z.string().min(2), quantity: z.number().positive(), unitPrice: z.number().nonnegative() })).min(1),
  paymentInstructions: z.any().optional()
});

export const paymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  paymentDate: z.string(),
  method: z.enum(["CASH", "BANK", "BKASH"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  bankAccountId: z.string().optional(),
  bkashAccountId: z.string().optional()
});

export const simpleMoneyEntry = z.object({
  amount: z.number().positive(),
  date: z.string(),
  method: z.enum(["CASH", "BANK", "BKASH"]),
  bankAccountId: z.string().optional(),
  bkashAccountId: z.string().optional(),
  note: z.string().optional()
});
