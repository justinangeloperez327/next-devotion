import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { getPrisma } from "@/lib/prisma";

type RateLimitOptions = {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function getRequestFingerprint() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = requestHeaders.get("x-real-ip")?.trim();
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 256) ?? "unknown";

  return hashKey(`${forwardedFor ?? realIp ?? "unknown"}:${userAgent}`);
}

export async function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions) {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const expiresAt = new Date(windowStart + windowMs);
  const key = hashKey(`${scope}:${identifier}:${windowStart}`);
  const database = getPrisma();

  const bucket = await database.rateLimitBucket.upsert({
    where: {
      key,
    },
    create: {
      key,
      count: 1,
      expiresAt,
    },
    update: {
      count: {
        increment: 1,
      },
    },
    select: {
      count: true,
    },
  });

  if (Number.parseInt(key.slice(0, 2), 16) < 4) {
    await database.rateLimitBucket.deleteMany({
      where: {
        key: {
          not: key,
        },
        expiresAt: {
          lte: new Date(now),
        },
      },
    });
  }

  return bucket.count <= limit;
}

export async function pruneExpiredRateLimits() {
  await getPrisma().rateLimitBucket.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}
