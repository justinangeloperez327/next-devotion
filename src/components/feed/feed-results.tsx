import { DevotionCard } from "@/components/feed/devotion-card";
import { FeedPagination } from "@/components/feed/feed-pagination";
import { EmptyState } from "@/components/states/empty-state";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import {
  decodeDateIdCursor,
  encodeDateIdCursor,
} from "@/lib/pagination";
import { getPrisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

type FeedResultsProps = {
  after?: string;
  before?: string;
};

export async function FeedResults({ after, before }: FeedResultsProps) {
  const user = await requireUser();
  const database = getPrisma();
  const afterCursor = decodeDateIdCursor(after);
  const beforeCursor = afterCursor ? null : decodeDateIdCursor(before);
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

  const hasExtra = rows.length > PAGE_SIZE;
  const pageRows = rows.slice(0, PAGE_SIZE);

  if (movingNewer) {
    pageRows.reverse();
  }

  if (pageRows.length === 0) {
    const paginatedRequest = Boolean(after || before);

    return (
      <EmptyState
        title={
          paginatedRequest
            ? "No devotions on this page."
            : "No public devotions yet."
        }
        description={
          paginatedRequest
            ? "The feed may have changed since this page was opened."
            : "Your community feed will begin filling as people share their daily Scripture reflections."
        }
        actionHref={paginatedRequest ? "/feed" : undefined}
        actionLabel={paginatedRequest ? "Return to latest" : undefined}
      />
    );
  }

  const first = pageRows[0];
  const last = pageRows[pageRows.length - 1];

  const hasNewer = movingNewer ? hasExtra : Boolean(afterCursor);
  const hasOlder = movingNewer ? Boolean(beforeCursor) : hasExtra;

  const newerCursor = hasNewer
    ? encodeDateIdCursor({
        createdAt: first.createdAt,
        id: first.id,
      })
    : undefined;

  const olderCursor = hasOlder
    ? encodeDateIdCursor({
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
            hasAmen={devotion.amens.length > 0}
            isSaved={devotion.savedBy.length > 0}
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
