import { Request, Response, NextFunction } from "express";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxRequests, message = "Too many requests, please try again later." } = options;
  const ipStore = new Map<string, RateLimitRecord>();

  // Periodically cleanup expired entries every 5 minutes to avoid memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress) || "unknown-ip";
    const now = Date.now();

    const record = ipStore.get(ip);

    if (!record || now > record.resetTime) {
      ipStore.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", 0);
      res.status(429).json({
        error: "Too Many Requests",
        message,
        retryAfterSeconds: retryAfterSec
      });
      return;
    }

    record.count += 1;
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count));
    next();
  };
}

// 120 requests per minute for general routes
export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  message: "API request rate limit exceeded. Please throttle requests."
});

// 30 requests per minute for resource-intensive AI, OCR, voice, and analysis endpoints
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: "Clinical AI/Voice processing rate limit reached. Please wait a moment before sending more requests."
});
