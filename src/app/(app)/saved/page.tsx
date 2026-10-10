import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, BookOpenText } from "lucide-react";

import { DevotionCard } from "@/components/feed/devotion-card";
import { SavedPagination } from "@/components/saved/saved-pagination";
import { EmptyState } from "@/components/states/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import {
  decodeDateIdCursor,
  encodeDateIdCursor,
} from "@/lib/pagination";
import { getPrisma } from "@/lib/prisma";
import { firstSearchParam } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Saved Devotions",
};

const PAGE_SIZE = 20;

type SavedPageProps = {
  searchParams: Promise<{
    after?: string | string[];
    before?: string | string[];
  }>;
};

export default async function SavedPage({ searchParams }: SavedPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const afterValue = firstSearchParam(params.after);
  const beforeValue = afterValue ? undefined : firstSearchParam(params.before);
  const afterCursor = decodeDateIdCursor(afterValue);
  const beforeCursor = afterCursor ? null : decodeDateIdCursor(beforeValue);
  const cursor = afterCursor ?? beforeCursor;
  const movingNewer = Boolean(beforeCursor);

  const cursorCondition: Prisma.SavedDevotionWhereInput = cursor
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
              devotionId: {
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
              devotionId: {
                lt: cursor.id,
              },
            },
          ],
        }
    : {};

  const visibilityCondition: Prisma.SavedDevotionWhereInput = {
    devotion: {
      is: {
        OR: [
          {
            visibility: "PUBLIC" as const,
          },
          {
            userId: user.id,
          },
        ],
      },
    },
  };

  const database = getPrisma();
  const [rows, total] = await Promise.all([
    database.savedDevotion.findMany({
      where: {
        userId: user.id,
        ...visibilityCondition,
        ...cursorCondition,
      },
      orderBy: movingNewer
        ? [{ createdAt: "asc" }, { devotionId: "asc" }]
        : [{ createdAt: "desc" }, { devotionId: "desc" }],
      take: PAGE_SIZE + 1,
      select: {
        devotionId: true,
        createdAt: true,
        devotion: {
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
            _count: {
              select: {
                amens: true,
                comments: true,
              },
            },
          },
        },
      },
    }),
    database.savedDevotion.count({
      where: {
        userId: user.id,
        ...visibilityCondition,
      },
    }),
  ]);

  const hasExtra = rows.length > PAGE_SIZE;
  const savedRows = rows.slice(0, PAGE_SIZE);

  if (movingNewer) {
    savedRows.reverse();
  }

  const first = savedRows[0];
  const last = savedRows[savedRows.length - 1];

  const hasNewer = movingNewer ? hasExtra : Boolean(afterCursor);
  const hasOlder = movingNewer ? Boolean(beforeCursor) : hasExtra;

  const newerCursor =
    first && hasNewer
      ? encodeDateIdCursor({
          createdAt: first.createdAt,
          id: first.devotionId,
        })
      : undefined;

  const olderCursor =
    last && hasOlder
      ? encodeDateIdCursor({
          createdAt: last.createdAt,
          id: last.devotionId,
        })
      : undefined;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-primary uppercase">
            <Bookmark className="size-3.5" />
            Saved
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-foreground">
            Devotions worth returning to.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {total === 1
              ? "1 devotion saved."
              : `${total} devotions saved.`}
          </p>
        </div>

        <Link
          href="/feed"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "gap-2",
          )}
        >
          <BookOpenText className="size-4" />
          Browse feed
        </Link>
      </div>

      {savedRows.length > 0 ? (
        <div className="pt-6">
          <div className="space-y-5">
            {savedRows.map((saved) => (
              <div key={saved.devotionId}>
                <p className="mb-2 text-[11px] text-muted-foreground">
                  Saved {formatRelativeDate(saved.createdAt)}
                </p>
                <DevotionCard
                  id={saved.devotion.id}
                  author={saved.devotion.user}
                  time={formatRelativeDate(saved.devotion.createdAt)}
                  scriptureReference={saved.devotion.scriptureReference}
                  scriptureText={saved.devotion.scriptureText}
                  observation={saved.devotion.observation}
                  application={saved.devotion.application}
                  prayer={saved.devotion.prayer}
                  amenCount={saved.devotion._count.amens}
                  commentCount={saved.devotion._count.comments}
                  hasAmen={saved.devotion.amens.length > 0}
                  isSaved
                />
              </div>
            ))}
          </div>

          <SavedPagination
            newerCursor={newerCursor}
            olderCursor={olderCursor}
          />
        </div>
      ) : (
        <EmptyState
          className="mt-6"
          icon={<Bookmark className="size-4" />}
          title={
            total === 0
              ? "You have not saved any devotions yet."
              : "No saved devotions on this page."
          }
          description={
            total === 0
              ? "Save a reflection from the feed when you want to return to it later."
              : "Your saved collection may have changed since this page was opened."
          }
          actionHref={total === 0 ? "/feed" : "/saved"}
          actionLabel={total === 0 ? "Browse feed" : "Return to latest"}
        />
      )}
    </main>
  );
}
