import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface YouTubeSearchItem {
    videoId: string;
    title: string;
    channelId: string;
    channelTitle: string;
    thumbnail: string;
    publishedAt: string;
}

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    if (!query || query.trim().length < 2) {
        return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.error("YOUTUBE_API_KEY missing");
        return NextResponse.json({ error: "YouTube search not configured" }, { status: 503 });
    }

    try {
        const params = new URLSearchParams({
            part: "snippet",
            q: query.trim(),
            type: "video",
            maxResults: "8",
            key: apiKey,
            relevanceLanguage: "en",
            regionCode: "IN",
        });

        const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
        if (!ytRes.ok) {
            const err = await ytRes.json();
            console.error("YouTube API error:", err);
            return NextResponse.json({ error: "YouTube search failed" }, { status: 502 });
        }

        const ytData = await ytRes.json();
        const videos: YouTubeSearchItem[] = (ytData.items ?? []).map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
            publishedAt: item.snippet.publishedAt,
        }));

        // Fetch creator's channel ID for boosting
        let creatorChannelId: string | null = null;
        let creatorName: string | null = null;
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { creatorCode: true },
        });
        if (dbUser?.creatorCode) {
            const creator = await prisma.creator.findUnique({
                where: { creatorCode: dbUser.creatorCode },
                select: { channelId: true, creatorName: true },
            });
            creatorChannelId = creator?.channelId ?? null;
            creatorName = creator?.creatorName ?? null;
        }

        return NextResponse.json({
            videos,
            creatorChannelId,
            creatorName,
        });
    } catch (error) {
        console.error("YouTube search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
