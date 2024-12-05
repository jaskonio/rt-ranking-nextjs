/*
  Warnings:

  - Added the required column `leagueId` to the `GlobalRaceBasketClassification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeagueType" AS ENUM ('CIRCUITO', 'BASKET');

-- DropIndex
DROP INDEX "GlobalRaceBasketClassification_runnerId_key";

-- AlterTable
ALTER TABLE "GlobalRaceBasketClassification" ADD COLUMN     "leagueId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "League" ADD COLUMN     "type" "LeagueType" NOT NULL DEFAULT 'CIRCUITO';

-- AddForeignKey
ALTER TABLE "GlobalRaceBasketClassification" ADD CONSTRAINT "GlobalRaceBasketClassification_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
