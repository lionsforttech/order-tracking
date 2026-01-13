-- CreateTable
CREATE TABLE "invoice_documents" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invoice_documents_invoice_id_idx" ON "invoice_documents"("invoice_id");

-- AddForeignKey
ALTER TABLE "invoice_documents" ADD CONSTRAINT "invoice_documents_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
