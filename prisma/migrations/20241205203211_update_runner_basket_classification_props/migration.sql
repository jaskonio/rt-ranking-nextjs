/*
  Warnings:

  - Added the required column `bibNumber` to the `RaceBasketClassification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RaceBasketClassification" ADD COLUMN     "bibNumber" INTEGER NOT NULL;
