import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonRepository } from './pokemon.repository';
import { HttpModule } from '@nestjs/axios';
import { PokeApiClient } from './api/pokeapi.client';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService, PokemonRepository, PokeApiClient],
  imports: [HttpModule],
})
export class PokemonModule {}
