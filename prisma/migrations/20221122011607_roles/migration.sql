/*
  Warnings:

  - A unique constraint covering the columns `[shepherdId]` on the table `Herd` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Herd_id_shepherdId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Herd_shepherdId_key" ON "Herd"("shepherdId");
