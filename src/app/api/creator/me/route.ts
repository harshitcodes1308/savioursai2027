import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-creator-panel");
    let token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (token === "undefined" || token === "null") {
      token = undefined;
    }

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("creator-token")?.value;
    }

    if (!token || token === "undefined" || token === "null") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    if (!payload || payload.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creatorCode = payload.creatorCode as string;

    const creator = await prisma.creator.findUnique({
      where: { creatorCode },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json({ creator });
  } catch (e: any) {
    if (e.code === "ERR_JWT_EXPIRED" || e.code === "ERR_JWS_INVALID" || e.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
