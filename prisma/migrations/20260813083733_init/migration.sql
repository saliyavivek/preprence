-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('selected', 'rejected', 'not_disclosed');

-- CreateEnum
CREATE TYPE "ExperienceStatus" AS ENUM ('draft', 'pending_review', 'published', 'rejected');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "RoundType" AS ENUM ('aptitude', 'online_assessment', 'coding', 'technical', 'managerial', 'hr', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "degree" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "verdict" "Verdict",
    "overallTips" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" "ExperienceStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" UUID NOT NULL,
    "experienceId" UUID NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "roundType" "RoundType" NOT NULL,
    "difficulty" "Difficulty",
    "questionsAsked" TEXT,
    "durationMinutes" INTEGER,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" UUID NOT NULL,
    "experienceId" UUID NOT NULL,
    "proofUrl" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Experience_companyId_idx" ON "Experience"("companyId");

-- CreateIndex
CREATE INDEX "Experience_authorId_idx" ON "Experience"("authorId");

-- CreateIndex
CREATE INDEX "Experience_status_idx" ON "Experience"("status");

-- CreateIndex
CREATE INDEX "Experience_graduationYear_idx" ON "Experience"("graduationYear");

-- CreateIndex
CREATE UNIQUE INDEX "Round_experienceId_roundNumber_key" ON "Round"("experienceId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_experienceId_key" ON "Verification"("experienceId");

-- CreateIndex
CREATE INDEX "Verification_status_idx" ON "Verification"("status");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
