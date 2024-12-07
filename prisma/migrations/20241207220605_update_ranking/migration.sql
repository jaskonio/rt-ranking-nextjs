/*
  Warnings:

  - Added the required column `points` to the `RaceBasketClassification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RaceBasketClassification" ADD COLUMN     "points" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "GlobalRaceBasketHistory" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "generalFirst" INTEGER NOT NULL DEFAULT 0,
    "generalSecond" INTEGER NOT NULL DEFAULT 0,
    "generalThird" INTEGER NOT NULL DEFAULT 0,
    "categoryFirst" INTEGER NOT NULL DEFAULT 0,
    "categorySecond" INTEGER NOT NULL DEFAULT 0,
    "categoryThird" INTEGER NOT NULL DEFAULT 0,
    "localFirst" INTEGER NOT NULL DEFAULT 0,
    "localSecond" INTEGER NOT NULL DEFAULT 0,
    "localThird" INTEGER NOT NULL DEFAULT 0,
    "teamsFirst" INTEGER NOT NULL DEFAULT 0,
    "teamsSecond" INTEGER NOT NULL DEFAULT 0,
    "teamsThird" INTEGER NOT NULL DEFAULT 0,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalRaceBasketHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GlobalRaceBasketHistory" ADD CONSTRAINT "GlobalRaceBasketHistory_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalRaceBasketHistory" ADD CONSTRAINT "GlobalRaceBasketHistory_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalRaceBasketHistory" ADD CONSTRAINT "GlobalRaceBasketHistory_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
