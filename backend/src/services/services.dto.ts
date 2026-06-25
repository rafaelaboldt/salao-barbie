import { IsNotEmpty, IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({}, { message: 'Preço deve ser numérico' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  preco!: number;

  @IsNumber({}, { message: 'Duração deve ser numérica' })
  @Min(1, { message: 'Duração mínima é 1 minuto' })
  duracaoMinutos!: number;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duracaoMinutos?: number;
}
