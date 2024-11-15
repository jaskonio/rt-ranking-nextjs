/*
  Warnings:

  - You are about to drop the column `leagueId` on the `Race` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Race` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Runner` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Runner` table. All the data in the column will be lost.
  - You are about to drop the column `runnerId` on the `RunnerParticipation` table. All the data in the column will be lost.
  - You are about to drop the `League` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LeagueRunner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `platform` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Runner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Runner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LeagueRunner" DROP CONSTRAINT "LeagueRunner_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueRunner" DROP CONSTRAINT "LeagueRunner_runnerId_fkey";

-- DropForeignKey
ALTER TABLE "Race" DROP CONSTRAINT "Race_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "RunnerParticipation" DROP CONSTRAINT "RunnerParticipation_runnerId_fkey";

-- AlterTable
ALTER TABLE "Race" DROP COLUMN "leagueId",
DROP COLUMN "location",
ADD COLUMN     "isProcessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "platform" TEXT NOT NULL,
ADD COLUMN     "processingStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Runner" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RunnerParticipation" DROP COLUMN "runnerId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- DropTable
DROP TABLE "League";

-- DropTable
DROP TABLE "LeagueRunner";

-- CreateTable
CREATE TABLE "RaceProcessingHistory" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "errorDetails" TEXT,

    CONSTRAINT "RaceProcessingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RaceProcessingHistory" ADD CONSTRAINT "RaceProcessingHistory_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
