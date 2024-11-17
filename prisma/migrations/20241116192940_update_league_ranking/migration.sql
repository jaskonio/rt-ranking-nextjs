/*
  Warnings:

  - You are about to drop the column `bestRealPace` on the `LeagueRanking` table. All the data in the column will be lost.
  - You are about to drop the column `previousPosition` on the `LeagueRanking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LeagueRanking" DROP COLUMN "bestRealPace",
DROP COLUMN "previousPosition",
ADD COLUMN     "realPace" TEXT;
