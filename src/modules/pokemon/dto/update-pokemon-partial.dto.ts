import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';
import { Transform } from 'class-transformer';


export class UpdatePokemonPartialDto {
    @ApiPropertyOptional({
        description: 'The name of the Pokémon',
        example: 'pikachu'
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    name?: string;

    @ApiPropertyOptional({
        description: 'The type of the Pokémon',
        example: 'DRAGON',
        enum: Object.values(PokemonTypeValidation)
    })
    @IsOptional()
    @IsEnum(PokemonTypeValidation, { message: `type must be a valid Pokémon type: ${Object.values(PokemonTypeValidation)}` })
    @Transform(({ value }) => value.toUpperCase())
    type?: PokemonTypeValidation;
}
