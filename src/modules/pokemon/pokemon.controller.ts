import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { UpdatePokemonPartialDto } from './dto/update-pokemon-partial.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { ApiTags } from '@nestjs/swagger';
import { ListPokemonQueryDto } from './dto/list-pokemon-query.dto';
import { Pokemon } from '@prisma/client';
import { PokemonsResponseDto } from './dto/pokemon-response.dto';
import {
  ApiExceptionFilter,
  ExternalApiExceptionFilter,
} from './filter/exception.filter';

@ApiTags('Pokémons')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findManyPokemon(
    @Query() query: ListPokemonQueryDto,
  ): Promise<PokemonsResponseDto> {
    return this.pokemonService.listAll(query);
  }

  // Apply filter with custom exceptions
  @UseFilters(ApiExceptionFilter)
  @Get('/:id')
  async findOnePokemon(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Pokemon> {
    return this.pokemonService.getById(id);
  }

  @Post()
  @HttpCode(201)
  async createOnePokemon(@Body() dto: CreatePokemonDto): Promise<Pokemon> {
    return await this.pokemonService.create(dto);
  }

  @Put(':id')
  async updateOnePokemon(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    return await this.pokemonService.update(id, dto);
  }

  @Patch(':id')
  async patchOnePokemon(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePokemonPartialDto,
  ): Promise<Pokemon> {
    return await this.pokemonService.updatePartial(id, dto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteOnePokemon(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.pokemonService.delete(id);
  }

  // Apply filter with custom exceptions
  @UseFilters(ExternalApiExceptionFilter)
  @Post('/:id/import')
  async importOrUpdateOnePokemon(@Param('id') id: number): Promise<Pokemon> {
    return this.pokemonService.importFromExternalApi(id);
  }
}
