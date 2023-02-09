-- DropForeignKey
ALTER TABLE "Feast" DROP CONSTRAINT "Feast_winnerId_fkey";

-- DropIndex
DROP INDEX "Place_feastId_googleId_key";

-- DropIndex
DROP INDEX "Place_googleId_key";

-- AddForeignKey
ALTER TABLE "Feast" ADD CONSTRAINT "Feast_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
