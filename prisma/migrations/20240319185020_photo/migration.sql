/*
  Warnings:

  - Changed the type of `photos` on the `ProjectPhotos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ProjectPhotos" DROP COLUMN "photos",
ADD COLUMN     "photos" BYTEA NOT NULL;
