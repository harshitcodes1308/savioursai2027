import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username (Channel Name) and password required" },
        { status: 400 }
      );
    }

    if (password !== "creator@123") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Find creator matching the creatorName case-insensitively
    const creator = await prisma.creator.findFirst({
      where: {
        creatorName: {
          equals: username.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator account not found" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-creator-panel");

    const token = await new SignJWT({
      id: creator.id,
      creatorName: creator.creatorName,
      creatorCode: creator.creatorCode,
      role: "creator",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    const res = NextResponse.json({
      success: true,
      token,
      creator: {
        id: creator.id,
        creatorName: creator.creatorName,
        creatorCode: creator.creatorCode,
        discountPercentage: creator.discountPercentage,
        revenueSharePercentage: creator.revenueSharePercentage,
      },
    });

    res.headers.append(
      "Set-Cookie",
      `creator-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
    );

    return res;
  } catch (e: any) {
    console.error("Creator login error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
