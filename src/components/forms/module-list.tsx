"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";

export function ModuleList({ endpoint, title }: { endpoint: string; title: string }) {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch(endpoint).then((r) => r.json()).then(setRows).catch(() => setRows([]));
  }, [endpoint]);

  const headers = rows[0] ? Object.keys(rows[0]).slice(0, 5) : ["No data"];
  const body = rows.map((r) => headers.map((h) => String((r as any)[h] ?? "-")));

  return <DataTable title={title} headers={headers} rows={body.length ? body : [["No records"]]} />;
}
