import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supplier.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async create(dto: CreateSupplierDto) {
    try {
      return await this.prisma.supplier.create({ data: dto });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('A supplier with this name already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateSupplierDto) {
    try {
      return await this.prisma.supplier.update({ where: { id }, data: dto });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('A supplier with this name already exists');
      }
      throw error;
    }
  }

  remove(id: string) {
    return this.prisma.supplier.delete({ where: { id } });
  }
}