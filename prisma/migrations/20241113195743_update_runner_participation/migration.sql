/*
  Warnings:

  - You are about to drop the column `categoryPosition` on the `RunnerParticipation` table. All the data in the column will be lost.
  - You are about to drop the column `genderPosition` on the `RunnerParticipation` table. All the data in the column will be lost.
  - Added the required column `finished` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialCategoryPosition` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialGenderPosition` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realCategoryPosition` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realGenderPosition` to the `RunnerParticipation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RunnerParticipation" DROP COLUMN "categoryPosition",
DROP COLUMN "genderPosition",
ADD COLUMN     "finished" BOOLEAN NOT NULL,
ADD COLUMN     "officialCategoryPosition" TEXT NOT NULL,
ADD COLUMN     "officialGenderPosition" TEXT NOT NULL,
ADD COLUMN     "realCategoryPosition" INTEGER NOT NULL,
ADD COLUMN     "realGenderPosition" INTEGER NOT NULL;
