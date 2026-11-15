import "server-only";

export type InstagramAudience = {
  configured: boolean;
  followers: number | null;
  username: string;
  updatedAt: string;
  error?: string;
};

export async function getInstagramAudience(): Promise<InstagramAudience> {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const fallbackUsername = process.env.INSTAGRAM_USERNAME?.replace(/^@/, "") ?? "";
  const updatedAt = new Date().toISOString();
  if (!userId || !accessToken) return { configured: false, followers: null, username: fallbackUsername, updatedAt };

  try {
    const baseUrl = (process.env.INSTAGRAM_GRAPH_BASE_URL ?? "https://graph.instagram.com").replace(/\/$/, "");
    const version = process.env.INSTAGRAM_GRAPH_VERSION ?? "v27.0";
    const url = new URL(`${baseUrl}/${version}/${encodeURIComponent(userId)}`);
    url.searchParams.set("fields", "id,username,followers_count");
    url.searchParams.set("access_token", accessToken);
    const response = await fetch(url, { next: { revalidate: 900 }, signal: AbortSignal.timeout(7_000) });
    if (!response.ok) throw new Error(`Meta API returned ${response.status}`);
    const payload = await response.json() as { username?: string; followers_count?: number };
    if (!Number.isFinite(payload.followers_count)) throw new Error("Meta API did not return followers_count");
    return { configured: true, followers: payload.followers_count!, username: payload.username ?? fallbackUsername, updatedAt };
  } catch (error) {
    console.error("[instagram-audience] Fetch failed", error instanceof Error ? error.message : "Unknown error");
    return { configured: true, followers: null, username: fallbackUsername, updatedAt, error: "Follower count is temporarily unavailable" };
  }
}
