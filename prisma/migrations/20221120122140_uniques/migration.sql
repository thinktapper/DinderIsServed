/*
  Warnings:

  - A unique constraint covering the columns `[id,organizerId]` on the table `Feast` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,shepherdId]` on the table `Herd` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,feastId,googleId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId,placeId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Feast_id_organizerId_key" ON "Feast"("id", "organizerId");

-- CreateIndex
CREATE UNIQUE INDEX "Herd_id_shepherdId_key" ON "Herd"("id", "shepherdId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_id_feastId_googleId_key" ON "Place"("id", "feastId", "googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_id_userId_placeId_key" ON "Vote"("id", "userId", "placeId");
