import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe2, Lock } from "lucide-react";

import { CommentSection } from "@/components/comments/comment-section";
import { DevotionOwnerActions } from "@/components/devotion/devotion-owner-actions";
import { DevotionCard } from "@/components/feed/devotion-card";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import { isUuid } from "@/lib/id";
import {
  decodeDateIdCursor,
  encodeDateIdCursor,
} from "@/lib/pagination";
import { getPrisma } from "@/lib/prisma";
import { firstSearchParam } from "@/lib/search-params";
import { canViewDevotion } from "@/lib/privacy/access";

const COMMENT_PAGE_SIZE = 20;

type DevotionPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    commentsAfter?: string | string[];
    commentsBefore?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Devotion",
};

export default async function DevotionPage({
  params,
  searchParams,
}: DevotionPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const query = await searchParams;

  if (!isUuid(id)) {
    notFound();
  }

  const afterValue = firstSearchParam(query.commentsAfter);
  const beforeValue = afterValue
    ? undefined
    : firstSearchParam(query.commentsBefore);
  const afterCursor = decodeDateIdCursor(afterValue);
  const beforeCursor = afterCursor
    ? null
    : decodeDateIdCursor(beforeValue);
  const cursor = afterCursor ?? beforeCursor;
  const movingNewer = Boolean(beforeCursor);
  const database = getPrisma();

  const devotion = await database.devotion.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userId: true,
      scriptureReference: true,
      scriptureText: true,
      observation: true,
      application: true,
      prayer: true,
      visibility: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      amens: {
        where: {
          userId: user.id,
        },
        select: {
          userId: true,
        },
        take: 1,
      },
      savedBy: {
        where: {
          userId: user.id,
        },
        select: {
          userId: true,
        },
        take: 1,
      },
      _count: {
        select: {
          amens: true,
          comments: true,
        },
      },
    },
  });

  if (!devotion || !canViewDevotion(user.id, devotion)) {
    notFound();
  }

  const cursorCondition = cursor
    ? movingNewer
      ? {
          OR: [
            { createdAt: { gt: cursor.createdAt } },
            { createdAt: cursor.createdAt, id: { gt: cursor.id } },
          ],
        }
      : {
          OR: [
            { createdAt: { lt: cursor.createdAt } },
            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
          ],
        }
    : {};

  const rows = await database.comment.findMany({
    where: {
      devotionId: devotion.id,
      ...cursorCondition,
    },
    orderBy: movingNewer
      ? [{ createdAt: "asc" }, { id: "asc" }]
      : [{ createdAt: "desc" }, { id: "desc" }],
    take: COMMENT_PAGE_SIZE + 1,
    select: {
      id: true,
      userId: true,
      body: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  const hasExtra = rows.length > COMMENT_PAGE_SIZE;
  const comments = rows.slice(0, COMMENT_PAGE_SIZE);

  if (!movingNewer) {
    comments.reverse();
  }

  const firstComment = comments[0];
  const lastComment = comments[comments.length - 1];
  const hasNewer = movingNewer ? hasExtra : Boolean(afterCursor);
  const hasOlder = movingNewer ? Boolean(beforeCursor) : hasExtra;
  const newerCursor =
    lastComment && hasNewer
      ? encodeDateIdCursor({
          createdAt: lastComment.createdAt,
          id: lastComment.id,
        })
      : undefined;
  const olderCursor =
    firstComment && hasOlder
      ? encodeDateIdCursor({
          createdAt: firstComment.createdAt,
          id: firstComment.id,
        })
      : undefined;

  const isOwner = devotion.userId === user.id;
  const VisibilityIcon = devotion.visibility === "PUBLIC" ? Globe2 : Lock;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h1 className="sr-only">Devotion on {devotion.scriptureReference}</h1>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <VisibilityIcon className="size-3.5" />
          <span>
            {devotion.visibility === "PUBLIC"
              ? "Shared with the community"
              : "Private devotion"}
          </span>
        </div>

        {isOwner ? <DevotionOwnerActions devotionId={devotion.id} /> : null}
      </div>

      <DevotionCard
        id={devotion.id}
        author={devotion.user}
        time={formatRelativeDate(devotion.createdAt)}
        scriptureReference={devotion.scriptureReference}
        scriptureText={devotion.scriptureText}
        observation={devotion.observation}
        application={devotion.application}
        prayer={devotion.prayer}
        amenCount={devotion._count.amens}
        commentCount={devotion._count.comments}
        hasAmen={devotion.amens.length > 0}
        isSaved={devotion.savedBy.length > 0}
      />

      <CommentSection
        devotionId={devotion.id}
        currentUserId={user.id}
        comments={comments}
        totalCount={devotion._count.comments}
        newerCursor={newerCursor}
        olderCursor={olderCursor}
      />
    </main>
  );
}
