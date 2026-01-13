import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, UseGuards, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import { extname, join } from 'path';
import { existsSync, createReadStream, unlinkSync } from 'fs';
import { v4 as uuid } from 'uuid';

const UPLOAD_DIR = './uploads/invoices';
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@UseGuards(JwtAuthGuard)
@Controller('invoices/:invoiceId/documents')
export class InvoiceDocumentsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuid()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDocument(
    @Param('invoiceId') invoiceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Verify invoice exists
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      // Clean up uploaded file
      if (existsSync(file.path)) {
        unlinkSync(file.path);
      }
      throw new BadRequestException('Invoice not found');
    }

    const document = await this.prisma.invoiceDocument.create({
      data: {
        invoiceId,
        filename: file.filename,
        originalName: file.originalname,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
    });

    return document;
  }

  @Get()
  async getDocuments(@Param('invoiceId') invoiceId: string) {
    return this.prisma.invoiceDocument.findMany({
      where: { invoiceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':documentId/download')
  async downloadDocument(
    @Param('invoiceId') invoiceId: string,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ) {
    const document = await this.prisma.invoiceDocument.findFirst({
      where: {
        id: documentId,
        invoiceId,
      },
    });

    if (!document || !existsSync(document.filepath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Document not found' });
    }

    res.setHeader('Content-Type', document.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);

    const fileStream = createReadStream(document.filepath);
    fileStream.pipe(res);
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('invoiceId') invoiceId: string,
    @Param('documentId') documentId: string,
  ) {
    const document = await this.prisma.invoiceDocument.findFirst({
      where: {
        id: documentId,
        invoiceId,
      },
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    // Delete file from disk
    if (existsSync(document.filepath)) {
      unlinkSync(document.filepath);
    }

    await this.prisma.invoiceDocument.delete({
      where: { id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }
}
