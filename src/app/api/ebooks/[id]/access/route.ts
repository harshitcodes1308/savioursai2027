import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EBOOK_PREVIEW_PAGES, isEbookId, ownsEbook } from "@/lib/ebook-access";
import { getEbookUrl } from "@/lib/ebook-storage";

// Returns a short-lived link to the full ebook for owners, or to the
// 5-page preview for everyone else who is signed in.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isEbookId(id)) {
    return NextResponse.json({ error: "Unknown ebook" }, { status: 404 });
  }

  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.isDemo
    ? null
    : await prisma.user.findUnique({ where: { id: session.id }, select: { ebooksUnlocked: true, ebooksOwned: true } });
  const owned = ownsEbook(user, id);

  try {
    const url = await getEbookUrl(id, owned ? "full" : "preview");
    return NextResponse.json(
      { mode: owned ? "full" : "preview", url, previewPages: EBOOK_PREVIEW_PAGES },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[ebooks] could not create access link:", error);
    return NextResponse.json({ error: "Ebook storage unavailable" }, { status: 503 });
  }
}
