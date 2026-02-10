async function getDashboard() {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/dashboard`, { cache: "no-store" });
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboard();
  const cards = [
    ["Total Sales", data.totalSales],
    ["Collected", data.collected],
    ["Outstanding Receivables", data.outstanding],
    ["Total Expenses", data.totalExpenses],
    ["Net Profit", data.netProfit],
    ["Overdue Invoices", data.overdueCount]
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-brand-700">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
