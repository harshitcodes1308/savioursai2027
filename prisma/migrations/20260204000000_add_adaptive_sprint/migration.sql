-- Production Database Migration: Adaptive Sprint Architecture
-- SAFE: All changes are additive, no data deletion
-- Date: 2026-02-04
-- Description: Add adaptive sprint tables and feature flag

-- Step 1: Add feature flag to existing sprint table
ALTER TABLE "sprint_15_day" 
ADD COLUMN IF NOT EXISTS "useAdaptivePlan" BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Create daily test results table
CREATE TABLE IF NOT EXISTS "daily_test_results" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sprintId" TEXT NOT NULL,
  "dayNumber" INTEGER NOT NULL,
  "subject" TEXT NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "correctAnswers" INTEGER NOT NULL,
  "score" DOUBLE PRECISION NOT NULL,
  "timeSpent" INTEGER NOT NULL,
  "questionResults" JSONB NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "daily_test_results_sprintId_fkey" 
    FOREIGN KEY ("sprintId") REFERENCES "sprint_15_day"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 3: Create unique constraint for daily test results
CREATE UNIQUE INDEX IF NOT EXISTS "daily_test_results_sprintId_dayNumber_subject_key" 
ON "daily_test_results"("sprintId", "dayNumber", "subject");

-- Step 4: Create index for faster queries
CREATE INDEX IF NOT EXISTS "daily_test_results_sprintId_dayNumber_idx" 
ON "daily_test_results"("sprintId", "dayNumber");

-- Step 5: Create chapter performance table
CREATE TABLE IF NOT EXISTS "chapter_performance" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sprintId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "chapter" TEXT NOT NULL,
  "strength" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "attemptsCount" INTEGER NOT NULL DEFAULT 0,
  "lastTested" TIMESTAMP(3),
  "needsReview" BOOLEAN NOT NULL DEFAULT false,
  "priority" INTEGER NOT NULL DEFAULT 100,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "chapter_performance_sprintId_fkey" 
    FOREIGN KEY ("sprintId") REFERENCES "sprint_15_day"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 6: Create unique constraint for chapter performance
CREATE UNIQUE INDEX IF NOT EXISTS "chapter_performance_sprintId_subject_chapter_key" 
ON "chapter_performance"("sprintId", "subject", "chapter");

-- Step 7: Create index for priority-based queries
CREATE INDEX IF NOT EXISTS "chapter_performance_sprintId_priority_idx" 
ON "chapter_performance"("sprintId", "priority");

-- Verification queries (run these to confirm)
-- SELECT COUNT(*) FROM sprint_15_day WHERE "useAdaptivePlan" = true;
-- SELECT COUNT(*) FROM daily_test_results;
-- SELECT COUNT(*) FROM chapter_performance;

-- Rollback script (if needed)
-- ALTER TABLE "sprint_15_day" DROP COLUMN IF EXISTS "useAdaptivePlan";
-- DROP TABLE IF EXISTS "daily_test_results" CASCADE;
-- DROP TABLE IF EXISTS "chapter_performance" CASCADE;
