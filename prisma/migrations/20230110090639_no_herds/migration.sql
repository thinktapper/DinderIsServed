/*
  Warnings:

  - You are about to drop the `Herd` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HerdInvite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HerdMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HerdInvite" DROP CONSTRAINT "HerdInvite_invitedHerdId_fkey";

-- DropForeignKey
ALTER TABLE "HerdInvite" DROP CONSTRAINT "HerdInvite_inviterId_fkey";

-- DropForeignKey
ALTER TABLE "HerdMembership" DROP CONSTRAINT "HerdMembership_herdId_fkey";

-- DropForeignKey
ALTER TABLE "HerdMembership" DROP CONSTRAINT "HerdMembership_userId_fkey";

-- DropTable
DROP TABLE "Herd";

-- DropTable
DROP TABLE "HerdInvite";

-- DropTable
DROP TABLE "HerdMembership";
