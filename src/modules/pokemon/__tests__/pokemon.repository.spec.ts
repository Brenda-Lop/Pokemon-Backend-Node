import { Test, TestingModule } from '@nestjs/testing';
import { PokemonRepository } from '../pokemon.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';

describe('PokemonRepository', () => {
  let repository: PokemonRepository;

  const prismaMock = {
    pokemon: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repository = module.get(PokemonRepository);
  });

  const pokemonList = [
    {
      id: 2,
      name: 'pikachu',
      created_at: new Date(),
      types: [{ id: 1, name: 'ELECTRIC', created_at: new Date() }],
    },
  ];

  const result = {
    data: pokemonList,
    pagination: { currentPage: 1, limit: 10, totalItems: 1, totalPages: 1 },
  };

  describe('findAll', () => {
    it('should filter by pokemon name', async () => {
      prismaMock.pokemon.count.mockResolvedValue(1);
      prismaMock.pokemon.findMany.mockResolvedValue(pokemonList);

      const data = await repository.findAll({ name: 'pika' });

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'pika' } },
        }),
      );
      expect(data).toEqual(result);
      expect(data).toBeInstanceOf(Object);
    });

    it('should filter by pokemon type', async () => {
      prismaMock.pokemon.count.mockResolvedValue(1);
      prismaMock.pokemon.findMany.mockResolvedValue(pokemonList);

      const data = await repository.findAll({
        type: PokemonTypeValidation.ELECTRIC,
      });

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { types: { some: { name: 'ELECTRIC' } } },
        }),
      );
      expect(data).toEqual(result);
      expect(data).toBeInstanceOf(Object);
    });

    it('should filter by createdFrom', async () => {
      prismaMock.pokemon.count.mockResolvedValue(1);
      prismaMock.pokemon.findMany.mockResolvedValue(pokemonList);

      const date = '2025-01-01';

      const data = await repository.findAll({ createdFrom: date });

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { created_at: { gte: new Date(date) } },
        }),
      );
      expect(data).toEqual(result);
      expect(data).toBeInstanceOf(Object);
    });

    it('should sort by created_at if orderByDate is provided', async () => {
      prismaMock.pokemon.count.mockResolvedValue(1);
      prismaMock.pokemon.findMany.mockResolvedValue(pokemonList);

      const data = await repository.findAll({ orderByDate: 'desc' });

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ created_at: 'desc' }],
        }),
      );
      expect(data).toBeInstanceOf(Object);
      expect(data).toEqual(result);
    });

    it('should sort by name if orderByName is provided', async () => {
      prismaMock.pokemon.count.mockResolvedValue(1);
      prismaMock.pokemon.findMany.mockResolvedValue(pokemonList);

      const data = await repository.findAll({ orderByName: 'asc' });

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ name: 'asc' }],
        }),
      );
      expect(data).toEqual(result);
      expect(data).toBeInstanceOf(Object);
    });

    it('should apply default sort by created_at asc when no sorting provided', async () => {
      prismaMock.pokemon.count.mockResolvedValue(1);
      prismaMock.pokemon.findMany.mockResolvedValue(pokemonList);

      const data = await repository.findAll({});

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ created_at: 'asc' }],
        }),
      );
      expect(data).toEqual(result);
      expect(data).toBeInstanceOf(Object);
    });

    it('should apply pagination correctly', async () => {
      prismaMock.pokemon.count.mockResolvedValue(30);
      prismaMock.pokemon.findMany.mockResolvedValue([]);

      await repository.findAll({ page: 3, limit: 10 });

      expect(prismaMock.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
    });

    it('should return correct pagination metadata', async () => {
      prismaMock.pokemon.count.mockResolvedValue(25);
      prismaMock.pokemon.findMany.mockResolvedValue([]);

      const result = await repository.findAll({ page: 2, limit: 10 });

      expect(result.pagination).toEqual({
        totalItems: 25,
        currentPage: 2,
        totalPages: 3,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a record if it exists', async () => {
      const pokemon = {
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
        types: [],
      };

      prismaMock.pokemon.findUnique.mockResolvedValue(pokemon);

      expect(await repository.findOne(1)).toBe(pokemon);
    });

    it('should throw NotFoundException if not found', async () => {
      prismaMock.pokemon.findUnique.mockResolvedValue(null);

      await expect(repository.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should pass correct prisma payload', async () => {
      const dto = {
        name: 'pikachu',
        types: [PokemonTypeValidation.ELECTRIC],
      };

      const returned = {
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
        types: [{ id: 1, name: 'ELECTRIC', created_at: new Date() }],
      };

      prismaMock.pokemon.create.mockResolvedValue(returned);

      const result = await repository.create(dto);

      expect(prismaMock.pokemon.create).toHaveBeenCalledWith({
        data: {
          name: 'pikachu',
          types: {
            connect: [{ name: 'ELECTRIC' }],
          },
        },
        include: { types: true },
      });

      expect(result).toBe(returned);
    });
  });

  describe('update', () => {
    it('should update normal fields only', async () => {
      const dto = { name: 'raichu' };

      prismaMock.pokemon.findUnique.mockResolvedValue({
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
        types: [],
      });

      prismaMock.pokemon.update.mockResolvedValue({
        id: 1,
        name: 'raichu',
        created_at: new Date(),
        types: [],
      });

      await repository.update(1, dto);

      expect(prismaMock.pokemon.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'raichu' },
        include: { types: true },
      });
    });

    it('should update types when provided', async () => {
      const dto = { types: [PokemonTypeValidation.ELECTRIC] };

      prismaMock.pokemon.findUnique.mockResolvedValue({
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
        types: [],
      });

      prismaMock.pokemon.update.mockResolvedValue({
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
        types: [],
      });

      await repository.update(1, dto);

      expect(prismaMock.pokemon.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          types: {
            set: [],
            connect: [{ name: 'ELECTRIC' }],
          },
        },
        include: { types: true },
      });
    });

    it('should throw NotFoundException if updating missing record', async () => {
      prismaMock.pokemon.findUnique.mockResolvedValue(null);

      await expect(repository.update(1, { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete by id', async () => {
      prismaMock.pokemon.findUnique.mockResolvedValue({
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
        types: [],
      });

      prismaMock.pokemon.delete.mockResolvedValue(undefined);

      await repository.delete(1);

      expect(prismaMock.pokemon.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if missing', async () => {
      prismaMock.pokemon.findUnique.mockResolvedValue(null);

      await expect(repository.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
