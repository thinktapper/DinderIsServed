/*
  Warnings:

  - Made the column `endDate` on table `Feast` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Feast" ADD COLUMN     "image" TEXT,
ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(3);
