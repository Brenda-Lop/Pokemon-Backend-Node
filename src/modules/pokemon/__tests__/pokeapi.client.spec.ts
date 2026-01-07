import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { PokeApiClient } from '../api/pokeapi.client';

describe('PokeApiClient', () => {
  let client: PokeApiClient;

  const mockHttp = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeApiClient, { provide: HttpService, useValue: mockHttp }],
    }).compile();

    client = module.get(PokeApiClient);
    jest.clearAllMocks();
  });

  it('should fetch pokemon by id', async () => {
    const mockData = {
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
    };

    const formattedData = {
      id: 1,
      name: 'bulbasaur',
      types: ['grass'],
    };

    mockHttp.axiosRef.get.mockResolvedValue({ data: mockData });

    const result = await client.fetchPokemonById(1);

    expect(result).toEqual(formattedData);
    expect(mockHttp.axiosRef.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/1',
    );
  });
});
