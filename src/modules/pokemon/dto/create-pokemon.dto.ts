import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';
import { Transform } from 'class-transformer';

export class CreatePokemonDto {
  @ApiProperty({
    description: 'The name of the Pokémon',
    example: 'pikachu',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase()) // Follow the existing formatting for names (lowercase)
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
  @Transform(
    (
      { value }, // Follow the existing formatting for types (uppercase)
    ) =>
      Array.isArray(value)
        ? value.map((v) => String(v).toUpperCase())
        : [String(value).toUpperCase()],
  )
  types: PokemonTypeValidation[];
}
