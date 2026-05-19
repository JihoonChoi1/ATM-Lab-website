/*
  Warnings:

  - You are about to drop the column `imgPath` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "imgPath";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description";
