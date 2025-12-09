import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ImportPokemonDto } from '../dto/import-pokemon.dto';
import { AxiosError } from 'axios';
import {
  ExternalApiNotFoundError,
  ExternalApiRequestFailedError,
} from 'src/common/external-api.errors';

@Injectable()
export class PokeApiClient {
  constructor(private readonly http: HttpService) {}

  async fetchPokemonById(id: number): Promise<ImportPokemonDto> {
    try {
      const response = await this.http.axiosRef.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`,
      );

      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => type.type.name),
      };
    } catch (error: unknown) {
      const axiosErr = error as AxiosError;

      // Specific error for 404 Not Found
      if (axiosErr?.response?.status === 404) {
        throw new ExternalApiNotFoundError(axiosErr.message);
      }

      // Generic error for other statuses
      throw new ExternalApiRequestFailedError(axiosErr.message);
    }
  }
}
