-- Per-ebook ownership (₹49 single purchases and the spin-the-wheel prize)
-- and a once-per-account spin record. `ebooksUnlocked` remains the
-- all-access flag (₹299 bundle, legacy ₹79 purchase, legacy referral).
ALTER TABLE "users"
ADD COLUMN "ebooksOwned" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "ebookSpinAt" TIMESTAMP(3),
ADD COLUMN "ebookSpinPrize" TEXT;
