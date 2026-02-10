# Deshfiri Accounting

A production-focused accounting web app built with **Next.js App Router + TypeScript + Tailwind + Prisma + PostgreSQL + NextAuth**.

## Features

- Authentication with role-aware access (Admin, Accountant, Staff)
- Company setup (currency BDT, fiscal year, month lock scaffold, VAT scaffold)
- Full Chart of Accounts with seeded system accounts
- Double-entry journal posting for:
  - Invoices
  - Payments
  - Expenses
  - Owner Withdrawals
  - Manual Income
- Customers, invoices, line items, partial payments, auto invoice status
- Bank / bKash receiving account models and invoice payment-instruction snapshots
- Dashboard metrics and core report APIs (Trial Balance + Ledger base)
- Audit logs for sensitive operations
- Reconciliation-ready flag (`reconciled`) on payment/expense/withdrawal/income transactions

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM + PostgreSQL
- NextAuth Credentials
- Zod validation

## Project Structure (key)

- `prisma/schema.prisma` → full accounting data model
- `prisma/seed.ts` → default chart of accounts, admin user, sample customer/invoice
- `src/app` → UI routes + API routes
- `src/lib/accounting/posting.ts` → atomic journal posting rules
- `src/lib/auth/options.ts` → auth/session setup
- `src/components/layout/*` → sidebar/topbar

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Copy env

```bash
cp .env.example .env
```

3. Run migrations

```bash
npx prisma migrate dev
```

4. Seed default data

```bash
npm run prisma:seed
```

5. Start app

```bash
npm run dev
```

## Initial Dev Credentials

- Email: `admin@deshfiri.com`
- Password: `Admin@123`

> Printed by seed in non-production mode.

## Accounting Rules Implemented

1. **Invoice posting**
   - Dr Accounts Receivable
   - Cr Sales Income

2. **Payment posting**
   - Dr Cash/Bank/bKash (based on method)
   - Cr Accounts Receivable

3. **Expense posting**
   - Dr Category Expense Account
   - Cr Cash/Bank/bKash

4. **Withdrawal posting**
   - Dr Owner Drawings
   - Cr Cash/Bank/bKash

5. **Manual Income posting**
   - Dr Cash/Bank/bKash
   - Cr Other Income

6. **Invoice status automation**
   - Unpaid / Partial / Paid / Overdue / Void computed from due date + payment totals.

## Notes

- CSV export and PDF rendering are scaffold-ready and can be added in incremental modules.
- Reconciliation protection policy should block updates for `reconciled=true` transactions except via reversal API.
