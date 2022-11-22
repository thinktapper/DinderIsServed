-- DropForeignKey
ALTER TABLE "Herd" DROP CONSTRAINT "Herd_shepherdId_fkey";

-- DropForeignKey
ALTER TABLE "feasts" DROP CONSTRAINT "feasts_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_feastId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_placeId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_userId_fkey";

-- AddForeignKey
ALTER TABLE "feasts" ADD CONSTRAINT "feasts_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Herd" ADD CONSTRAINT "Herd_shepherdId_fkey" FOREIGN KEY ("shepherdId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_feastId_fkey" FOREIGN KEY ("feastId") REFERENCES "feasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;
