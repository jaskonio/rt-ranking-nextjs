/*
  Warnings:

  - Made the column `description` on table `ScoringMethod` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ScoringMethod" ALTER COLUMN "description" SET NOT NULL;
