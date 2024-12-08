/*
  Warnings:

  - You are about to drop the column `raceId` on the `LeagueGlobalCircuitoRanking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeagueGlobalCircuitoRanking" DROP CONSTRAINT "LeagueGlobalCircuitoRanking_raceId_fkey";

-- AlterTable
ALTER TABLE "LeagueGlobalCircuitoRanking" DROP COLUMN "raceId";
