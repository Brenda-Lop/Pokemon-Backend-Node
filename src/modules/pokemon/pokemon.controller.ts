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
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { UpdatePokemonPartialDto } from './dto/update-pokemon-partial.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { ApiTags } from '@nestjs/swagger';
import { ListPokemonQueryDto } from './dto/list-pokemon-query.dto';

@ApiTags('Pokémons')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findManyPokemon(@Query() query: ListPokemonQueryDto) {
    return this.pokemonService.listAll(query);
  }

  @Get('/:id')
  async findOnePokemon(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.getById(id);
  }

  @Post()
  @HttpCode(201)
  async createOnePokemon(@Body() dto: CreatePokemonDto) {
    return this.pokemonService.create(dto);
  }

  @Put(':id')
  async updateOnePokemon(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(id, dto);
  }

  @Patch(':id')
  async patchOnePokemon(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePokemonPartialDto,
  ) {
    return this.pokemonService.updatePartial(id, dto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteOnePokemon(@Param('id', ParseIntPipe) id: number) {
    await this.pokemonService.delete(id);
  }
}
