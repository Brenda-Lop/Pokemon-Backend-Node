import { Pokemon as PrismaPokemon } from "@prisma/client";
import { PokemonResponseDto } from "../dto/pokemon-response.dto";
import { MapperResponse } from "../type/pokemon.type";
import { Pokemon as ApplicationPokemon } from "../entity/pokemon.entity";

export function toPrismaCreateData(data: ApplicationPokemon): MapperResponse {
    return {
        name: data.name,
        type: data.type,
    };
}

export function toPrismaUpdateData(data: ApplicationPokemon): MapperResponse {
    return {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
    };
}

// Transforms Prisma data to Application Dto
export function toApplicationPokemonDto(entity: PrismaPokemon): PokemonResponseDto {
    return {
        id: entity.id,
        name: entity.name,
        type: entity.type,
        createdAt: entity.created_at,
    };
}

