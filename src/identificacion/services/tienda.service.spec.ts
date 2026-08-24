import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTiendaDto, UpdateTiendaDto } from '../dtos';
import { TiendaRepository } from '../repositories';
import { EstadoCaptacion, Tienda } from '../repositories/entities';
import { TiendaService } from './tienda.service';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: jest.Mocked<TiendaRepository>;

  const tienda: Tienda = {
    id: '01c5cd1b-1fb1-4387-8efe-a2c9b5df3890',
    codigoInterno: 'TIENDA-001',
    nombreComercial: 'Tienda Centro',
    responsableId: 'ae5160ea-4829-4f43-8927-6189769f46b7',
    rut: '900123456-7',
    direccion: 'Calle 1 # 2-3',
    telefono: '+57 3001234567',
    estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaService,
        {
          provide: TiendaRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get(TiendaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tienda', async () => {
    const dto: CreateTiendaDto = {
      codigoInterno: tienda.codigoInterno,
      nombreComercial: tienda.nombreComercial,
      responsableId: tienda.responsableId,
      rut: tienda.rut,
      direccion: tienda.direccion,
      telefono: tienda.telefono,
      estadoCaptacion: tienda.estadoCaptacion,
    };
    repository.create.mockResolvedValue(tienda);

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(tienda);
  });

  it('should find a tienda by id', async () => {
    repository.findById.mockResolvedValue(tienda);

    const result = await service.findById(tienda.id);

    expect(repository.findById).toHaveBeenCalledWith(tienda.id);
    expect(result).toEqual(tienda);
  });

  it('should throw NotFoundException when finding a missing tienda', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(tienda.id)).rejects.toThrow(
      new NotFoundException(`Tienda con id ${tienda.id} no encontrada`),
    );
  });

  it('should throw NotFoundException when updating a missing tienda', async () => {
    const dto: UpdateTiendaDto = { nombreComercial: 'Nuevo nombre' };
    repository.findById.mockResolvedValue(null);

    await expect(service.update(tienda.id, dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when deleting a missing tienda', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.delete(tienda.id)).rejects.toThrow(NotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should return true when the tienda exists', async () => {
    repository.exists.mockResolvedValue(true);

    await expect(service.exists(tienda.id)).resolves.toBe(true);
    expect(repository.exists).toHaveBeenCalledWith(tienda.id);
  });

  it('should return false when the tienda does not exist', async () => {
    repository.exists.mockResolvedValue(false);

    await expect(service.exists(tienda.id)).resolves.toBe(false);
    expect(repository.exists).toHaveBeenCalledWith(tienda.id);
  });
});
