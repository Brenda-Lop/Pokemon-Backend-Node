import { PrismaClient } from '@prisma/client';
import { pokemons } from '../prisma/seed/data/pokemon';

const prisma = new PrismaClient();

async function main() {
  for (const pokemon of pokemons) {
    if (!pokemon.type) continue;

    const type = await prisma.type.upsert({
      where: { name: pokemon.type.toUpperCase() },
      update: {},
      create: {
        name: pokemon.type.toUpperCase(),
      },
    });

    await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: {
        types: {
          connect: { id: type.id },
        },
      },
    });
  }

  console.log('End of script');
}

main().finally(() => prisma.$disconnect());
