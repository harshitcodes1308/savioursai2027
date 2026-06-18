-- AlterTable
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "revenue_share_percentage" INTEGER NOT NULL DEFAULT 20;
