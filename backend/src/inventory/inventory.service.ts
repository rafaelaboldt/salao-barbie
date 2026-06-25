import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryDto } from './inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, tipo?: string) {
    const where: any = {};

    if (search) {
      where.nomeProduto = { contains: search, mode: 'insensitive' };
    }

    if (tipo) {
      where.tipo = tipo;
    }

    return this.prisma.estoque.findMany({
      where,
      orderBy: { nomeProduto: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.estoque.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Produto não encontrado');
    return item;
  }

  async create(dto: CreateInventoryDto) {
    return this.prisma.estoque.create({ data: dto });
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.findOne(id);
    return this.prisma.estoque.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.estoque.delete({ where: { id } });
  }

  /**
   * Retorna produtos com estoque abaixo do mínimo
   */
  async getAlertaEstoqueBaixo() {
    return this.prisma.$queryRaw`
      SELECT * FROM estoque 
      WHERE quantidade <= estoque_minimo
      ORDER BY quantidade ASC
    `;
  }

  /**
   * Abater quantidade do estoque (usado quando concluir atendimento)
   */
  async abaterEstoque(id: string, quantidade: number) {
    const item = await this.findOne(id);

    const novaQuantidade = item.quantidade - quantidade;

    return this.prisma.estoque.update({
      where: { id },
      data: { quantidade: Math.max(0, novaQuantidade) },
    });
  }
}
