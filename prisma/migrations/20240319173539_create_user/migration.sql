/*
  Warnings:

  - You are about to drop the column `photos` on the `projcts` table. All the data in the column will be lost.
  - Added the required column `projectCategoryId` to the `projcts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projcts" DROP COLUMN "photos",
ADD COLUMN     "projectCategoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProjectPhotos" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectPhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projcts" ADD CONSTRAINT "projcts_projectCategoryId_fkey" FOREIGN KEY ("projectCategoryId") REFERENCES "ProjectCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPhotos" ADD CONSTRAINT "ProjectPhotos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projcts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
