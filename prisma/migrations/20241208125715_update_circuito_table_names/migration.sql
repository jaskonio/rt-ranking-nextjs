/*
  Warnings:

  - You are about to drop the `LeagueRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LeagueRankingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeagueRanking" DROP CONSTRAINT "LeagueRanking_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRanking" DROP CONSTRAINT "LeagueRanking_participantId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRanking" DROP CONSTRAINT "LeagueRanking_raceId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRankingHistory" DROP CONSTRAINT "LeagueRankingHistory_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRankingHistory" DROP CONSTRAINT "LeagueRankingHistory_participantId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRankingHistory" DROP CONSTRAINT "LeagueRankingHistory_raceId_fkey";

-- DropTable
DROP TABLE "LeagueRanking";

-- DropTable
DROP TABLE "LeagueRankingHistory";

-- CreateTable
CREATE TABLE "LeagueRaceCircuitoRanking" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "realPace" TEXT NOT NULL,
    "top5Finishes" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeagueRaceCircuitoRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueGlobalCircuitoRanking" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "top5Finishes" INTEGER NOT NULL DEFAULT 0,
    "numberParticipantion" INTEGER NOT NULL,
    "bestPosition" INTEGER NOT NULL,
    "bestRealPace" TEXT NOT NULL,

    CONSTRAINT "LeagueGlobalCircuitoRanking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeagueRaceCircuitoRanking" ADD CONSTRAINT "LeagueRaceCircuitoRanking_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRaceCircuitoRanking" ADD CONSTRAINT "LeagueRaceCircuitoRanking_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "LeagueParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRaceCircuitoRanking" ADD CONSTRAINT "LeagueRaceCircuitoRanking_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueGlobalCircuitoRanking" ADD CONSTRAINT "LeagueGlobalCircuitoRanking_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueGlobalCircuitoRanking" ADD CONSTRAINT "LeagueGlobalCircuitoRanking_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "LeagueParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueGlobalCircuitoRanking" ADD CONSTRAINT "LeagueGlobalCircuitoRanking_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
