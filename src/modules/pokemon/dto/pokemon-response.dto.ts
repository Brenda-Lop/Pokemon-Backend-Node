import { PaginationPayload, PokemonTypes } from "../type/pokemon.type";

export class PokemonResponseDto {
    id: number
    name: string
    types: PokemonTypes[]
    created_at: Date
}

export class PokemonsResponseDto {
    data: PokemonResponseDto[]
    pagination: PaginationPayload
}

