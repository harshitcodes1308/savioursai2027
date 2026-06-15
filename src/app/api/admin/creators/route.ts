import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function verifyAdmin(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("admin-token")?.value;
        if (!token) return false;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-admin-panel");
        const { payload } = await jwtVerify(token, secret);
        return payload.role === "admin";
    } catch {
        return false;
    }
}

/** GET /api/admin/creators — list all */
export async function GET() {
    if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const creators = await prisma.creator.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ creators });
}

/** POST /api/admin/creators — create */
export async function POST(req: NextRequest) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { creatorName, creatorCode, channelId, discountPercentage } = await req.json();

    if (!creatorName?.trim()) return NextResponse.json({ error: "Creator name is required" }, { status: 400 });
    if (!creatorCode?.trim()) return NextResponse.json({ error: "Creator code is required" }, { status: 400 });
    if (!/^[a-z0-9]+$/.test(creatorCode)) return NextResponse.json({ error: "Creator code must be lowercase alphanumeric only" }, { status: 400 });
    if (!discountPercentage || discountPercentage < 1 || discountPercentage > 100) return NextResponse.json({ error: "Discount must be 1–100" }, { status: 400 });

    try {
        const creator = await prisma.creator.create({
            data: {
                creatorName: creatorName.trim(),
                creatorCode: creatorCode.trim().toLowerCase(),
                channelId: channelId?.trim() || null,
                discountPercentage: Number(discountPercentage),
            },
        });
        return NextResponse.json({ creator });
    } catch (e: any) {
        if (e.code === "P2002") return NextResponse.json({ error: `Code "${creatorCode}" is already taken` }, { status: 409 });
        return NextResponse.json({ error: "Failed to create creator" }, { status: 500 });
    }
}

/** PUT /api/admin/creators — update */
export async function PUT(req: NextRequest) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, creatorName, channelId, discountPercentage } = await req.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (!creatorName?.trim()) return NextResponse.json({ error: "Creator name is required" }, { status: 400 });
    if (!discountPercentage || discountPercentage < 1 || discountPercentage > 100) return NextResponse.json({ error: "Discount must be 1–100" }, { status: 400 });

    const creator = await prisma.creator.update({
        where: { id },
        data: {
            creatorName: creatorName.trim(),
            channelId: channelId?.trim() || null,
            discountPercentage: Number(discountPercentage),
        },
    });
    return NextResponse.json({ creator });
}

/** DELETE /api/admin/creators — delete */
export async function DELETE(req: NextRequest) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.creator.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
