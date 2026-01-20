-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('NOTE', 'LECTURE', 'SUMMARY', 'COMMON_MISTAKE', 'EXAMPLE');

-- CreateEnum
CREATE TYPE "StudyPlanStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FlashCardDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "RevisionSheetType" AS ENUM ('SHORT_NOTES', 'LAST_DAY', 'SUMMARY');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'TRUE_FALSE');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('PRACTICE', 'SUBJECT_TEST', 'MOCK_EXAM');

-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('SPACED_REPETITION', 'WEAK_TOPIC', 'EXAM_PREP', 'MANUAL');

-- CreateEnum
CREATE TYPE "RevisionPlanType" AS ENUM ('THIRTY_DAY', 'FIFTEEN_DAY', 'SEVEN_DAY');

-- CreateEnum
CREATE TYPE "AiFeature" AS ENUM ('STUDY_PLANNER', 'CONTENT_SUMMARY', 'NOTE_SIMPLIFICATION', 'FLASHCARD_GENERATION', 'REVISION_SHEET', 'DOUBT_SOLVING', 'PERFORMANCE_ANALYSIS', 'PLAN_ADJUSTMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "targetExamDate" TIMESTAMP(3),
    "dailyStudyHours" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_patterns" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "avgTimeSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastStudied" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_performances" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "weakTopics" JSONB NOT NULL,
    "conceptualGaps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_performances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjects" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_checklists" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revision_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plans" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "status" "StudyPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "subjects" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_plans" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "tasks" JSONB NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "actualHours" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_adjustments" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB,
    "color" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flash_cards" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "difficulty" "FlashCardDifficulty",
    "nextReview" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flash_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_sheets" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "RevisionSheetType" NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revision_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "hint" TEXT,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ',
    "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TestType" NOT NULL,
    "questions" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_attempts" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "analysis" JSONB,
    "timeSpent" INTEGER NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_schedules" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "scheduledDate" DATE NOT NULL,
    "type" "RevisionType" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revision_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_plans" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "examDate" DATE NOT NULL,
    "type" "RevisionPlanType" NOT NULL,
    "tasks" JSONB NOT NULL,
    "progress" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revision_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doubt_conversations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT,
    "title" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doubt_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" "AiFeature" NOT NULL,
    "tokens" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE INDEX "learning_patterns_profileId_idx" ON "learning_patterns"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "learning_patterns_profileId_subjectId_key" ON "learning_patterns"("profileId", "subjectId");

-- CreateIndex
CREATE INDEX "test_performances_profileId_idx" ON "test_performances"("profileId");

-- CreateIndex
CREATE INDEX "test_performances_testId_idx" ON "test_performances"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_userId_key" ON "teacher_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE INDEX "chapters_subjectId_idx" ON "chapters"("subjectId");

-- CreateIndex
CREATE INDEX "topics_chapterId_idx" ON "topics"("chapterId");

-- CreateIndex
CREATE INDEX "contents_topicId_idx" ON "contents"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "revision_checklists_topicId_key" ON "revision_checklists"("topicId");

-- CreateIndex
CREATE INDEX "study_plans_studentId_idx" ON "study_plans"("studentId");

-- CreateIndex
CREATE INDEX "daily_plans_planId_idx" ON "daily_plans"("planId");

-- CreateIndex
CREATE INDEX "daily_plans_date_idx" ON "daily_plans"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_plans_planId_date_key" ON "daily_plans"("planId", "date");

-- CreateIndex
CREATE INDEX "plan_adjustments_planId_idx" ON "plan_adjustments"("planId");

-- CreateIndex
CREATE INDEX "notes_studentId_idx" ON "notes"("studentId");

-- CreateIndex
CREATE INDEX "notes_topicId_idx" ON "notes"("topicId");

-- CreateIndex
CREATE INDEX "flash_cards_noteId_idx" ON "flash_cards"("noteId");

-- CreateIndex
CREATE INDEX "revision_sheets_noteId_idx" ON "revision_sheets"("noteId");

-- CreateIndex
CREATE INDEX "question_bank_topicId_idx" ON "question_bank"("topicId");

-- CreateIndex
CREATE INDEX "question_bank_difficulty_idx" ON "question_bank"("difficulty");

-- CreateIndex
CREATE INDEX "tests_createdBy_idx" ON "tests"("createdBy");

-- CreateIndex
CREATE INDEX "test_attempts_testId_idx" ON "test_attempts"("testId");

-- CreateIndex
CREATE INDEX "test_attempts_studentId_idx" ON "test_attempts"("studentId");

-- CreateIndex
CREATE INDEX "revision_schedules_studentId_idx" ON "revision_schedules"("studentId");

-- CreateIndex
CREATE INDEX "revision_schedules_topicId_idx" ON "revision_schedules"("topicId");

-- CreateIndex
CREATE INDEX "revision_schedules_scheduledDate_idx" ON "revision_schedules"("scheduledDate");

-- CreateIndex
CREATE INDEX "revision_plans_studentId_idx" ON "revision_plans"("studentId");

-- CreateIndex
CREATE INDEX "revision_plans_examDate_idx" ON "revision_plans"("examDate");

-- CreateIndex
CREATE INDEX "doubt_conversations_studentId_idx" ON "doubt_conversations"("studentId");

-- CreateIndex
CREATE INDEX "doubt_conversations_topicId_idx" ON "doubt_conversations"("topicId");

-- CreateIndex
CREATE INDEX "ai_usage_logs_userId_idx" ON "ai_usage_logs"("userId");

-- CreateIndex
CREATE INDEX "ai_usage_logs_timestamp_idx" ON "ai_usage_logs"("timestamp");

-- CreateIndex
CREATE INDEX "ai_usage_logs_feature_idx" ON "ai_usage_logs"("feature");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_patterns" ADD CONSTRAINT "learning_patterns_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_patterns" ADD CONSTRAINT "learning_patterns_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_performances" ADD CONSTRAINT "test_performances_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_performances" ADD CONSTRAINT "test_performances_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_checklists" ADD CONSTRAINT "revision_checklists_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_adjustments" ADD CONSTRAINT "plan_adjustments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_cards" ADD CONSTRAINT "flash_cards_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_sheets" ADD CONSTRAINT "revision_sheets_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_schedules" ADD CONSTRAINT "revision_schedules_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_schedules" ADD CONSTRAINT "revision_schedules_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_plans" ADD CONSTRAINT "revision_plans_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doubt_conversations" ADD CONSTRAINT "doubt_conversations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doubt_conversations" ADD CONSTRAINT "doubt_conversations_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage_logs" ADD CONSTRAINT "ai_usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
