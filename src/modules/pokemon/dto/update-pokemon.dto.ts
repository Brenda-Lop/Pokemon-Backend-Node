import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';
import { Transform } from 'class-transformer';


export class UpdatePokemonDto {
    @ApiProperty({
        description: 'The name of the Pokémon',
        example: 'pikachu',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    name: string

    @ApiProperty({
        description: 'The type element of the Pokémon',
        example: 'BUG',
        enum: Object.values(PokemonTypeValidation),
        required: true
    })
    @IsArray()
    @IsEnum(PokemonTypeValidation, {
        each: true,
        message: `type must be a valid Pokémon type: ${Object.values(PokemonTypeValidation)}`
    })
    @Transform(({ value }) => // Follow the existing formatting for types (uppercase)
        Array.isArray(value)
            ? value.map(v => String(v).toUpperCase())
            : [String(value).toUpperCase()]
    )
    types: PokemonTypeValidation[]
}
