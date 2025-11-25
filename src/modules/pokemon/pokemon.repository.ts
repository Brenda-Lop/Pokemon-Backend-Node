import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, Prisma } from '@prisma/client';
import { UpdatePokemonPartialDto } from './dto/update-pokemon-partial.dto';
import { ListPokemonQueryDto } from './dto/list-pokemon-query.dto';


@Injectable()
export class PokemonRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    // Retrieves all records applying filters from request
    async findAll(query: ListPokemonQueryDto) {

        // Destructuring query params
        const { name, type, orderByDate, orderByName, createdFrom, page = 1, limit = 10 } = query

        // Initialise variables to be used as filter, sorting
        const where: Prisma.PokemonWhereInput = {}
        const orderBy: Prisma.PokemonOrderByWithRelationInput[] = []

        // Build where clause based on provided params
        if (name) where.name = { contains: name }
        if (type) where.type = type
        if (createdFrom) where.created_at = { gte: new Date(createdFrom) }

        // Build orderBy clause based on provided params
        if (orderByDate) orderBy.push({ created_at: orderByDate })
        if (orderByName) orderBy.push({ name: orderByName })

        // Order defaults to ASC by creation date
        if (orderBy.length === 0) orderBy.push({ created_at: 'asc' })

        const totalItems = await this.prisma.pokemon.count({ where })

        // Final query
        const data = await this.prisma.pokemon.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        })

        // Response payload with pagination
        return {
            data,
            pagination: {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                limit
            }
        }
    }

    // Retrieves a record by id
    async findOne(id: number): Promise<Pokemon> {
        return this.ensureExists(id)
    }

    // Creates a new record
    async create(data: CreatePokemonDto) {
        return this.prisma.pokemon.create({
            data
        })
    }

    // Updates an existing record fully or partially
    async update(id: number, data: UpdatePokemonDto | UpdatePokemonPartialDto): Promise<Pokemon> {
        await this.ensureExists(id)

        return this.prisma.pokemon.update({
            where: { id },
            data
        })
    }

    // Deletes a record by id
    async delete(id: number): Promise<void> {
        await this.ensureExists(id)

        await this.prisma.pokemon.delete({ where: { id } })
    }

    // Private function that validates if the record exists and handles excepetion
    private async ensureExists(id: number) {
        const result = await this.prisma.pokemon.findUnique({ where: { id } })

        if (!result) {
            throw new NotFoundException(`Pokémon with id ${id} not found.`)
        }
        return result
    }
}