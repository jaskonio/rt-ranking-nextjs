/*
  Warnings:

  - You are about to drop the `RankingHistory` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `raceId` on table `LeagueRanking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `realPace` on table `LeagueRanking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LeagueRanking" DROP CONSTRAINT "LeagueRanking_raceId_fkey";

-- DropForeignKey
ALTER TABLE "RankingHistory" DROP CONSTRAINT "RankingHistory_participantId_fkey";

-- AlterTable
ALTER TABLE "LeagueRanking" ALTER COLUMN "raceId" SET NOT NULL,
ALTER COLUMN "realPace" SET NOT NULL;

-- DropTable
DROP TABLE "RankingHistory";

-- CreateTable
CREATE TABLE "LeagueRankingHistory" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "previousPosition" INTEGER NOT NULL,
    "top5Finishes" INTEGER NOT NULL DEFAULT 0,
    "numberParticipantion" INTEGER NOT NULL,
    "bestPosition" INTEGER NOT NULL,
    "bestRealPace" TEXT,

    CONSTRAINT "LeagueRankingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeagueRanking" ADD CONSTRAINT "LeagueRanking_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRankingHistory" ADD CONSTRAINT "LeagueRankingHistory_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRankingHistory" ADD CONSTRAINT "LeagueRankingHistory_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "LeagueParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRankingHistory" ADD CONSTRAINT "LeagueRankingHistory_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
