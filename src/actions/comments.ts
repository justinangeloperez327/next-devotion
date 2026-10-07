"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import type { CommentFormState } from "@/lib/comment/types";
import { commentSchema } from "@/lib/comment/validation";
import { isUuid } from "@/lib/id";
import { getPrisma } from "@/lib/prisma";

function revalidateCommentViews(devotionId: string, username: string) {
  revalidatePath("/feed");
  revalidatePath(`/devotions/${devotionId}`);
  revalidatePath(`/profile/${username}`);
}

export async function createCommentAction(
  devotionId: string,
  _previousState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const user = await requireUser();

  if (!isUuid(devotionId)) {
    return {
      status: "error",
      message: "This devotion is not available.",
    };
  }

  const parsed = commentSchema.safeParse({
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check your comment.",
      error: parsed.error.flatten().fieldErrors.body?.[0],
    };
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
    return {
      status: "error",
      message: "This devotion is not available.",
    };
  }

  if (devotion.visibility === "PRIVATE" && devotion.userId !== user.id) {
    return {
      status: "error",
      message: "This devotion is not available.",
    };
  }

  try {
    await database.comment.create({
      data: {
        userId: user.id,
        devotionId,
        body: parsed.data.body,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Your comment could not be posted. Please try again.",
    };
  }

  revalidateCommentViews(devotionId, devotion.user.username);

  return {
    status: "success",
    message: "Comment posted.",
  };
}

export async function deleteCommentAction(
  commentId: string,
  devotionId: string,
  _formData: FormData,
) {
  const user = await requireUser();

  if (!isUuid(commentId) || !isUuid(devotionId)) {
    return;
  }

  const database = getPrisma();
  const comment = await database.comment.findFirst({
    where: {
      id: commentId,
      devotionId,
      userId: user.id,
    },
    select: {
      id: true,
      devotion: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  if (!comment) {
    return;
  }

  await database.comment.delete({
    where: {
      id: comment.id,
    },
  });

  revalidateCommentViews(devotionId, comment.devotion.user.username);
}
