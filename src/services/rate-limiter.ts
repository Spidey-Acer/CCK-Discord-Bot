import { config } from "../config.js";
import { BOT } from "../data/constants.js";

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < BOT.RATE_LIMIT_WINDOW_MS);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpired, BOT.RATE_LIMIT_CLEANUP_MS).unref();

export function checkRateLimit(userId: string, type: "ask" | "general"): boolean {
  const limit = type === "ask" ? config.rateLimits.ask : config.rateLimits.general;
  const key = `${userId}:${type}`;
  const now = Date.now();

  const entry = store.get(key);
  if (!entry) {
    store.set(key, { timestamps: [now] });
    return true;
  }

  // Filter to only timestamps within the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < BOT.RATE_LIMIT_WINDOW_MS);

  if (entry.timestamps.length >= limit) {
    return false; // Rate limited
  }

  entry.timestamps.push(now);
  return true;
}

export function getRemainingUses(userId: string, type: "ask" | "general"): number {
  const limit = type === "ask" ? config.rateLimits.ask : config.rateLimits.general;
  const key = `${userId}:${type}`;
  const now = Date.now();

  const entry = store.get(key);
  if (!entry) return limit;

  const recent = entry.timestamps.filter((t) => now - t < BOT.RATE_LIMIT_WINDOW_MS);
  return Math.max(0, limit - recent.length);
}
