/*
  Warnings:

  - You are about to drop the column `end` on the `Feast` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Feast` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Feast` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Place` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `rating` on the `Place` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `ratingsTotal` on the `Place` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `stars` on the `Place` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[googleId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Feast" DROP CONSTRAINT "Feast_herdId_fkey";

-- AlterTable
ALTER TABLE "Feast" DROP COLUMN "end",
DROP COLUMN "start",
DROP COLUMN "winner",
ADD COLUMN     "endDate" DATE,
ADD COLUMN     "startDate" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "winnerId" TEXT;

-- AlterTable
ALTER TABLE "Place" ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "rating" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "ratingsTotal" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "stars" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Place_googleId_key" ON "Place"("googleId");

-- AddForeignKey
ALTER TABLE "Feast" ADD CONSTRAINT "Feast_herdId_fkey" FOREIGN KEY ("herdId") REFERENCES "Herd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feast" ADD CONSTRAINT "Feast_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Place"("googleId") ON DELETE SET NULL ON UPDATE CASCADE;
