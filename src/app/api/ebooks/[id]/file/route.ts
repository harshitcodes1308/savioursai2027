import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isEbookId, ownsEbook } from "@/lib/ebook-access";
import { isLocalEbookStorage } from "@/lib/ebook-storage";

// Local development only: serves PDFs from ./private-ebooks when no Blob store
// is configured. Production always uses signed private Blob links.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isLocalEbookStorage()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { id } = await params;
  const variant = new URL(req.url).searchParams.get("variant") === "full" ? "full" : "preview";
  if (!isEbookId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (variant === "full") {
    const user = session.isDemo
      ? null
      : await prisma.user.findUnique({ where: { id: session.id }, select: { ebooksUnlocked: true, ebooksOwned: true } });
    if (!ownsEbook(user, id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const file = await readFile(path.join(process.cwd(), "private-ebooks", variant, `${id}.pdf`));
  return new NextResponse(new Uint8Array(file), {
    headers: { "Content-Type": "application/pdf", "Cache-Control": "private, no-store" },
  });
}
