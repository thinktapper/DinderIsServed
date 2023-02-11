/*
  Warnings:

  - Made the column `startDate` on table `Feast` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Feast" ALTER COLUMN "startDate" SET NOT NULL;
