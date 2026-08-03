ALTER TABLE "users"
  ADD COLUMN "scholarshipDiscountPercentage" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "scholarshipDiscountExpiresAt" TIMESTAMP(3),
  ADD COLUMN "scholarshipTestCompletedAt" TIMESTAMP(3),
  ADD COLUMN "scholarshipScore" INTEGER;

CREATE TABLE "scholarship_attempts" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "questionRefs" JSONB NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "marksScored" INTEGER,
  "totalMarks" INTEGER,
  "discountPercentage" INTEGER,
  CONSTRAINT "scholarship_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "scholarship_attempts_userId_idx" ON "scholarship_attempts"("userId");

ALTER TABLE "scholarship_attempts"
  ADD CONSTRAINT "scholarship_attempts_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
