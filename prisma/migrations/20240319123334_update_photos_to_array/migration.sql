/*
  Warnings:

  - The `photos` column on the `projcts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "projcts" DROP COLUMN "photos",
ADD COLUMN     "photos" TEXT[];
