import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = {
  title: "Deshfiri Accounting",
  description: "Production-ready accounting platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen md:flex">
          <Sidebar />
          <main className="flex-1">
            <Topbar />
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
