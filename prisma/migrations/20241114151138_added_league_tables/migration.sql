-- AlterTable
ALTER TABLE "Runner" ADD COLUMN     "photoUrl" TEXT;

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "scoringMethodId" INTEGER NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueParticipant" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "bibNumber" INTEGER NOT NULL,

    CONSTRAINT "LeagueParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueRace" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,

    CONSTRAINT "LeagueRace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueRanking" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "raceId" INTEGER,
    "participantId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "top5Finishes" INTEGER NOT NULL DEFAULT 0,
    "bestRealPace" TEXT,
    "previousPosition" INTEGER,

    CONSTRAINT "LeagueRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingHistory" (
    "id" SERIAL NOT NULL,
    "participantId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "formula" TEXT NOT NULL,
    "primaryAttribute" TEXT NOT NULL,
    "primaryOrder" TEXT NOT NULL,
    "secondaryAttribute" TEXT,
    "secondaryOrder" TEXT,
    "tertiaryAttribute" TEXT,
    "tertiaryOrder" TEXT,
    "pointsDistribution" JSONB NOT NULL,

    CONSTRAINT "ScoringMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_scoringMethodId_fkey" FOREIGN KEY ("scoringMethodId") REFERENCES "ScoringMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueParticipant" ADD CONSTRAINT "LeagueParticipant_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueParticipant" ADD CONSTRAINT "LeagueParticipant_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRace" ADD CONSTRAINT "LeagueRace_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRace" ADD CONSTRAINT "LeagueRace_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRanking" ADD CONSTRAINT "LeagueRanking_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRanking" ADD CONSTRAINT "LeagueRanking_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRanking" ADD CONSTRAINT "LeagueRanking_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "LeagueParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingHistory" ADD CONSTRAINT "RankingHistory_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "LeagueParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
