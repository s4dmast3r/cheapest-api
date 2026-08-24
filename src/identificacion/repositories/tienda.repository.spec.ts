import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryTiendaDto } from '../dtos';
import { EstadoCaptacion, Tienda } from './entities';
import { TiendaRepository } from './tienda.repository';

describe('TiendaRepository', () => {
  let repository: TiendaRepository;
  let typeormRepo: jest.Mocked<Repository<Tienda>>;

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
    const mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaRepository,
        {
          provide: 'TIENDA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<TiendaRepository>(TiendaRepository);
    typeormRepo = module.get('TIENDA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create and save a tienda', async () => {
    const data = {
      codigoInterno: tienda.codigoInterno,
      nombreComercial: tienda.nombreComercial,
    };
    typeormRepo.create.mockReturnValue(tienda);
    typeormRepo.save.mockResolvedValue(tienda);

    await expect(repository.create(data)).resolves.toEqual(tienda);
    expect(typeormRepo.create).toHaveBeenCalledWith(data);
    expect(typeormRepo.save).toHaveBeenCalledWith(tienda);
  });

  it('should apply received filters and return tiendas', async () => {
    const query: QueryTiendaDto = {
      codigoInterno: tienda.codigoInterno,
      rut: tienda.rut,
      estadoCaptacion: tienda.estadoCaptacion,
    };
    const queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([tienda]),
    };
    typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

    await expect(repository.findAll(query)).resolves.toEqual([tienda]);
    expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('tienda');
    expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
  });

  it('should find a tienda by id', async () => {
    typeormRepo.findOne.mockResolvedValue(tienda);

    await expect(repository.findById(tienda.id)).resolves.toEqual(tienda);
    expect(typeormRepo.findOne).toHaveBeenCalledWith({
      where: { id: tienda.id },
    });
  });

  it('should update and return a tienda', async () => {
    const updates = { nombreComercial: 'Nuevo nombre' };
    const updated = { ...tienda, ...updates };
    typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
    typeormRepo.findOne.mockResolvedValue(updated);

    await expect(repository.update(tienda.id, updates)).resolves.toEqual(
      updated,
    );
    expect(typeormRepo.update).toHaveBeenCalledWith(tienda.id, updates);
  });

  it('should delete a tienda and return true', async () => {
    typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

    await expect(repository.delete(tienda.id)).resolves.toBe(true);
    expect(typeormRepo.delete).toHaveBeenCalledWith(tienda.id);
  });

  it('should return whether a tienda exists', async () => {
    typeormRepo.exists.mockResolvedValue(true);

    await expect(repository.exists(tienda.id)).resolves.toBe(true);
    expect(typeormRepo.exists).toHaveBeenCalledWith({
      where: { id: tienda.id },
    });
  });
});
