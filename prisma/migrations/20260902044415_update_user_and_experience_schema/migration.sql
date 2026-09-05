/*
  Warnings:

  - You are about to drop the column `graduationYear` on the `Experience` table. All the data in the column will be lost.
  - Made the column `branch` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Experience_graduationYear_idx";

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "graduationYear";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "graduationYear" INTEGER NOT NULL DEFAULT 2027,
ALTER COLUMN "branch" SET NOT NULL;
