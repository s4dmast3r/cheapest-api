import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateTiendaDto,
  QueryTiendaDto,
  TiendaResponseDto,
  UpdateTiendaDto,
} from '../dtos';
import { EstadoCaptacion } from '../repositories/entities';
import { TiendaService } from '../services';
import { TiendaController } from './tienda.controller';

describe('TiendaController', () => {
  let controller: TiendaController;
  let service: jest.Mocked<TiendaService>;

  const response: TiendaResponseDto = {
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
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaController],
      providers: [
        {
          provide: TiendaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TiendaController>(TiendaController);
    service = module.get(TiendaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create to the service', async () => {
    const dto: CreateTiendaDto = {
      codigoInterno: response.codigoInterno,
      nombreComercial: response.nombreComercial,
      responsableId: response.responsableId,
      rut: response.rut,
      direccion: response.direccion,
      telefono: response.telefono,
      estadoCaptacion: response.estadoCaptacion,
    };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toEqual(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate findAll to the service', async () => {
    const query: QueryTiendaDto = {
      estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
    };
    service.findAll.mockResolvedValue([response]);

    await expect(controller.findAll(query)).resolves.toEqual([response]);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should delegate findById to the service', async () => {
    service.findById.mockResolvedValue(response);

    await expect(controller.findById(response.id)).resolves.toEqual(response);
    expect(service.findById).toHaveBeenCalledWith(response.id);
  });

  it('should delegate update to the service', async () => {
    const dto: UpdateTiendaDto = { nombreComercial: 'Nuevo nombre' };
    const updated = { ...response, ...dto };
    service.update.mockResolvedValue(updated);

    await expect(controller.update(response.id, dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(response.id, dto);
  });

  it('should delegate delete to the service', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(controller.delete(response.id)).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith(response.id);
  });
});
