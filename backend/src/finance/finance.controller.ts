import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('finance')
@UseGuards(AuthGuard, RolesGuard)
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('resumo-dia')
  getResumoDoDia(@Query('data') data: string) {
    return this.financeService.getResumoDoDia(data || new Date().toISOString().split('T')[0]);
  }

  @Post('fechar-caixa')
  @Roles('ADMIN')
  fecharCaixa(
    @Body() body: { data: string; observacoes?: string },
    @Request() req: any,
  ) {
    return this.financeService.fecharCaixa(body.data, req.user.sub, body.observacoes);
  }

  @Get('relatorio')
  @Roles('ADMIN')
  getRelatorio(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.financeService.getRelatorioPeriodo(dataInicio, dataFim);
  }
}
