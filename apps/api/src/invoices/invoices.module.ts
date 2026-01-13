import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoiceDocumentsController } from './invoice-documents.controller';

@Module({ controllers: [InvoicesController, InvoiceDocumentsController], providers: [InvoicesService] })
export class InvoicesModule {}