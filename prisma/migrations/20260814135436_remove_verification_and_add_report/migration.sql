/*
  Warnings:

  - The values [pending_review,rejected] on the enum `ExperienceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExperienceStatus_new" AS ENUM ('draft', 'published', 'taken_down');
ALTER TABLE "public"."Experience" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Experience" ALTER COLUMN "status" TYPE "ExperienceStatus_new" USING ("status"::text::"ExperienceStatus_new");
ALTER TYPE "ExperienceStatus" RENAME TO "ExperienceStatus_old";
ALTER TYPE "ExperienceStatus_new" RENAME TO "ExperienceStatus";
DROP TYPE "public"."ExperienceStatus_old";
ALTER TABLE "Experience" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_experienceId_fkey";

-- DropTable
DROP TABLE "Verification";

-- DropEnum
DROP TYPE "VerificationStatus";

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "experienceId" UUID NOT NULL,
    "reportedById" UUID NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_experienceId_idx" ON "Report"("experienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_experienceId_reportedById_key" ON "Report"("experienceId", "reportedById");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
