"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Forwarder } from "@/types/forwarders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ForwarderDialog } from "./forwarder-dialog";

export function ForwardersTable({ 
  forwarders, 
  onUpdate 
}: { 
  forwarders: Forwarder[];
  onUpdate?: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  async function handleDelete(id: string) {
    setDeleting(id);

    try {
      const res = await fetch(`/api/forwarders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete forwarder");
      }

      onUpdate?.();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete forwarder");
    } finally {
      setDeleting(null);
    }
  }

  if (forwarders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No forwarders found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first forwarder to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forwarders.map((forwarder) => (
            <TableRow key={forwarder.id}>
              <TableCell className="font-medium">{forwarder.name}</TableCell>
              <TableCell>{formatDate(forwarder.createdAt)}</TableCell>
              <TableCell>{formatDate(forwarder.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ForwarderDialog
                    forwarder={forwarder}
                    onSuccess={onUpdate}
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Forwarder?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete <strong>{forwarder.name}</strong>.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(forwarder.id)}
                          disabled={deleting === forwarder.id}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {deleting === forwarder.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
