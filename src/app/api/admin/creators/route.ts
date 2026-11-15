import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";



/** GET /api/admin/creators — list all */
export async function GET(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const creators = await prisma.creator.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ creators });
}

/** POST /api/admin/creators — create */
export async function POST(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { creatorName, creatorCode, channelId, discountPercentage, revenueSharePercentage } = await req.json();

    if (!creatorName?.trim()) return NextResponse.json({ error: "Creator name is required" }, { status: 400 });
    if (!creatorCode?.trim()) return NextResponse.json({ error: "Creator code is required" }, { status: 400 });
    if (!/^[a-zA-Z0-9]+$/.test(creatorCode)) return NextResponse.json({ error: "Creator code must be alphanumeric only (no spaces/symbols)" }, { status: 400 });
    if (!discountPercentage || discountPercentage < 1 || discountPercentage > 100) return NextResponse.json({ error: "Discount must be 1–100" }, { status: 400 });
    
    const revShare = revenueSharePercentage !== undefined ? Number(revenueSharePercentage) : 20;
    if (isNaN(revShare) || revShare < 0 || revShare > 100) {
        return NextResponse.json({ error: "Revenue share must be between 0 and 100" }, { status: 400 });
    }

    try {
        const creator = await prisma.creator.create({
            data: {
                creatorName: creatorName.trim(),
                creatorCode: creatorCode.trim(),
                channelId: channelId?.trim() || null,
                discountPercentage: Number(discountPercentage),
                revenueSharePercentage: revShare,
            },
        });
        return NextResponse.json({ creator });
    } catch (e: unknown) {
        if (e && typeof e === "object" && "code" in e && e.code === "P2002") return NextResponse.json({ error: `Code "${creatorCode}" is already taken` }, { status: 409 });
        return NextResponse.json({ error: "Failed to create creator" }, { status: 500 });
    }
}

/** PUT /api/admin/creators — update */
export async function PUT(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, creatorName, channelId, discountPercentage, revenueSharePercentage } = await req.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (!creatorName?.trim()) return NextResponse.json({ error: "Creator name is required" }, { status: 400 });
    if (!discountPercentage || discountPercentage < 1 || discountPercentage > 100) return NextResponse.json({ error: "Discount must be 1–100" }, { status: 400 });

    const revShare = revenueSharePercentage !== undefined ? Number(revenueSharePercentage) : 20;
    if (isNaN(revShare) || revShare < 0 || revShare > 100) {
        return NextResponse.json({ error: "Revenue share must be between 0 and 100" }, { status: 400 });
    }

    const creator = await prisma.creator.update({
        where: { id },
        data: {
            creatorName: creatorName.trim(),
            channelId: channelId?.trim() || null,
            discountPercentage: Number(discountPercentage),
            revenueSharePercentage: revShare,
        },
    });
    return NextResponse.json({ creator });
}

/** DELETE /api/admin/creators — delete */
export async function DELETE(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.creator.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
