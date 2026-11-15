import { issueSignedToken, presignUrl } from "@vercel/blob";

export type EbookVariant = "full" | "preview";

// Signed links are short-lived; the reader requests a fresh one each time it opens a book.
const LINK_TTL_MS = 30 * 60 * 1000;

export function blobPathname(ebookId: string, variant: EbookVariant): string {
  return `sidekick/${variant}/${ebookId}.pdf`;
}

function blobConfigured(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** Local development without a Blob token reads from ./private-ebooks via an authenticated route. */
export function isLocalEbookStorage(): boolean {
  return !blobConfigured() && process.env.NODE_ENV !== "production";
}

/**
 * Returns a URL the reader can load the PDF from. Callers MUST check the user's
 * entitlement for the requested variant before calling this.
 */
export async function getEbookUrl(ebookId: string, variant: EbookVariant): Promise<string> {
  if (isLocalEbookStorage()) {
    return `/api/ebooks/${ebookId}/file?variant=${variant}`;
  }
  if (!blobConfigured()) {
    throw new Error("Ebook storage is not configured (BLOB_READ_WRITE_TOKEN missing)");
  }
  const pathname = blobPathname(ebookId, variant);
  const validUntil = Date.now() + LINK_TTL_MS;
  const token = await issueSignedToken({ pathname, operations: ["get"], validUntil });
  const { presignedUrl } = await presignUrl(token, { operation: "get", pathname, access: "private", validUntil });
  return presignedUrl;
}
