"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { isUuid } from "@/lib/id";
import { getPrisma } from "@/lib/prisma";
import { canViewDevotion } from "@/lib/privacy/access";
import { consumeRateLimit } from "@/lib/security/rate-limit";

export async function setAmenAction(
  devotionId: string,
  shouldHaveAmen: boolean,
) {
  const user = await requireUser();
  const allowed = await consumeRateLimit({
    scope: "amen-toggle",
    identifier: user.id,
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (!allowed || !isUuid(devotionId)) {
    return false;
  }

  const database = getPrisma();
  const devotion = await database.devotion.findUnique({
    where: {
      id: devotionId,
    },
    select: {
      userId: true,
      visibility: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!devotion || !canViewDevotion(user.id, devotion)) {
    return false;
  }

  try {
    if (shouldHaveAmen) {
    await database.amen.upsert({
      where: {
        userId_devotionId: {
          userId: user.id,
          devotionId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        devotionId,
      },
    });
    } else {
      await database.amen.deleteMany({
        where: {
          userId: user.id,
          devotionId,
        },
      });
    }
  } catch {
    return false;
  }

  revalidatePath("/feed");
  revalidatePath("/saved");
  revalidatePath("/my-devotions");
  revalidatePath(`/devotions/${devotionId}`);
  revalidatePath(`/profile/${devotion.user.username}`);

  return true;
}
