import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcular resumo financeiro do dia
   */
  async getResumoDoDia(data: string) {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);

    const agendamentosConcluidos = await this.prisma.agendamento.findMany({
      where: {
        status: 'CONCLUIDO',
        dataHora: { gte: inicio, lte: fim },
        isBloqueio: false,
      },
      include: {
        servico: true,
        profissional: true,
        cliente: { select: { id: true, nome: true } },
      },
    });

    let totalFaturamento = new Decimal(0);
    const comissoesPorProfissional: Record<
      string,
      { nome: string; totalServicos: Decimal; comissao: Decimal; atendimentos: number }
    > = {};

    for (const agendamento of agendamentosConcluidos) {
      const precoServico = agendamento.servico?.preco || new Decimal(0);
      totalFaturamento = totalFaturamento.add(precoServico);

      const profId = agendamento.profissionalId;
      const prof = agendamento.profissional;

      if (!comissoesPorProfissional[profId]) {
        comissoesPorProfissional[profId] = {
          nome: prof.nome,
          totalServicos: new Decimal(0),
          comissao: new Decimal(0),
          atendimentos: 0,
        };
      }

      comissoesPorProfissional[profId].totalServicos =
        comissoesPorProfissional[profId].totalServicos.add(precoServico);
      comissoesPorProfissional[profId].atendimentos += 1;

      // Calcular comissão conforme regra do profissional
      let comissaoValor: Decimal;
      if (prof.regraComissaoTipo === 'PORCENTAGEM') {
        comissaoValor = precoServico.mul(prof.regraComissaoValor).div(100);
      } else {
        comissaoValor = prof.regraComissaoValor;
      }
      comissoesPorProfissional[profId].comissao =
        comissoesPorProfissional[profId].comissao.add(comissaoValor);
    }

    const totalComissoes = Object.values(comissoesPorProfissional).reduce(
      (sum, p) => sum.add(p.comissao),
      new Decimal(0),
    );

    const ticketMedio =
      agendamentosConcluidos.length > 0
        ? totalFaturamento.div(agendamentosConcluidos.length)
        : new Decimal(0);

    return {
      data,
      totalAtendimentos: agendamentosConcluidos.length,
      totalFaturamento: totalFaturamento.toFixed(2),
      totalComissoes: totalComissoes.toFixed(2),
      totalLiquido: totalFaturamento.sub(totalComissoes).toFixed(2),
      ticketMedio: ticketMedio.toFixed(2),
      comissoesPorProfissional: Object.values(comissoesPorProfissional).map((p) => ({
        ...p,
        totalServicos: p.totalServicos.toFixed(2),
        comissao: p.comissao.toFixed(2),
      })),
      atendimentos: agendamentosConcluidos.map((a) => ({
        id: a.id,
        horario: a.dataHora,
        cliente: a.cliente?.nome || 'N/A',
        servico: a.servico?.nome || 'N/A',
        valor: a.servico?.preco?.toFixed(2) || '0.00',
        profissional: a.profissional.nome,
      })),
    };
  }

  /**
   * Fechar o caixa do dia — salva o registro no banco
   */
  async fecharCaixa(data: string, fechadoPor: string, observacoes?: string) {
    // Verificar se já foi fechado
    const existente = await this.prisma.caixaFechamento.findUnique({
      where: { data: new Date(data) },
    });

    if (existente) {
      throw new BadRequestException(`O caixa do dia ${data} já foi fechado`);
    }

    const resumo = await this.getResumoDoDia(data);

    return this.prisma.caixaFechamento.create({
      data: {
        data: new Date(data),
        totalEntradas: new Decimal(resumo.totalFaturamento),
        totalComissoes: new Decimal(resumo.totalComissoes),
        totalLiquido: new Decimal(resumo.totalLiquido),
        fechadoPor,
        observacoes,
      },
    });
  }

  /**
   * Relatório de faturamento por período
   */
  async getRelatorioPeriodo(dataInicio: string, dataFim: string) {
    const inicio = new Date(dataInicio);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);

    const agendamentos = await this.prisma.agendamento.findMany({
      where: {
        status: 'CONCLUIDO',
        dataHora: { gte: inicio, lte: fim },
        isBloqueio: false,
      },
      include: {
        servico: true,
        profissional: true,
      },
    });

    let totalFaturamento = new Decimal(0);
    let totalComissoes = new Decimal(0);

    // Faturamento por dia
    const faturamentoPorDia: Record<string, number> = {};

    for (const a of agendamentos) {
      const preco = a.servico?.preco || new Decimal(0);
      totalFaturamento = totalFaturamento.add(preco);

      const diaKey = a.dataHora.toISOString().split('T')[0];
      faturamentoPorDia[diaKey] = (faturamentoPorDia[diaKey] || 0) + Number(preco);

      const prof = a.profissional;
      if (prof.regraComissaoTipo === 'PORCENTAGEM') {
        totalComissoes = totalComissoes.add(preco.mul(prof.regraComissaoValor).div(100));
      } else {
        totalComissoes = totalComissoes.add(prof.regraComissaoValor);
      }
    }

    const ticketMedio =
      agendamentos.length > 0
        ? totalFaturamento.div(agendamentos.length)
        : new Decimal(0);

    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      totalAtendimentos: agendamentos.length,
      totalFaturamento: totalFaturamento.toFixed(2),
      totalComissoes: totalComissoes.toFixed(2),
      totalLiquido: totalFaturamento.sub(totalComissoes).toFixed(2),
      ticketMedio: ticketMedio.toFixed(2),
      faturamentoPorDia: Object.entries(faturamentoPorDia)
        .map(([dia, valor]) => ({ dia, valor: valor.toFixed(2) }))
        .sort((a, b) => a.dia.localeCompare(b.dia)),
    };
  }
}
