"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import type { PrivacyFormState } from "@/lib/privacy/types";
import { getPrisma } from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/security/rate-limit";

const VALID_VISIBILITIES = new Set(["PUBLIC", "PRIVATE"]);

export async function updatePrivacyAction(
  _previousState: PrivacyFormState,
  formData: FormData,
): Promise<PrivacyFormState> {
  const user = await requireUser();
  const allowed = await consumeRateLimit({
    scope: "privacy-update",
    identifier: user.id,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "You are changing privacy settings too frequently. Try again later.",
    };
  }

  const value = formData.get("defaultDevotionVisibility");

  if (typeof value !== "string" || !VALID_VISIBILITIES.has(value)) {
    return {
      status: "error",
      message: "Choose a valid default visibility.",
    };
  }

  try {
    await getPrisma().user.update({
      where: {
        id: user.id,
      },
      data: {
        defaultDevotionVisibility: value as "PUBLIC" | "PRIVATE",
      },
    });
  } catch {
    return {
      status: "error",
      message: "Your privacy preference could not be saved. Please try again.",
    };
  }

  revalidatePath("/settings");
  revalidatePath("/devotions/new");

  return {
    status: "success",
    message: "Default devotion visibility updated.",
  };
}
