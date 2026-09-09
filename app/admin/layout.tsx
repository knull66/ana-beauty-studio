import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await requireAdmin();

  return (
    <div className="min-h-svh">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-6 py-12">{children}</div>
    </div>
  );
}
