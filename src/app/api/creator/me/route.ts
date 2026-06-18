import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-creator-panel");
    let token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("creator-token")?.value;
    }

    if (!token) {
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
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
