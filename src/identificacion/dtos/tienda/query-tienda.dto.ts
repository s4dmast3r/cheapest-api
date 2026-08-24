import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoCaptacion } from '../../repositories/entities';

export class QueryTiendaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigoInterno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  rut?: string;

  @IsOptional()
  @IsEnum(EstadoCaptacion)
  estadoCaptacion?: EstadoCaptacion;
}
