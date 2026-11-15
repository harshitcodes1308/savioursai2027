// Shared (client + server safe) rules for Sidekick ebook access and pricing.
import { EBOOK_SUBJECTS } from "@/data/ebooks-config";

export const EBOOK_SINGLE_PRICE = 49; // ₹ per ebook
export const EBOOK_BUNDLE_PRICE = 299; // ₹ all ebooks (incl. upcoming) + Pro plan
export const EBOOK_PREVIEW_PAGES = 5;

export const EBOOK_SINGLE_PAISE = EBOOK_SINGLE_PRICE * 100;
export const EBOOK_BUNDLE_PAISE = EBOOK_BUNDLE_PRICE * 100;

export const EBOOK_IDS = EBOOK_SUBJECTS.map((s) => s.id);

export function isEbookId(id: unknown): id is string {
  return typeof id === "string" && EBOOK_IDS.includes(id);
}

export interface EbookOwnership {
  /** All-access: ₹299 bundle (or legacy ₹79 purchase / referral). Includes future ebooks. */
  ebooksUnlocked?: boolean | null;
  /** Individually owned ebook ids (₹49 purchases, spin prize). */
  ebooksOwned?: string[] | null;
}

export function ownsEbook(user: EbookOwnership | null | undefined, ebookId: string): boolean {
  if (!user) return false;
  if (user.ebooksUnlocked) return true;
  return (user.ebooksOwned ?? []).includes(ebookId);
}

export function ownedEbookCount(user: EbookOwnership | null | undefined): number {
  if (!user) return 0;
  if (user.ebooksUnlocked) return EBOOK_IDS.length;
  return (user.ebooksOwned ?? []).filter(isEbookId).length;
}

export interface SpinEligibilityInput extends EbookOwnership {
  isDemo?: boolean;
  isPaid?: boolean | null;
  planType?: string | null;
  ebookSpinAt?: Date | string | null;
}

/** One spin per account, for free users who don't already have the full library. */
export function canSpinForEbook(user: SpinEligibilityInput | null | undefined): boolean {
  if (!user || user.isDemo) return false;
  if (user.ebookSpinAt) return false;
  if (user.ebooksUnlocked) return false;
  const paid = !!user.isPaid || user.planType === "PRO" || user.planType === "BUNDLE";
  return !paid;
}

export const EBOOK_BUNDLE_FEATURES = [
  "All 10 Sidekick e-books",
  "Every upcoming Sidekick e-book",
  "Saviours AI Pro plan included",
  "All AI study tools and practice",
];
