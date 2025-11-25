import { IsOptional, IsEnum, IsDateString, IsString, Min, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonTypeValidation } from '../enum/pokemon-type.enum';
import { Transform, Type } from 'class-transformer';


export class ListPokemonQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by full or partial name'
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    name?: string

    @ApiPropertyOptional({
        description: 'Filter by type',
        enum: Object.values(PokemonTypeValidation)
    })
    @IsOptional()
    @IsEnum(PokemonTypeValidation, { message: `type must be a valid Pokémon type: ${Object.values(PokemonTypeValidation)}` })
    @Transform(({ value }) => value.toUpperCase())
    type?: PokemonTypeValidation

    @ApiPropertyOptional({
        description: 'Sort by creation date: asc or desc',
        example: 'asc',
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsEnum(['asc', 'desc'] as const)
    orderByDate?: 'asc' | 'desc'

    @ApiPropertyOptional({
        description: 'Sort by name: asc or desc',
        example: 'desc',
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsEnum(['asc', 'desc'] as const)
    orderByName?: 'asc' | 'desc'

    @ApiPropertyOptional({
        description: 'Filter by creation date from (YYYY-MM-DD format)',
        example: '2025-10-01'
    })
    @IsOptional()
    @IsDateString()
    createdFrom?: string

    @ApiPropertyOptional({ description: 'Page number', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1

    @ApiPropertyOptional({ description: 'Items per page', example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10
}
