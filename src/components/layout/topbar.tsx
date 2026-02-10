export function Topbar() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 bg-white px-4 py-3">
      <input
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none md:w-72"
        placeholder="Search invoices, customers, reports..."
      />
      <div className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">BDT</div>
    </div>
  );
}
