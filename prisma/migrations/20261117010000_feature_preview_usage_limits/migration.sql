ALTER TABLE "feature_previews"
ALTER COLUMN "expiresAt" DROP NOT NULL,
ADD COLUMN "used" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastUsedAt" TIMESTAMP(3);

-- The previous release briefly created timer previews. They do not count
-- toward the corrected action/content allowances.
UPDATE "feature_previews" SET "expiresAt" = NULL, "used" = 0;
