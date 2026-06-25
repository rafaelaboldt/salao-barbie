import { IsNotEmpty, IsOptional, IsArray, IsString, IsNumber, IsIn, IsEmail } from 'class-validator';

export class CreateProfessionalDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsArray({ message: 'Especialidades deve ser um array' })
  especialidades!: string[];

  @IsIn(['FIXO', 'PORCENTAGEM'], { message: 'Tipo de comissão inválido' })
  regraComissaoTipo!: 'FIXO' | 'PORCENTAGEM';

  @IsNumber({}, { message: 'Valor da comissão deve ser numérico' })
  regraComissaoValor!: number;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}

export class UpdateProfessionalDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsArray()
  especialidades?: string[];

  @IsOptional()
  @IsIn(['FIXO', 'PORCENTAGEM'])
  regraComissaoTipo?: 'FIXO' | 'PORCENTAGEM';

  @IsOptional()
  @IsNumber()
  regraComissaoValor?: number;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}
