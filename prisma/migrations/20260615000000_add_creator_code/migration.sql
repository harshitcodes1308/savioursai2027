-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL,
    "creator_name" TEXT NOT NULL,
    "creator_code" TEXT NOT NULL,
    "channel_id" TEXT,
    "discount_percentage" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_creator_code_key" ON "creators"("creator_code");

-- AlterTable
ALTER TABLE "users" ADD COLUMN "creator_code" TEXT;