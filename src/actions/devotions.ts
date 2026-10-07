"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import type { DevotionFormState } from "@/lib/devotion/types";
import { devotionSchema } from "@/lib/devotion/validation";
import { isUuid } from "@/lib/id";
import { getPrisma } from "@/lib/prisma";

function firstError(errors: string[] | undefined) {
  return errors?.[0];
}

function parseDevotion(formData: FormData) {
  return devotionSchema.safeParse({
    scriptureReference: formData.get("scriptureReference"),
    scriptureText: formData.get("scriptureText") ?? "",
    observation: formData.get("observation"),
    application: formData.get("application"),
    prayer: formData.get("prayer"),
    visibility: formData.get("visibility"),
  });
}

function validationError(
  parsed: ReturnType<typeof parseDevotion>,
): DevotionFormState | null {
  if (parsed.success) {
    return null;
  }

  const errors = parsed.error.flatten().fieldErrors;

  return {
    status: "error",
    message: "Check the highlighted devotion fields.",
    errors: {
      scriptureReference: firstError(errors.scriptureReference),
      scriptureText: firstError(errors.scriptureText),
      observation: firstError(errors.observation),
      application: firstError(errors.application),
      prayer: firstError(errors.prayer),
      visibility: firstError(errors.visibility),
    },
  };
}

function revalidateDevotionLists(username: string) {
  revalidatePath("/feed");
  revalidatePath("/saved");
  revalidatePath("/my-devotions");
  revalidatePath(`/profile/${username}`);
}

export async function createDevotionAction(
  _previousState: DevotionFormState,
  formData: FormData,
): Promise<DevotionFormState> {
  const user = await requireUser();
  const parsed = parseDevotion(formData);
  const error = validationError(parsed);

  if (error || !parsed.success) {
    return (
      error ?? {
        status: "error",
        message: "Unable to validate the devotion.",
      }
    );
  }

  const database = getPrisma();
  let devotionId: string;

  try {
    const devotion = await database.devotion.create({
      data: {
        userId: user.id,
        scriptureReference: parsed.data.scriptureReference,
        scriptureText: parsed.data.scriptureText || null,
        observation: parsed.data.observation,
        application: parsed.data.application,
        prayer: parsed.data.prayer,
        visibility: parsed.data.visibility,
      },
      select: {
        id: true,
      },
    });

    devotionId = devotion.id;
  } catch {
    return {
      status: "error",
      message: "The devotion could not be posted. Please try again.",
    };
  }

  revalidateDevotionLists(user.username);
  redirect(`/devotions/${devotionId}`);
}

export async function updateDevotionAction(
  devotionId: string,
  _previousState: DevotionFormState,
  formData: FormData,
): Promise<DevotionFormState> {
  const user = await requireUser();

  if (!isUuid(devotionId)) {
    return {
      status: "error",
      message: "This devotion could not be updated.",
    };
  }

  const parsed = parseDevotion(formData);
  const error = validationError(parsed);

  if (error || !parsed.success) {
    return (
      error ?? {
        status: "error",
        message: "Unable to validate the devotion.",
      }
    );
  }

  const database = getPrisma();
  let updated = false;

  try {
    const result = await database.devotion.updateMany({
      where: {
        id: devotionId,
        userId: user.id,
      },
      data: {
        scriptureReference: parsed.data.scriptureReference,
        scriptureText: parsed.data.scriptureText || null,
        observation: parsed.data.observation,
        application: parsed.data.application,
        prayer: parsed.data.prayer,
        visibility: parsed.data.visibility,
      },
    });

    updated = result.count === 1;
  } catch {
    return {
      status: "error",
      message: "The devotion could not be saved. Please try again.",
    };
  }

  if (!updated) {
    return {
      status: "error",
      message: "This devotion could not be updated.",
    };
  }

  revalidatePath(`/devotions/${devotionId}`);
  revalidateDevotionLists(user.username);
  redirect(`/devotions/${devotionId}`);
}

export async function deleteDevotionAction(
  devotionId: string,
  _formData: FormData,
) {
  const user = await requireUser();

  if (!isUuid(devotionId)) {
    redirect("/my-devotions");
  }

  const database = getPrisma();

  await database.devotion.deleteMany({
    where: {
      id: devotionId,
      userId: user.id,
    },
  });

  revalidatePath(`/devotions/${devotionId}`);
  revalidateDevotionLists(user.username);
  redirect("/my-devotions");
}
