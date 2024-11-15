/*
  Warnings:

  - Added the required column `club` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RunnerParticipation" ADD COLUMN     "club" TEXT NOT NULL;
