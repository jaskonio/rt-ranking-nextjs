/*
  Warnings:

  - Changed the type of `officialCategoryPosition` on the `RunnerParticipation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `officialGenderPosition` on the `RunnerParticipation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RunnerParticipation" DROP COLUMN "officialCategoryPosition",
ADD COLUMN     "officialCategoryPosition" INTEGER NOT NULL,
DROP COLUMN "officialGenderPosition",
ADD COLUMN     "officialGenderPosition" INTEGER NOT NULL;
