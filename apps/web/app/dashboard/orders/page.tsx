"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/orders";
import { OrdersTable } from "@/components/orders/orders-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client Component (for now)
 * 
 * WHY CLIENT?
 * - Server Components can't easily pass cookies to fetch()
 * - Browser automatically sends httpOnly cookies to /api/orders
 * - Simpler auth flow without complex Next.js cookie forwarding
 * 
 * TRADEOFF:
 * - Slight delay on initial render (loading state)
 * - Could move to Server Component with cookie forwarding later
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-8 text-center">
        <p className="text-destructive font-medium">Failed to load orders</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage your order shipments and tracking
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
