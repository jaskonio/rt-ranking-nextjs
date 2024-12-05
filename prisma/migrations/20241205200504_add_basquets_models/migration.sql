-- CreateTable
CREATE TABLE "RaceBasketClassification" (
    "id" SERIAL NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "generalPosition" INTEGER NOT NULL,
    "categoryPosition" INTEGER NOT NULL,
    "localPosition" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "pace" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceBasketClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalRaceBasketClassification" (
    "id" SERIAL NOT NULL,
    "runnerId" INTEGER NOT NULL,
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

    CONSTRAINT "GlobalRaceBasketClassification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalRaceBasketClassification_runnerId_key" ON "GlobalRaceBasketClassification"("runnerId");

-- AddForeignKey
ALTER TABLE "RaceBasketClassification" ADD CONSTRAINT "RaceBasketClassification_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceBasketClassification" ADD CONSTRAINT "RaceBasketClassification_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalRaceBasketClassification" ADD CONSTRAINT "GlobalRaceBasketClassification_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
