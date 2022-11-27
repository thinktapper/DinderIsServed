/*
  Warnings:

  - A unique constraint covering the columns `[feastId,googleId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Place_feastId_googleId_key" ON "Place"("feastId", "googleId");
