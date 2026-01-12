-- AlterTable
ALTER TABLE "forwarders" ADD CONSTRAINT "forwarders_name_key" UNIQUE ("name");

-- AlterTable
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_name_key" UNIQUE ("name");
