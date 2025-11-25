import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
    @Transform(({ value }) => value.toLowerCase()) // Follow the existing formatting for names
    name: string

    @ApiProperty({
        description: 'The type element of the Pokémon',
        example: 'FIRE',
        enum: Object.values(PokemonTypeValidation),
        required: true
    })
    @IsEnum(PokemonTypeValidation, { message: `type must be a valid Pokémon type: ${Object.values(PokemonTypeValidation)}` })
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase()) // Follow the existing formatting for types
    type: string
}
