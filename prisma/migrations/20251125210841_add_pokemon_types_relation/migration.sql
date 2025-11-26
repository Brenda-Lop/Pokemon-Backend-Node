/*
  Warnings:

  - You are about to drop the column `type` on the `pokemons` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_PokemonTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PokemonTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PokemonTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pokemons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_pokemons" ("created_at", "id", "name") SELECT "created_at", "id", "name" FROM "pokemons";
DROP TABLE "pokemons";
ALTER TABLE "new_pokemons" RENAME TO "pokemons";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "types_name_key" ON "types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonTypes_AB_unique" ON "_PokemonTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonTypes_B_index" ON "_PokemonTypes"("B");
