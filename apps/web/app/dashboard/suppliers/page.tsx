"use client";

import { useEffect, useState, useCallback } from "react";
import { Supplier } from "@/types/suppliers";
import { SuppliersTable } from "@/components/suppliers/suppliers-table";
import { SupplierDialog } from "@/components/suppliers/suppliers-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";

interface PaginatedResponse {
  data: Supplier[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchSuppliers = useCallback(async (currentPage = page) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/suppliers?page=${currentPage}&limit=${limit}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const response: PaginatedResponse = await res.json();
      setSuppliers(response.data);
      setMeta(response.meta);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

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
        <p className="text-destructive font-medium">Failed to load suppliers</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your freight suppliers
          </p>
        </div>
        <SupplierDialog onSuccess={fetchSuppliers} />
      </div>

      <SuppliersTable suppliers={suppliers} onUpdate={fetchSuppliers} />
      
      {meta.total > 0 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.limit}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchSuppliers(newPage);
          }}
        />
      )}
    </div>
  );
}