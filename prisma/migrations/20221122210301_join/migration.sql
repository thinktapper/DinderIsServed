/*
  Warnings:

  - You are about to drop the column `shepherdId` on the `Herd` table. All the data in the column will be lost.
  - You are about to drop the `_herds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feasts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `votes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'SHEPHERD', 'ORGANIZER');

-- DropForeignKey
ALTER TABLE "Herd" DROP CONSTRAINT "Herd_shepherdId_fkey";

-- DropForeignKey
ALTER TABLE "_herds" DROP CONSTRAINT "_herds_A_fkey";

-- DropForeignKey
ALTER TABLE "_herds" DROP CONSTRAINT "_herds_B_fkey";

-- DropForeignKey
ALTER TABLE "feasts" DROP CONSTRAINT "feasts_herdId_fkey";

-- DropForeignKey
ALTER TABLE "feasts" DROP CONSTRAINT "feasts_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "feasts" DROP CONSTRAINT "feasts_winnerId_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_feastId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_placeId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_userId_fkey";

-- DropIndex
DROP INDEX "Herd_id_name_idx";

-- DropIndex
DROP INDEX "Herd_id_shepherdId_key";

-- AlterTable
ALTER TABLE "Herd" DROP COLUMN "shepherdId";

-- DropTable
DROP TABLE "_herds";

-- DropTable
DROP TABLE "feasts";

-- DropTable
DROP TABLE "places";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "votes";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HerdMembership" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL,
    "herdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HerdMembership_pkey" PRIMARY KEY ("herdId","userId")
);

-- CreateTable
CREATE TABLE "HerdInvite" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviteToken" TEXT,
    "inviterId" TEXT NOT NULL,
    "invitedHerdId" TEXT NOT NULL,
    "inviteeEmail" TEXT,

    CONSTRAINT "HerdInvite_pkey" PRIMARY KEY ("inviterId","invitedHerdId")
);

-- CreateTable
CREATE TABLE "Feast" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "start" VARCHAR(255),
    "end" VARCHAR(255),
    "closed" BOOLEAN DEFAULT false,
    "location" JSONB NOT NULL,
    "radius" INTEGER NOT NULL,
    "herdId" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "winner" TEXT,

    CONSTRAINT "Feast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "googleId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "price" TEXT,
    "rating" TEXT,
    "ratingsTotal" TEXT,
    "stars" TEXT,
    "photos" TEXT[],
    "feastId" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voteType" "VoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "feastId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "HerdMembership_userId_role_idx" ON "HerdMembership"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "HerdInvite_inviteToken_key" ON "HerdInvite"("inviteToken");

-- AddForeignKey
ALTER TABLE "HerdMembership" ADD CONSTRAINT "HerdMembership_herdId_fkey" FOREIGN KEY ("herdId") REFERENCES "Herd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HerdMembership" ADD CONSTRAINT "HerdMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HerdInvite" ADD CONSTRAINT "HerdInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HerdInvite" ADD CONSTRAINT "HerdInvite_invitedHerdId_fkey" FOREIGN KEY ("invitedHerdId") REFERENCES "Herd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feast" ADD CONSTRAINT "Feast_herdId_fkey" FOREIGN KEY ("herdId") REFERENCES "Herd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feast" ADD CONSTRAINT "Feast_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_feastId_fkey" FOREIGN KEY ("feastId") REFERENCES "Feast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_feastId_fkey" FOREIGN KEY ("feastId") REFERENCES "Feast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
