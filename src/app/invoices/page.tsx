import { ModuleList } from "@/components/forms/module-list";

export default function Page() {
  return <ModuleList endpoint="/api/invoices" title="Invoices (status auto: Unpaid/Partial/Paid/Overdue/Void)" />;
}
