import { ModuleList } from "@/components/forms/module-list";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h2 className="text-lg font-semibold text-brand-700">Financial Reports</h2>
        <p className="text-sm text-slate-600">Profit & Loss, Balance Sheet, Cash Flow, Trial Balance, General Ledger, AR aging and Sales/Collections are built from posted journals and invoices.</p>
      </div>
      <ModuleList endpoint="/api/reports" title="Trial Balance + Ledger (export CSV scaffolding ready)" />
    </div>
  );
}
