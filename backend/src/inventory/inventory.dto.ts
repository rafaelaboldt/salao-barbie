import { IsNotEmpty, IsOptional, IsNumber, IsString, IsIn, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  nomeProduto!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsIn(['USO_INTERNO', 'VENDA'], { message: 'Tipo deve ser USO_INTERNO ou VENDA' })
  tipo!: 'USO_INTERNO' | 'VENDA';

  @IsNumber({}, { message: 'Quantidade deve ser numérica' })
  @Min(0)
  quantidade!: number;

  @IsNumber({}, { message: 'Estoque mínimo deve ser numérico' })
  @Min(0)
  estoqueMinimo!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precoVenda?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precoCusto?: number;

  @IsOptional()
  @IsString()
  fotoProdutoUrl?: string;
}

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  nomeProduto?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsIn(['USO_INTERNO', 'VENDA'])
  tipo?: 'USO_INTERNO' | 'VENDA';

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidade?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estoqueMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precoVenda?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precoCusto?: number;

  @IsOptional()
  @IsString()
  fotoProdutoUrl?: string;
}
