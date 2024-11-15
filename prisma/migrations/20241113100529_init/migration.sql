-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runner" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Runner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueRunner" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "top5Count" INTEGER NOT NULL DEFAULT 0,
    "prevPosition" INTEGER,

    CONSTRAINT "LeagueRunner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "leagueId" INTEGER,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunnerParticipation" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "bibNumber" INTEGER NOT NULL,
    "realPosition" INTEGER NOT NULL,
    "realTime" TEXT NOT NULL,
    "realPace" TEXT NOT NULL,
    "officialPosition" INTEGER NOT NULL,
    "officialTime" TEXT NOT NULL,
    "officialPace" TEXT NOT NULL,
    "categoryPosition" INTEGER NOT NULL,
    "genderPosition" INTEGER NOT NULL,

    CONSTRAINT "RunnerParticipation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeagueRunner" ADD CONSTRAINT "LeagueRunner_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRunner" ADD CONSTRAINT "LeagueRunner_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunnerParticipation" ADD CONSTRAINT "RunnerParticipation_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunnerParticipation" ADD CONSTRAINT "RunnerParticipation_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
