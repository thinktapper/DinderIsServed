/*
  Warnings:

  - You are about to drop the column `herdId` on the `Feast` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feast" DROP CONSTRAINT "Feast_herdId_fkey";

-- AlterTable
ALTER TABLE "Feast" DROP COLUMN "herdId";
