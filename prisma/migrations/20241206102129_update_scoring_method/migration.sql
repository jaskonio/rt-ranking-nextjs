/*
  Warnings:

  - You are about to drop the column `formula` on the `ScoringMethod` table. All the data in the column will be lost.
  - You are about to drop the column `primaryAttribute` on the `ScoringMethod` table. All the data in the column will be lost.
  - You are about to drop the column `primaryOrder` on the `ScoringMethod` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryAttribute` on the `ScoringMethod` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryOrder` on the `ScoringMethod` table. All the data in the column will be lost.
  - You are about to drop the column `tertiaryAttribute` on the `ScoringMethod` table. All the data in the column will be lost.
  - You are about to drop the column `tertiaryOrder` on the `ScoringMethod` table. All the data in the column will be lost.
  - Added the required column `modelType` to the `ScoringMethod` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('CIRCUITO', 'BASKET');

-- CreateEnum
CREATE TYPE "SortOrder" AS ENUM ('ASC', 'DESC');

-- AlterTable
ALTER TABLE "ScoringMethod" DROP COLUMN "formula",
DROP COLUMN "primaryAttribute",
DROP COLUMN "primaryOrder",
DROP COLUMN "secondaryAttribute",
DROP COLUMN "secondaryOrder",
DROP COLUMN "tertiaryAttribute",
DROP COLUMN "tertiaryOrder",
ADD COLUMN     "modelType" "ModelType" NOT NULL;

-- CreateTable
CREATE TABLE "SortingAttribute" (
    "id" SERIAL NOT NULL,
    "methodId" INTEGER NOT NULL,
    "attribute" TEXT NOT NULL,
    "order" "SortOrder" NOT NULL,
    "priorityLevel" INTEGER NOT NULL,

    CONSTRAINT "SortingAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SortingAttribute" ADD CONSTRAINT "SortingAttribute_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ScoringMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
