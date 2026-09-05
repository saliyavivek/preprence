/*
  Warnings:

  - You are about to drop the column `branch` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "branch",
ADD COLUMN     "degree" TEXT NOT NULL DEFAULT 'MCA';
