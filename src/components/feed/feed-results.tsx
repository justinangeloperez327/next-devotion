import Link from "next/link";

import { DevotionCard } from "@/components/feed/devotion-card";
import { FeedPagination } from "@/components/feed/feed-pagination";
import { buttonVariants } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/date";
import {
  decodeFeedCursor,
  encodeFeedCursor,
} from "@/lib/feed-pagination";
import { getPrisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

type FeedResultsProps = {
  after?: string;
  before?: string;
};

export async function FeedResults({ after, before }: FeedResultsProps) {
  const database = getPrisma();
  const afterCursor = decodeFeedCursor(after);
  const beforeCursor = afterCursor ? null : decodeFeedCursor(before);
  const cursor = afterCursor ?? beforeCursor;
  const movingNewer = Boolean(beforeCursor);

  const cursorCondition = cursor
    ? movingNewer
      ? {
          OR: [
            {
              createdAt: {
                gt: cursor.createdAt,
              },
            },
            {
              createdAt: cursor.createdAt,
              id: {
                gt: cursor.id,
              },
            },
          ],
        }
      : {
          OR: [
            {
              createdAt: {
                lt: cursor.createdAt,
              },
            },
            {
              createdAt: cursor.createdAt,
              id: {
                lt: cursor.id,
              },
            },
          ],
        }
    : {};

  const rows = await database.devotion.findMany({
    where: {
      visibility: "PUBLIC",
      ...cursorCondition,
    },
    orderBy: movingNewer
      ? [{ createdAt: "asc" }, { id: "asc" }]
      : [{ createdAt: "desc" }, { id: "desc" }],
    take: PAGE_SIZE + 1,
    select: {
      id: true,
      scriptureReference: true,
      scriptureText: true,
      observation: true,
      application: true,
      prayer: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          username: true,
        },
      },
      _count: {
        select: {
          amens: true,
          comments: true,
        },
      },
    },
  });

  const hasExtra = rows.length > PAGE_SIZE;
  const pageRows = rows.slice(0, PAGE_SIZE);

  if (movingNewer) {
    pageRows.reverse();
  }

  if (pageRows.length === 0) {
    const paginatedRequest = Boolean(after || before);

    return (
      <div className="rounded-lg border border-border bg-card px-5 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          {paginatedRequest
            ? "No devotions on this page."
            : "No public devotions yet."}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {paginatedRequest
            ? "The feed may have changed since this page was opened."
            : "Your community feed will begin filling as people share their daily Scripture reflections."}
        </p>
        {paginatedRequest ? (
          <Link
            href="/feed"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-5",
            )}
          >
            Return to latest
          </Link>
        ) : null}
      </div>
    );
  }

  const first = pageRows[0];
  const last = pageRows[pageRows.length - 1];

  const hasNewer = movingNewer ? hasExtra : Boolean(afterCursor);
  const hasOlder = movingNewer ? Boolean(beforeCursor) : hasExtra;

  const newerCursor = hasNewer
    ? encodeFeedCursor({
        createdAt: first.createdAt,
        id: first.id,
      })
    : undefined;

  const olderCursor = hasOlder
    ? encodeFeedCursor({
        createdAt: last.createdAt,
        id: last.id,
      })
    : undefined;

  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Recent devotions
        </p>
        <p className="text-xs text-muted-foreground">
          Showing {pageRows.length}
        </p>
      </div>

      <div className="space-y-5">
        {pageRows.map((devotion) => (
          <DevotionCard
            key={devotion.id}
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
          />
        ))}
      </div>

      <FeedPagination
        newerCursor={newerCursor}
        olderCursor={olderCursor}
      />
    </>
  );
}
