/*
  Warnings:

  - The `top5Finishes` column on the `LeagueRanking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LeagueRanking" DROP COLUMN "top5Finishes",
ADD COLUMN     "top5Finishes" BOOLEAN NOT NULL DEFAULT false;
