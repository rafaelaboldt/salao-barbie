import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AgendamentoStatus } from '@prisma/client';
import {
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  QueryAppointmentsDto,
} from './appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Buscar agendamentos com filtros opcionais por data, profissional e status
   */
  async findAll(query: QueryAppointmentsDto) {
    const where: any = {};

    if (query.profissionalId) {
      where.profissionalId = query.profissionalId;
    }

    if (query.status) {
      where.status = query.status as AgendamentoStatus;
    }

    if (query.dataInicio || query.dataFim) {
      where.dataHora = {};
      if (query.dataInicio) {
        where.dataHora.gte = new Date(query.dataInicio);
      }
      if (query.dataFim) {
        where.dataHora.lte = new Date(query.dataFim);
      }
    }

    return this.prisma.agendamento.findMany({
      where,
      orderBy: { dataHora: 'asc' },
      include: {
        cliente: { select: { id: true, nome: true, telefone: true, fotoUrl: true } },
        profissional: { select: { id: true, nome: true, especialidades: true } },
        servico: { select: { id: true, nome: true, preco: true, duracaoMinutos: true } },
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.agendamento.findUnique({
      where: { id },
      include: {
        cliente: true,
        profissional: true,
        servico: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return appointment;
  }

  /**
   * Criar agendamento com validação de choque de horários
   */
  async create(dto: CreateAppointmentDto) {
    const dataHora = new Date(dto.dataHora);

    // Determinar duração
    let duracaoMinutos = dto.duracaoMinutos || 60;

    if (dto.servicoId && !dto.isBloqueio) {
      const servico = await this.prisma.servico.findUnique({
        where: { id: dto.servicoId },
      });
      if (!servico) throw new NotFoundException('Serviço não encontrado');
      duracaoMinutos = servico.duracaoMinutos;
    }

    // Calcular horário de fim
    const dataHoraFim = new Date(dataHora.getTime() + duracaoMinutos * 60 * 1000);

    // Validar se o profissional existe
    const profissional = await this.prisma.profissional.findUnique({
      where: { id: dto.profissionalId },
    });
    if (!profissional) throw new NotFoundException('Profissional não encontrado');

    // Validar se o cliente existe (quando não é bloqueio)
    if (dto.clienteId && !dto.isBloqueio) {
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: dto.clienteId },
      });
      if (!cliente) throw new NotFoundException('Cliente não encontrado');
    }

    // ====================================
    // VALIDAÇÃO DE CHOQUE DE HORÁRIOS
    // ====================================
    // Verifica se existe algum agendamento para o mesmo profissional
    // que se sobreponha ao intervalo [dataHora, dataHoraFim]
    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        profissionalId: dto.profissionalId,
        status: { notIn: ['CANCELADO'] },
        // Sobreposição: novo início < existente fim E novo fim > existente início
        AND: [
          { dataHora: { lt: dataHoraFim } },
          { dataHoraFim: { gt: dataHora } },
        ],
      },
    });

    if (conflito) {
      throw new ConflictException(
        `Conflito de horário: o profissional ${profissional.nome} já possui um agendamento entre ` +
        `${conflito.dataHora.toLocaleTimeString('pt-BR')} e ${conflito.dataHoraFim.toLocaleTimeString('pt-BR')}`,
      );
    }

    return this.prisma.agendamento.create({
      data: {
        dataHora,
        dataHoraFim,
        profissionalId: dto.profissionalId,
        clienteId: dto.isBloqueio ? null : dto.clienteId,
        servicoId: dto.isBloqueio ? null : dto.servicoId,
        notas: dto.notas,
        isBloqueio: dto.isBloqueio || false,
        status: dto.isBloqueio ? 'CONFIRMADO' : 'PENDENTE',
      },
      include: {
        cliente: true,
        profissional: true,
        servico: true,
      },
    });
  }

  /**
   * Atualizar status do agendamento com validação de fluxo
   */
  async updateStatus(id: string, dto: UpdateAppointmentStatusDto) {
    const appointment = await this.findOne(id);
    const newStatus = dto.status as AgendamentoStatus;

    // Validar transições de status válidas
    const validTransitions: Record<string, string[]> = {
      PENDENTE: ['CONFIRMADO', 'CANCELADO'],
      CONFIRMADO: ['EM_ATENDIMENTO', 'CANCELADO'],
      EM_ATENDIMENTO: ['CONCLUIDO', 'CANCELADO'],
      CONCLUIDO: [], // Estado final
      CANCELADO: [], // Estado final
    };

    const allowed = validTransitions[appointment.status] || [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Transição inválida: não é possível mudar de "${appointment.status}" para "${newStatus}". ` +
        `Transições permitidas: ${allowed.join(', ') || 'nenhuma (estado final)'}`,
      );
    }

    return this.prisma.agendamento.update({
      where: { id },
      data: {
        status: newStatus,
        notas: dto.notas || appointment.notas,
      },
      include: {
        cliente: true,
        profissional: true,
        servico: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.agendamento.delete({ where: { id } });
  }

  /**
   * Buscar agenda do dia para um profissional específico
   */
  async getAgendaDoDia(profissionalId: string, data: string) {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);

    return this.prisma.agendamento.findMany({
      where: {
        profissionalId,
        dataHora: { gte: inicio, lte: fim },
        status: { notIn: ['CANCELADO'] },
      },
      orderBy: { dataHora: 'asc' },
      include: {
        cliente: { select: { id: true, nome: true, telefone: true } },
        servico: { select: { id: true, nome: true, preco: true, duracaoMinutos: true } },
      },
    });
  }
}
