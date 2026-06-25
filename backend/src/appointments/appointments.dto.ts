import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString({}, { message: 'Data/hora inválida' })
  dataHora!: string;

  @IsNotEmpty({ message: 'Profissional é obrigatório' })
  profissionalId!: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  servicoId?: string;

  @IsOptional()
  @IsNumber()
  duracaoMinutos?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsBoolean()
  isBloqueio?: boolean;
}

export class UpdateAppointmentStatusDto {
  @IsIn(['CONFIRMADO', 'PENDENTE', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO'], {
    message: 'Status inválido',
  })
  status!: string;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class QueryAppointmentsDto {
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  profissionalId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
