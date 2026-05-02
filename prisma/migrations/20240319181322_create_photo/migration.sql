/*
  Warnings:

  - Added the required column `photos` to the `ProjectPhotos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectPhotos" ADD COLUMN     "photos" TEXT NOT NULL;
