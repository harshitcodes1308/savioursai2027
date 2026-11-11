ALTER TABLE "users"
ADD COLUMN "ebooksUnlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ebooksUnlockedAt" TIMESTAMP(3),
ADD COLUMN "ebooksUnlockSource" TEXT,
ADD COLUMN "referralCode" TEXT,
ADD COLUMN "referredById" TEXT,
ADD COLUMN "referralQualifiedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");
CREATE INDEX "users_referredById_idx" ON "users"("referredById");

ALTER TABLE "users"
ADD CONSTRAINT "users_referredById_fkey"
FOREIGN KEY ("referredById") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
