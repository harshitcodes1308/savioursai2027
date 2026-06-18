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

    // Parse query parameters
    const url = new URL(req.url);
    const fromStr = url.searchParams.get("from");
    const toStr = url.searchParams.get("to");

    const fromDate = fromStr ? new Date(fromStr) : null;
    const toDate = toStr ? new Date(toStr) : null;

    // Fetch all users signed up with this creator's code
    const users = await prisma.user.findMany({
      where: {
        creatorCode: creator.creatorCode,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Process users to compute purchase date and revenue share
    const processedUsers = users.map((user) => {
      let purchaseDate: Date | null = null;
      let revenueShare = 0;
      let saleAmount = 0;

      const isPaidUser =
        user.isPaid ||
        ((user.planType === "MONTHLY" || user.planType === "YEARLY") &&
          user.subscriptionStatus === "ACTIVE");

      if (isPaidUser && user.subscriptionExpiry) {
        const expiry = new Date(user.subscriptionExpiry);
        if (user.planType === "MONTHLY") {
          purchaseDate = new Date(expiry.getTime() - 30 * 24 * 60 * 60 * 1000);
          saleAmount = 199;
        } else if (user.planType === "YEARLY") {
          purchaseDate = new Date(expiry.getTime() - 365 * 24 * 60 * 60 * 1000);
          saleAmount = 599;
        }

        // If the calculated purchase date is somehow before creation date, cap it to creation date
        if (purchaseDate && purchaseDate.getTime() < user.createdAt.getTime()) {
          purchaseDate = user.createdAt;
        }

        revenueShare = Math.round(saleAmount * (creator.revenueSharePercentage / 100));
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isPaid: isPaidUser,
        planType: isPaidUser ? user.planType : "FREE",
        subscriptionExpiry: user.subscriptionExpiry,
        purchaseDate,
        saleAmount,
        revenueShare,
      };
    });

    // Apply date filters if provided
    const filteredUsers = processedUsers.filter((user) => {
      // Determine the reference date for the filter:
      // if paid, filter by purchase date; if free, filter by signup (createdAt) date.
      const refDate = user.purchaseDate || user.createdAt;

      if (fromDate && refDate.getTime() < fromDate.getTime()) {
        return false;
      }
      if (toDate) {
        // Extend toDate to end of the day (23:59:59.999) to make it inclusive
        const endOfDayToDate = new Date(toDate);
        endOfDayToDate.setHours(23, 59, 59, 999);
        if (refDate.getTime() > endOfDayToDate.getTime()) {
          return false;
        }
      }
      return true;
    });

    // Calculate aggregated stats
    const totalSignups = filteredUsers.length;
    const paidUsers = filteredUsers.filter((u) => u.isPaid);
    const monthlyCount = paidUsers.filter((u) => u.planType === "MONTHLY").length;
    const yearlyCount = paidUsers.filter((u) => u.planType === "YEARLY").length;
    const totalRevenueShare = filteredUsers.reduce((sum, u) => sum + u.revenueShare, 0);

    return NextResponse.json({
      creator,
      stats: {
        totalSignups,
        monthlyCount,
        yearlyCount,
        totalRevenueShare,
      },
      students: filteredUsers,
    });
  } catch (e: any) {
    if (e.code === "ERR_JWT_EXPIRED" || e.code === "ERR_JWS_INVALID" || e.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching creator students:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
