import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';
import { Transform } from 'class-transformer';

export class ImportPokemonDto {
  @ApiProperty({
    description: 'The id of the Pokémon',
    example: 7,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'The name of the Pokémon',
    example: 'pikachu',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @ApiProperty({
    description: 'List of the Pokémon types',
    example: ['FIRE'],
    enum: Object.values(PokemonTypeValidation),
    isArray: true,
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PokemonTypeValidation, {
    each: true,
    message: `type must be a valid Pokémon type: ${Object.values(PokemonTypeValidation)}`,
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => String(v).toUpperCase())
      : [String(value).toUpperCase()],
  )
  types: PokemonTypeValidation[];
}
