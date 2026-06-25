import { IsNotEmpty, IsOptional, IsEmail, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  aniversario?: string;

  @IsOptional()
  @IsString()
  fichaAnamnese?: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}

export class UpdateClientDto {
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
  @IsString()
  aniversario?: string;

  @IsOptional()
  @IsString()
  fichaAnamnese?: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}
