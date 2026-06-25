import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto, UpdateProfessionalDto } from './professionals.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' as const } },
            { especialidades: { has: search } },
          ],
        }
      : {};

    return this.prisma.profissional.findMany({
      where,
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const professional = await this.prisma.profissional.findUnique({
      where: { id },
      include: {
        agendamentos: {
          where: {
            dataHora: { gte: new Date() },
          },
          orderBy: { dataHora: 'asc' },
          take: 10,
          include: { servico: true, cliente: true },
        },
      },
    });

    if (!professional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return professional;
  }

  async create(dto: CreateProfessionalDto) {
    return this.prisma.profissional.create({
      data: {
        nome: dto.nome,
        telefone: dto.telefone,
        email: dto.email,
        especialidades: dto.especialidades,
        regraComissaoTipo: dto.regraComissaoTipo,
        regraComissaoValor: dto.regraComissaoValor,
        fotoUrl: dto.fotoUrl,
      },
    });
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    await this.findOne(id);

    return this.prisma.profissional.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.profissional.delete({ where: { id } });
  }
}
