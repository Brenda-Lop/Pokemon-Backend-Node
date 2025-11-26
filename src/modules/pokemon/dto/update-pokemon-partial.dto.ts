import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';
import { Transform } from 'class-transformer';

export class UpdatePokemonPartialDto {
  @ApiPropertyOptional({
    description: 'The name of the Pokémon',
    example: 'pikachu',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  name?: string;

  @ApiPropertyOptional({
    description: 'The type of the Pokémon',
    example: 'DRAGON',
    enum: Object.values(PokemonTypeValidation),
  })
  @IsArray()
  @IsOptional()
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
  types?: PokemonTypeValidation[];
}
