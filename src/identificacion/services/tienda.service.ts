import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  CreateTiendaDto,
  QueryTiendaDto,
  TiendaResponseDto,
  UpdateTiendaDto,
} from '../dtos';
import { TiendaRepository } from '../repositories';
import { Tienda } from '../repositories/entities';

@Injectable()
export class TiendaService {
  constructor(private readonly tiendaRepository: TiendaRepository) {}

  async create(dto: CreateTiendaDto): Promise<TiendaResponseDto> {
    try {
      const tienda = await this.tiendaRepository.create(dto);
      return this.mapToResponse(tienda);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          'Ya existe una tienda con el mismo codigoInterno o rut',
        );
      }
      throw error;
    }
  }

  async findAll(query: QueryTiendaDto): Promise<TiendaResponseDto[]> {
    const tiendas = await this.tiendaRepository.findAll(query);
    return tiendas.map((tienda) => this.mapToResponse(tienda));
  }

  async findById(id: string): Promise<TiendaResponseDto> {
    const tienda = await this.tiendaRepository.findById(id);
    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }
    return this.mapToResponse(tienda);
  }

  async update(id: string, dto: UpdateTiendaDto): Promise<TiendaResponseDto> {
    const tienda = await this.tiendaRepository.findById(id);
    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }

    const updatedTienda = await this.tiendaRepository.update(id, dto);
    return this.mapToResponse(updatedTienda!);
  }

  async delete(id: string): Promise<void> {
    const tienda = await this.tiendaRepository.findById(id);
    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }

    await this.tiendaRepository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.tiendaRepository.exists(id);
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string } | undefined)?.code === '23505'
    );
  }

  private mapToResponse(tienda: Tienda): TiendaResponseDto {
    return {
      id: tienda.id,
      codigoInterno: tienda.codigoInterno,
      nombreComercial: tienda.nombreComercial,
      responsableId: tienda.responsableId,
      rut: tienda.rut,
      direccion: tienda.direccion,
      telefono: tienda.telefono,
      estadoCaptacion: tienda.estadoCaptacion,
      createdAt: tienda.createdAt,
      updatedAt: tienda.updatedAt,
    };
  }
}
