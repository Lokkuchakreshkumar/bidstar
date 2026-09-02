/**
 * In-Memory Sliding Window Rate Limiter
 * Provides inbound rate limiting per IP / client identifier with automatic garbage collection.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup every 60 seconds to prune stale IP buckets
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check whether an identifier is within the rate limit
   * @param key Unique client key (e.g., IP + route path)
   * @param limit Max allowed requests within the window
   * @param windowMs Window duration in milliseconds (default: 60,000ms = 1 min)
   */
  public check(
    key: string,
    limit: number,
    windowMs = 60000
  ): {
    allowed: boolean;
    remaining: number;
    resetSeconds: number;
    total: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps older than the window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    const currentCount = record.timestamps.length;
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    if (currentCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
        total: currentCount,
      };
    }

    // Record the new hit
    record.timestamps.push(now);

    return {
      allowed: true,
      remaining: Math.max(0, limit - record.timestamps.length),
      resetSeconds,
      total: record.timestamps.length,
    };
  }

  private cleanup() {
    const now = Date.now();
    const cutoff = now - 120000; // 2 minutes ago
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > cutoff);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

// Global singleton instance
export const rateLimiter = new SlidingWindowRateLimiter();

/**
 * Extracts a client IP from Next.js Request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
