import { ReactNode } from "react";

export function DataTable({ title, headers, rows }: { title: string; headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-brand-100 p-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-50 text-left text-brand-900">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                {row.map((cell, cidx) => (
                  <td key={cidx} className="px-4 py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
