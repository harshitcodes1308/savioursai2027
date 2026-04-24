/**
 * API Rate Limiter
 * Uses Upstash Redis in production (persists across serverless invocations).
 * Falls back to in-memory for local dev when UPSTASH env vars are missing.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Types ──

interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Window duration in seconds */
    windowSeconds: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

// ── Redis-backed limiter (production) ──

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedis
    ? new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : null;

// Cache Ratelimit instances per config key to avoid re-creating them
const limiterCache = new Map<string, Ratelimit>();

function getRedisLimiter(config: RateLimitConfig): Ratelimit {
    const cacheKey = `${config.maxRequests}:${config.windowSeconds}`;
    let limiter = limiterCache.get(cacheKey);
    if (!limiter) {
        limiter = new Ratelimit({
            redis: redis!,
            limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowSeconds} s`),
            analytics: false,
            prefix: "rl",
        });
        limiterCache.set(cacheKey, limiter);
    }
    return limiter;
}

// ── In-memory fallback (local dev) ──

interface MemoryEntry {
    count: number;
    resetTime: number;
}

const memoryStore = new Map<string, MemoryEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of memoryStore.entries()) {
            if (now > entry.resetTime) {
                memoryStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

function checkMemoryRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || now > entry.resetTime) {
        memoryStore.set(key, {
            count: 1,
            resetTime: now + config.windowSeconds * 1000,
        });
        return { allowed: true, remaining: config.maxRequests - 1, retryAfterSeconds: 0 };
    }

    if (entry.count >= config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
    }

    entry.count++;
    return { allowed: true, remaining: config.maxRequests - entry.count, retryAfterSeconds: 0 };
}

// ── Public API (same interface for all callers) ──

/**
 * Check rate limit for a given key (IP, userId, etc.)
 * Uses Redis in production, in-memory locally.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
    if (!hasRedis) {
        return checkMemoryRateLimit(key, config);
    }

    // Upstash ratelimit is async, but our callers expect sync.
    // Fire the Redis check in background and use a permissive fallback.
    // To get the full benefit, callers should migrate to checkRateLimitAsync.
    // For now, run the async check and block via the memory fallback as a
    // conservative sync guard that still works across cold starts via Redis.
    const memResult = checkMemoryRateLimit(key, config);

    // Fire async Redis check (best-effort enforcement — blocks repeat offenders
    // when the memory store resets on cold start, because Redis still has state)
    getRedisLimiter(config).limit(key).then((result) => {
        if (!result.success) {
            // Backfill memory store so subsequent sync calls within this
            // invocation are also blocked
            memoryStore.set(key, {
                count: config.maxRequests,
                resetTime: result.reset,
            });
        }
    }).catch(() => {
        // Redis down — memory fallback still active
    });

    return memResult;
}

/**
 * Async rate limit check — preferred for new code.
 * Uses Redis when available, memory otherwise.
 */
export async function checkRateLimitAsync(
    key: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    if (!hasRedis) {
        return checkMemoryRateLimit(key, config);
    }

    try {
        const result = await getRedisLimiter(config).limit(key);
        const retryAfter = result.success
            ? 0
            : Math.ceil((result.reset - Date.now()) / 1000);

        return {
            allowed: result.success,
            remaining: result.remaining,
            retryAfterSeconds: Math.max(retryAfter, 0),
        };
    } catch {
        // Redis down — fall back to memory
        return checkMemoryRateLimit(key, config);
    }
}

// ── Pre-configured limiters ──

export const AUTH_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 5,
    windowSeconds: 60,
};

export const PAYMENT_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 3,
    windowSeconds: 60,
};

export const GOOGLE_AUTH_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 10,
    windowSeconds: 60,
};
