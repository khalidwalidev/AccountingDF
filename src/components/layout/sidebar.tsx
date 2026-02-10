"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  ["/dashboard", "Dashboard"],
  ["/invoices", "Invoices"],
  ["/customers", "Customers"],
  ["/payments", "Payments"],
  ["/expenses", "Expenses"],
  ["/withdrawals", "Withdrawals"],
  ["/manual-income", "Manual Income"],
  ["/accounts", "Accounts"],
  ["/reports", "Reports"],
  ["/settings", "Settings"],
  ["/users", "Users"],
  ["/audit", "Audit"],
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-brand-100 bg-white md:w-64">
      <div className="border-b border-brand-100 p-5">
        <h1 className="text-xl font-semibold text-brand-700">Deshfiri Accounting</h1>
      </div>
      <nav className="space-y-1 p-3">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm",
              pathname === href ? "bg-brand-100 text-brand-900" : "text-slate-600 hover:bg-brand-50"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
