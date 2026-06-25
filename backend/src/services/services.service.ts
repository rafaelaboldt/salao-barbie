import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? { nome: { contains: search, mode: 'insensitive' as const } }
      : {};

    return this.prisma.servico.findMany({
      where: { ...where, ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.servico.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return service;
  }

  async create(dto: CreateServiceDto) {
    return this.prisma.servico.create({ data: dto });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    return this.prisma.servico.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Soft delete — desativa ao invés de remover
    return this.prisma.servico.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
