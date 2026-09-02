/*
  Warnings:

  - You are about to drop the column `degree` on the `Experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "degree";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "graduationYear" DROP DEFAULT;
