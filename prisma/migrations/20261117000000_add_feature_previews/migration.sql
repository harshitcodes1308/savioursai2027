CREATE TABLE "feature_previews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_previews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "feature_previews_userId_feature_key" ON "feature_previews"("userId", "feature");
CREATE INDEX "feature_previews_userId_idx" ON "feature_previews"("userId");
CREATE INDEX "feature_previews_expiresAt_idx" ON "feature_previews"("expiresAt");

ALTER TABLE "feature_previews"
ADD CONSTRAINT "feature_previews_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
