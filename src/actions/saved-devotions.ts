"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { isUuid } from "@/lib/id";
import { getPrisma } from "@/lib/prisma";
import { canViewDevotion } from "@/lib/privacy/access";
import { consumeRateLimit } from "@/lib/security/rate-limit";

export async function toggleSavedDevotionAction(devotionId: string) {
  const user = await requireUser();
  const allowed = await consumeRateLimit({
    scope: "saved-toggle",
    identifier: user.id,
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (!allowed) {
    return;
  }

  if (!isUuid(devotionId)) {
    return;
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

  if (!devotion) {
    return;
  }

  if (!canViewDevotion(user.id, devotion)) {
    return;
  }

  const existing = await database.savedDevotion.findUnique({
    where: {
      userId_devotionId: {
        userId: user.id,
        devotionId,
      },
    },
    select: {
      userId: true,
    },
  });

  if (existing) {
    await database.savedDevotion.delete({
      where: {
        userId_devotionId: {
          userId: user.id,
          devotionId,
        },
      },
    });
  } else {
    await database.savedDevotion.create({
      data: {
        userId: user.id,
        devotionId,
      },
    });
  }

  revalidatePath("/feed");
  revalidatePath("/saved");
  revalidatePath(`/devotions/${devotionId}`);
  revalidatePath(`/profile/${devotion.user.username}`);
}
