"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your suppliers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Coming soon</p>
        <p className="text-sm text-muted-foreground mt-1">
          Suppliers list will be displayed here
        </p>
      </div>
    </div>
  );
}
