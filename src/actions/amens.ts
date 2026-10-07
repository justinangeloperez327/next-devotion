"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { isUuid } from "@/lib/id";
import { getPrisma } from "@/lib/prisma";

export async function toggleAmenAction(devotionId: string) {
  const user = await requireUser();

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

  if (devotion.visibility === "PRIVATE" && devotion.userId !== user.id) {
    return;
  }

  const existing = await database.amen.findUnique({
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
    await database.amen.delete({
      where: {
        userId_devotionId: {
          userId: user.id,
          devotionId,
        },
      },
    });
  } else {
    await database.amen.create({
      data: {
        userId: user.id,
        devotionId,
      },
    });
  }

  revalidatePath("/feed");
  revalidatePath(`/devotions/${devotionId}`);
  revalidatePath(`/profile/${devotion.user.username}`);
}
