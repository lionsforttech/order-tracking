"use client";

import { useEffect, useState, useCallback } from "react";
import { Forwarder } from "@/types/forwarders";
import { ForwardersTable } from "@/components/forwarders/forwarders-table";
import { ForwarderDialog } from "@/components/forwarders/forwarder-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForwardersPage() {
  const [forwarders, setForwarders] = useState<Forwarder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForwarders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/forwarders", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch forwarders");
      }

      const data = await res.json();
      setForwarders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForwarders();
  }, [fetchForwarders]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-8 text-center">
        <p className="text-destructive font-medium">Failed to load forwarders</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forwarders</h1>
          <p className="text-sm text-muted-foreground">
            Manage your freight forwarders
          </p>
        </div>
        <ForwarderDialog onSuccess={fetchForwarders} />
      </div>

      <ForwardersTable forwarders={forwarders} onUpdate={fetchForwarders} />
    </div>
  );
}
