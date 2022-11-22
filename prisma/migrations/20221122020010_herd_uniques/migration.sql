/*
  Warnings:

  - A unique constraint covering the columns `[id,shepherdId]` on the table `Herd` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Herd_shepherdId_key";

-- CreateIndex
CREATE INDEX "Herd_id_name_idx" ON "Herd"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Herd_id_shepherdId_key" ON "Herd"("id", "shepherdId");
