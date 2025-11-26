import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from '../pokemon.controller';
import { PokemonService } from '../pokemon.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { UpdatePokemonPartialDto } from '../dto/update-pokemon-partial.dto';
import { ListPokemonQueryDto } from '../dto/list-pokemon-query.dto';
import { PokemonsResponseDto } from '../dto/pokemon-response.dto';
import { PokemonTypes } from '../type/pokemon.type';

type PokemonEntity = {
  id: number;
  name: string;
  created_at?: Date;
  types?: PokemonTypes[];
};

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: jest.Mocked<PokemonService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            listAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updatePartial: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get(
      PokemonService,
    ) as unknown as jest.Mocked<PokemonService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listAll', () => {
    it('should return a paginated list of pokemons', async () => {
      const query: ListPokemonQueryDto = {};
      const result: PokemonsResponseDto = {
        data: [
          {
            id: 1,
            name: 'pikachu',
            created_at: new Date('2025-05-10'),
            types: [
              {
                id: 1,
                name: 'ELECTRIC',
                created_at: new Date('2024-01-01'),
              },
            ],
          },
        ],
        pagination: {
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
        },
      };

      service.listAll.mockResolvedValue(result);

      await expect(controller.listAll(query)).resolves.toEqual(result);
      expect(service.listAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon by id', async () => {
      const result: PokemonEntity = {
        id: 1,
        name: 'pikachu',
        created_at: new Date(),
      };
      service.getById.mockResolvedValue(result as undefined);

      await expect(controller.findOne(1)).resolves.toEqual(result);
      expect(service.getById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      service.getById.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.getById).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new pokemon and return it', async () => {
      const dto: CreatePokemonDto = {
        name: 'pikachu',
        types: ['ELECTRIC'],
      } as undefined;
      const created: PokemonEntity = {
        id: 1,
        name: 'pikachu',
        types: [
          { id: 1, name: 'ELECTRIC', created_at: new Date('2025-01-01') },
        ],
      };

      service.create.mockResolvedValue(created as undefined);

      await expect(controller.create(dto)).resolves.toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a pokemon and return it', async () => {
      const dto: UpdatePokemonDto = {
        name: 'raichu',
        types: ['ELECTRIC'],
      } as undefined;
      const updated: PokemonEntity = {
        id: 1,
        name: 'raichu',
        types: [
          { id: 1, name: 'ELECTRIC', created_at: new Date('2025-01-01') },
        ],
      };

      service.update.mockResolvedValue(updated as undefined);

      await expect(controller.update(1, dto)).resolves.toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when updating non-existing pokemon', async () => {
      const dto: UpdatePokemonDto = { name: 'x', types: ['FIRE'] } as undefined;

      service.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(123, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(123, dto);
    });
  });

  describe('patch', () => {
    it('should partially update a pokemon and return it', async () => {
      const dto: UpdatePokemonPartialDto = { name: 'updated' } as undefined;
      const result: PokemonEntity = { id: 1, name: 'updated' };

      service.updatePartial.mockResolvedValue(result as undefined);

      await expect(controller.patch(1, dto)).resolves.toEqual(result);
      expect(service.updatePartial).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      const dto: UpdatePokemonPartialDto = { name: 'something' } as undefined;

      service.updatePartial.mockRejectedValue(new NotFoundException());

      await expect(controller.patch(99, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.updatePartial).toHaveBeenCalledWith(99, dto);
    });
  });

  describe('delete', () => {
    it('should return void when deleting successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when deleting a non-existing pokemon', async () => {
      service.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete(777)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(777);
    });
  });
});
