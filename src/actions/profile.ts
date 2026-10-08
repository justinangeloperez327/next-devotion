"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import type { ProfileFormState } from "@/lib/profile/types";
import { profileSchema } from "@/lib/profile/validation";
import { getPrisma } from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/security/rate-limit";

function firstError(errors: string[] | undefined) {
  return errors?.[0];
}

export async function updateProfileAction(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser();
  const allowed = await consumeRateLimit({
    scope: "profile-update",
    identifier: user.id,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "You are updating your profile too frequently. Try again later.",
    };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") ?? "",
    avatarUrl: formData.get("avatarUrl") ?? "",
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "Check the highlighted profile fields.",
      errors: {
        name: firstError(errors.name),
        bio: firstError(errors.bio),
        avatarUrl: firstError(errors.avatarUrl),
      },
    };
  }

  const avatarUrl = parsed.data.avatarUrl
    ? new URL(parsed.data.avatarUrl).toString()
    : null;

  try {
    await getPrisma().user.update({
      where: {
        id: user.id,
      },
      data: {
        name: parsed.data.name,
        bio: parsed.data.bio || null,
        avatarUrl,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Your profile could not be updated. Please try again.",
    };
  }

  revalidatePath("/feed");
  revalidatePath("/saved");
  revalidatePath("/settings");
  revalidatePath("/my-devotions");
  revalidatePath(`/profile/${user.username}`);

  return {
    status: "success",
    message: "Profile updated.",
  };
}
