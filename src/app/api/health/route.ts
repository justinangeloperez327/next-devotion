import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = getPrisma();

    await Promise.all([
      database.user.count(),
      database.devotion.count(),
      database.rateLimitBucket.count(),
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
