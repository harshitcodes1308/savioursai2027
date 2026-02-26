/**
 * API Rate Limiter (In-Memory)
 * Simple sliding window rate limiter for API routes
 * Note: In-memory = resets on server restart, per-instance in serverless
 * For production at scale, use Redis-based rate limiting
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

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

/**
 * Check rate limit for a given key (IP, userId, etc.)
 */
export function checkRateLimit(
    key: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
        // New window
        store.set(key, {
            count: 1,
            resetTime: now + config.windowSeconds * 1000,
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            retryAfterSeconds: 0,
        };
    }

    if (entry.count >= config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: retryAfter,
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        retryAfterSeconds: 0,
    };
}

// Pre-configured limiters
export const AUTH_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 5,
    windowSeconds: 60, // 5 attempts per minute
};

export const PAYMENT_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 3,
    windowSeconds: 60, // 3 attempts per minute
};

export const GOOGLE_AUTH_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 10,
    windowSeconds: 60, // 10 attempts per minute
};
