import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/suppliers", label: "Suppliers" },
  { href: "/dashboard/forwarders", label: "Forwarders" },
  { href: "/dashboard/invoices", label: "Invoices" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="p-4">
          <div className="text-lg font-semibold">Order Tracking</div>
          <div className="text-sm text-muted-foreground">Dashboard</div>
        </div>

        <Separator />

        <nav className="p-2 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Button variant="ghost" className="w-full justify-start">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Separator className="mb-3" />
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="outline" className="w-full">
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="h-14 border-b flex items-center px-6">
          <div className="font-medium">Welcome</div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}