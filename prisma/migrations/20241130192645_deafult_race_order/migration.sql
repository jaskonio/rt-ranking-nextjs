/*
  Warnings:

  - Made the column `disqualified_at_race_order` on table `LeagueParticipant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LeagueParticipant" ALTER COLUMN "disqualified_at_race_order" SET NOT NULL,
ALTER COLUMN "disqualified_at_race_order" SET DEFAULT 9999;
