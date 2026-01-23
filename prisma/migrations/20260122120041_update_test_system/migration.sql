/*
  Warnings:

  - You are about to drop the column `actualHours` on the `daily_plans` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `daily_plans` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `daily_plans` table. All the data in the column will be lost.
  - You are about to drop the column `tasks` on the `daily_plans` table. All the data in the column will be lost.
  - You are about to drop the column `analysis` on the `test_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `attemptedAt` on the `test_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `test_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `test_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `test_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `timeSpent` on the `test_attempts` table. All the data in the column will be lost.
  - Added the required column `chapterId` to the `daily_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planDate` to the `daily_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `daily_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicName` to the `daily_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `daily_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapters` to the `test_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `test_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questions` to the `test_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `test_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuestions` to the `test_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `test_attempts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "daily_plans" DROP CONSTRAINT "daily_plans_planId_fkey";

-- DropForeignKey
ALTER TABLE "test_attempts" DROP CONSTRAINT "test_attempts_testId_fkey";

-- DropIndex
DROP INDEX "daily_plans_date_idx";

-- DropIndex
DROP INDEX "daily_plans_planId_date_key";

-- DropIndex
DROP INDEX "daily_plans_planId_idx";

-- DropIndex
DROP INDEX "test_attempts_testId_idx";

-- AlterTable
ALTER TABLE "daily_plans" DROP COLUMN "actualHours",
DROP COLUMN "date",
DROP COLUMN "planId",
DROP COLUMN "tasks",
ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
ADD COLUMN     "planDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subjectId" TEXT NOT NULL,
ADD COLUMN     "topicName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test_attempts" DROP COLUMN "analysis",
DROP COLUMN "attemptedAt",
DROP COLUMN "percentage",
DROP COLUMN "score",
DROP COLUMN "testId",
DROP COLUMN "timeSpent",
ADD COLUMN     "chapters" JSONB NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "markedReview" JSONB,
ADD COLUMN     "questions" JSONB NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "totalQuestions" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "answers" DROP NOT NULL;

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "attempted" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "incorrect" INTEGER NOT NULL,
    "unattempted" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "strongChapters" JSONB NOT NULL,
    "weakChapters" JSONB NOT NULL,
    "mistakePatterns" JSONB NOT NULL,
    "timeManagement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_results_attemptId_key" ON "test_results"("attemptId");

-- CreateIndex
CREATE INDEX "test_results_attemptId_idx" ON "test_results"("attemptId");

-- CreateIndex
CREATE INDEX "daily_plans_userId_idx" ON "daily_plans"("userId");

-- CreateIndex
CREATE INDEX "daily_plans_planDate_idx" ON "daily_plans"("planDate");

-- CreateIndex
CREATE INDEX "daily_plans_chapterId_idx" ON "daily_plans"("chapterId");

-- CreateIndex
CREATE INDEX "test_attempts_status_idx" ON "test_attempts"("status");

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
