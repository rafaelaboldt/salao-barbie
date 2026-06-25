import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './clients.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' as const } },
            { telefone: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.cliente.findMany({
      where,
      orderBy: { nome: 'asc' },
      include: {
        agendamentos: {
          take: 5,
          orderBy: { dataHora: 'desc' },
          include: { servico: true, profissional: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        agendamentos: {
          orderBy: { dataHora: 'desc' },
          include: { servico: true, profissional: true },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return client;
  }

  async create(dto: CreateClientDto) {
    return this.prisma.cliente.create({
      data: {
        nome: dto.nome,
        telefone: dto.telefone,
        email: dto.email,
        aniversario: dto.aniversario ? new Date(dto.aniversario) : null,
        fichaAnamnese: dto.fichaAnamnese,
        fotoUrl: dto.fotoUrl,
      },
    });
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.cliente.update({
      where: { id },
      data: {
        ...dto,
        aniversario: dto.aniversario ? new Date(dto.aniversario) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cliente.delete({ where: { id } });
  }
}
