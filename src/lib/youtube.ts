import { google } from "googleapis";

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

// Hardcoded channel IDs - guaranteed accurate
const CHANNEL_IDS = {
    clarifyKnowledge: "UCTTQ9EBEG9LwQdgRKq_vBMw",
    icseSaviours: "UCJdP8bdR35e0K0rJYnkNvFg",
};

// In-memory cache for YouTube search results
interface CacheEntry {
    videos: YouTubeVideo[];
    timestamp: number;
}

const videoCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    url: string;
}

/**
 * Search for videos on both channels relevant to a topic
 */
export async function searchRelevantVideos(
    topic: string,
    subject?: string
): Promise<YouTubeVideo[]> {
    try {
        console.log("🔍 Searching videos for:", topic, subject);

        // OPTIMIZATION: Check cache first
        const cacheKey = `${topic.toLowerCase()}-${subject?.toLowerCase() || 'all'}`;
        const cached = videoCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log("✅ Cache HIT! Returning cached videos for:", cacheKey);
            console.log(`⚡ Saved 200 YouTube API quota units`);
            return cached.videos;
        }

        console.log("❌ Cache MISS. Fetching fresh videos...");

        // SMART KEYWORD EXTRACTION
        const keywords = {
            oneshot: /one[\s-]?shot|crash\s*course|complete|full/gi.test(topic),
            revision: /revision|quick|summary|review/gi.test(topic),
            hours24: /24\s*(hours?|hrs?)|last[\s-]?minute|urgent/gi.test(topic),
            fullSyllabus: /full\s*syllabus|entire|complete\s*syllabus|all\s*chapters/gi.test(topic),
        };

        // Extract core topic (remove request words but KEEP important keywords)
        let cleanTopic = topic
            .replace(/suggest|give|show|me|please|video|on|for|about|the|a|an|can\s*you/gi, "")
            .trim();

        // Build SMART search query with priority keywords
        let searchQuery = "";

        if (keywords.fullSyllabus) {
            searchQuery = `full syllabus ICSE class 10 ${subject || ""}`.trim();
        } else if (keywords.oneshot && keywords.hours24) {
            searchQuery = `oneshot 24 hours ${cleanTopic} ${subject || ""} ICSE class 10`.trim();
        } else if (keywords.oneshot) {
            searchQuery = `oneshot ${cleanTopic} ${subject || ""} ICSE class 10`.trim();
        } else if (keywords.revision) {
            searchQuery = `revision ${cleanTopic} ${subject || ""} ICSE class 10`.trim();
        } else {
            searchQuery = `${cleanTopic} ${subject || ""} ICSE class 10`.trim();
        }

        console.log("📝 Smart search query:", searchQuery);
        console.log("🎯 Detected keywords:", keywords);

        // Search both channels with hardcoded channel IDs
        const [clarifyVideos, icseSavioursVideos] = await Promise.all([
            searchChannel(CHANNEL_IDS.clarifyKnowledge, searchQuery, "Clarify Knowledge"),
            searchChannel(CHANNEL_IDS.icseSaviours, searchQuery, "ICSE Saviours"),
        ]);

        console.log("📊 Videos found:", {
            clarifyKnowledge: clarifyVideos.length,
            icseSaviours: icseSavioursVideos.length,
        });

        // Prioritized selection: 1 from Clarify, 1 from ICSE Saviours, 1 from either
        const selectedVideos: YouTubeVideo[] = [];

        // 1. First video from Clarify Knowledge (if available)
        if (clarifyVideos.length > 0) {
            selectedVideos.push(clarifyVideos[0]);
        }

        // 2. First video from ICSE Saviours (if available)
        if (icseSavioursVideos.length > 0) {
            selectedVideos.push(icseSavioursVideos[0]);
        }

        // 3. One more from whichever has more videos (if we have less than 3)
        if (selectedVideos.length < 3) {
            if (clarifyVideos.length > 1) {
                selectedVideos.push(clarifyVideos[1]);
            } else if (icseSavioursVideos.length > 1) {
                selectedVideos.push(icseSavioursVideos[1]);
            }
        }

        if (selectedVideos.length === 0) {
            console.log("⚠️ No videos found - try adjusting search terms");
        }

        // OPTIMIZATION: Store in cache for future requests
        videoCache.set(cacheKey, {
            videos: selectedVideos,
            timestamp: Date.now()
        });
        console.log("💾 Cached videos for:", cacheKey);

        console.log("✅ Returning videos:", selectedVideos.length);
        return selectedVideos;
    } catch (error) {
        console.error("❌ YouTube search error:", error);
        return []; // Return empty array instead of throwing - AI will still work
    }
}

/**
 * Search a specific channel for videos
 */
async function searchChannel(
    channelId: string,
    query: string,
    channelName: string,
    retries = 2
): Promise<YouTubeVideo[]> {
    if (!channelId) {
        console.log(`⚠️ No channel ID for ${channelName}`);
        return [];
    }

    try {
        console.log(`🎬 Searching ${channelName} (${channelId}) with query:`, query);

        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            channelId: channelId, // Filter by actual channel ID
            type: ["video"],
            maxResults: 10, // Get more results for better relevance
            order: "relevance",
            relevanceLanguage: "en",
            safeSearch: "strict",
        });

        console.log(`📡 API Response for ${channelName}:`, {
            totalResults: response.data.pageInfo?.totalResults,
            itemsReturned: response.data.items?.length || 0,
        });

        if (!response.data.items) {
            console.log(`⚠️ No items returned for ${channelName}`);
            return [];
        }

        const videos = response.data.items
            .filter((item) => item.id?.videoId && item.snippet)
            .map((item) => ({
                videoId: item.id!.videoId!,
                title: item.snippet!.title || "",
                description: item.snippet!.description || "",
                thumbnail: item.snippet!.thumbnails?.high?.url || item.snippet!.thumbnails?.medium?.url || "",
                channelTitle: item.snippet!.channelTitle || channelName,
                publishedAt: item.snippet!.publishedAt || "",
                url: `https://www.youtube.com/watch?v=${item.id!.videoId}`,
            }));

        console.log(`✨ Processed ${videos.length} videos from ${channelName}`);
        return videos;
    } catch (error: any) {
        // Retry on network errors
        if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND')) {
            console.log(`🔄 Retrying ${channelName} (${retries} attempts left)...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            return searchChannel(channelId, query, channelName, retries - 1);
        }

        console.error(`❌ Error searching ${channelName}:`, error.message || error);
        return []; // Return empty array instead of throwing
    }
}

/**
 * Get channel ID from channel handle
 */
async function getChannelIdFromHandle(handle: string): Promise<string | null> {
    try {
        console.log(`🔍 Fetching channel ID for ${handle}`);
        const response = await youtube.search.list({
            part: ["snippet"],
            q: handle,
            type: ["channel"],
            maxResults: 1,
        });

        const channelId = response.data.items?.[0]?.id?.channelId || null;
        console.log(`✅ Channel ID for ${handle}:`, channelId);
        return channelId;
    } catch (error) {
        console.error(`❌ Error getting channel ID for ${handle}:`, error);
        return null;
    }
}
