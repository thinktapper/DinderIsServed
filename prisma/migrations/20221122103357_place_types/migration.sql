/*
  Warnings:

  - The `rating` column on the `places` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ratingsTotal` column on the `places` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "places" ALTER COLUMN "price" SET DATA TYPE TEXT,
DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION,
DROP COLUMN "ratingsTotal",
ADD COLUMN     "ratingsTotal" INTEGER;
