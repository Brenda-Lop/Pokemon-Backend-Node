import { Injectable } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { UpdatePokemonPartialDto } from './dto/update-pokemon-partial.dto';
import { ListPokemonQueryDto } from './dto/list-pokemon-query.dto';

@Injectable()
export class PokemonService {
  constructor(private pokemonRepository: PokemonRepository) {}

  async listAll(query: ListPokemonQueryDto) {
    return this.pokemonRepository.findAll(query);
  }

  async getById(id: number) {
    return this.pokemonRepository.findOne(id);
  }

  async create(dto: CreatePokemonDto) {
    return this.pokemonRepository.create(dto);
  }

  async update(id: number, dto: UpdatePokemonDto) {
    return this.pokemonRepository.update(id, dto);
  }

  async updatePartial(id: number, dto: UpdatePokemonPartialDto) {
    return this.pokemonRepository.update(id, dto);
  }

  async delete(id: number) {
    return this.pokemonRepository.delete(id);
  }
}
