import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from '../pokemon.service';
import { PokemonRepository } from '../pokemon.repository';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { UpdatePokemonPartialDto } from '../dto/update-pokemon-partial.dto';
import { ListPokemonQueryDto } from '../dto/list-pokemon-query.dto';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: jest.Mocked<PokemonRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: PokemonRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    repository = module.get(PokemonRepository);
  });

  describe('listAll', () => {
    it('should call repository.findAll with query and return result', async () => {
      const query: ListPokemonQueryDto = { page: 1, limit: 10 };
      const result = {
        data: [],
        pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 },
      };

      repository.findAll.mockResolvedValue(result);

      expect(await service.listAll(query)).toBe(result);
      expect(repository.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getById', () => {
    it('should call repository.findOne with the correct id', async () => {
      const result = { id: 1, name: 'pikachu', created_at: new Date() };
      repository.findOne.mockResolvedValue(result);

      expect(await service.getById(1)).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call repository.create with dto', async () => {
      const dto: CreatePokemonDto = {
        name: 'pikachu',
        types: [PokemonTypeValidation.ELECTRIC],
      };
      const result = {
        id: 1,
        ...dto,
        created_at: new Date(),
        types: [
          {
            id: 1,
            name: 'ELECTRIC',
            created_at: new Date('2024-01-01'),
          },
        ],
      };

      repository.create.mockResolvedValue(result);

      expect(await service.create(dto)).toBe(result);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call repository.update with id and dto', async () => {
      const dto: UpdatePokemonDto = {
        name: 'raichu',
        types: [PokemonTypeValidation.DRAGON],
      };
      const result = {
        id: 1,
        ...dto,
        created_at: new Date(),
        types: [
          {
            id: 1,
            name: 'DRAGON',
            created_at: new Date('2024-01-01'),
          },
        ],
      };

      repository.update.mockResolvedValue(result);

      expect(await service.update(1, dto)).toBe(result);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('updatePartial', () => {
    it('should call repository.update with id and partial dto', async () => {
      const dto: UpdatePokemonPartialDto = { name: 'raichu' };
      const result = {
        id: 1,
        name: 'raichu',
        created_at: new Date(),
        types: [
          {
            id: 1,
            name: 'ELECTRIC',
            created_at: new Date('2024-01-01'),
          },
        ],
      };

      repository.update.mockResolvedValue(result);

      expect(await service.updatePartial(1, dto)).toBe(result);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should call repository.delete with id', async () => {
      repository.delete.mockResolvedValue(undefined);

      expect(await service.delete(1)).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
