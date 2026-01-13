"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Upload, File, X, Download } from "lucide-react";
import { Invoice } from "@/types/invoices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceDialogProps {
  invoice?: Invoice;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function InvoiceDialog({ invoice, trigger, onSuccess }: InvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber || "");
  const [invoiceDate, setInvoiceDate] = useState(
    invoice?.invoiceDate 
      ? new Date(invoice.invoiceDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [orderId, setOrderId] = useState(invoice?.orderId || "");
  const [orders, setOrders] = useState<Array<{ id: string; refNumber: string }>>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const isEdit = !!invoice;

  useEffect(() => {
    if (open && !isEdit) {
      fetchOrders();
    }
    if (open && isEdit && invoice) {
      fetchDocuments();
    }
  }, [open, isEdit]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders?limit=1000");
      if (res.ok) {
        const response = await res.json();
        setOrders(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }

  async function fetchDocuments() {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  }

  async function handleDeleteDocument(documentId: string) {
    if (!invoice) return;

    try {
      const res = await fetch(`/api/invoices/${invoice.id}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete document');
      }

      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  }

  function handleDownload(documentId: string, filename: string) {
    if (!invoice) return;
    window.open(`/api/invoices/${invoice.id}/documents/${documentId}`, '_blank');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/invoices/${invoice.id}` : "/api/invoices";
      const method = isEdit ? "PATCH" : "POST";

      const body = isEdit
        ? { invoiceNumber, invoiceDate }
        : { orderId, invoiceNumber, invoiceDate };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Failed to save invoice' }));
        throw new Error(data.message || "Failed to save invoice");
      }

      const result = await res.json();

      // Upload pending files after creation or update
      if (pendingFiles.length > 0) {
        const invoiceId = isEdit ? invoice.id : result.id;
        for (const file of pendingFiles) {
          const formData = new FormData();
          formData.append('file', file);
          await fetch(`/api/invoices/${invoiceId}/documents`, {
            method: 'POST',
            body: formData,
          });
        }
      }

      setOpen(false);
      setInvoiceNumber("");
      setInvoiceDate("");
      setOrderId("");
      setPendingFiles([]);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Invoice" : "Create Invoice"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update invoice information"
              : "Create a new invoice for an order"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Select value={orderId} onValueChange={setOrderId} required>
                  <SelectTrigger id="order">
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.refNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                placeholder="e.g., INV-2024-001"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Documents</Label>
              
              {isEdit ? (
                // Edit mode: Select files to upload on Update
                <>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setPendingFiles(files);
                    }}
                  />
                  {pendingFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {pendingFiles.length} file(s) selected - will be uploaded when you click Update
                    </p>
                  )}
                </>
              ) : (
                // Create mode: Select files to upload after creation
                <>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setPendingFiles(files);
                    }}
                  />
                  {pendingFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {pendingFiles.length} file(s) selected - will be uploaded after invoice creation
                    </p>
                  )}
                </>
              )}

              {/* Document List (only in edit mode) */}
              {isEdit && documents.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doc.originalName}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(doc.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc.id, doc.originalName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
