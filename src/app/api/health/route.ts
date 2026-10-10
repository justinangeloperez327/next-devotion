import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = getPrisma();

    await Promise.all([
      database.user.findFirst({ select: { id: true } }),
      database.devotion.findFirst({ select: { id: true } }),
      database.rateLimitBucket.findFirst({ select: { key: true } }),
    ]);

    return NextResponse.json(
      {
        status: "ok",
        database: "ok",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
