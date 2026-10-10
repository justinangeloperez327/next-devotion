import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe2,
  Heart,
  Lock,
  MessageCircle,
  PenLine,
} from "lucide-react";

import { JournalFilters } from "@/components/journal/journal-filters";
import { JournalPagination } from "@/components/journal/journal-pagination";
import { EmptyState } from "@/components/states/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import {
  decodeDateIdCursor,
  encodeDateIdCursor,
} from "@/lib/pagination";
import { getPrisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "My Devotions",
};

const PAGE_SIZE = 15;

type JournalVisibility = "all" | "public" | "private";

type MyDevotionsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    visibility?: string | string[];
    after?: string | string[];
    before?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseVisibility(value: string | undefined): JournalVisibility {
  if (value === "public" || value === "private") {
    return value;
  }

  return "all";
}

function buildFilteredJournalHref(
  query: string,
  visibility: JournalVisibility,
) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (visibility !== "all") {
    params.set("visibility", visibility);
  }

  const search = params.toString();

  return search ? `/my-devotions?${search}` : "/my-devotions";
}

export default async function MyDevotionsPage({
  searchParams,
}: MyDevotionsPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const query = (firstParam(params.q) ?? "").trim().slice(0, 120);
  const visibility = parseVisibility(firstParam(params.visibility));
  const afterValue = firstParam(params.after);
  const beforeValue = afterValue ? undefined : firstParam(params.before);
  const afterCursor = decodeDateIdCursor(afterValue);
  const beforeCursor = afterCursor
    ? null
    : decodeDateIdCursor(beforeValue);
  const cursor = afterCursor ?? beforeCursor;
  const movingNewer = Boolean(beforeCursor);

  const visibilityCondition: Prisma.DevotionWhereInput =
    visibility === "public"
      ? { visibility: "PUBLIC" as const }
      : visibility === "private"
        ? { visibility: "PRIVATE" as const }
        : {};

  const searchCondition: Prisma.DevotionWhereInput = query
    ? {
        OR: [
          {
            scriptureReference: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            scriptureText: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            observation: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            application: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            prayer: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const cursorCondition: Prisma.DevotionWhereInput = cursor
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

  const database = getPrisma();
  const filterWhere: Prisma.DevotionWhereInput = {
    userId: user.id,
    ...visibilityCondition,
    ...searchCondition,
  };

  const [rows, total, publicTotal, privateTotal, filteredTotal] =
    await Promise.all([
      database.devotion.findMany({
        where: {
          ...filterWhere,
          ...cursorCondition,
        },
        orderBy: movingNewer
          ? [{ createdAt: "asc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "desc" }],
        take: PAGE_SIZE + 1,
        select: {
          id: true,
          scriptureReference: true,
          observation: true,
          visibility: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              amens: true,
              comments: true,
            },
          },
        },
      }),
      database.devotion.count({
        where: {
          userId: user.id,
        },
      }),
      database.devotion.count({
        where: {
          userId: user.id,
          visibility: "PUBLIC",
        },
      }),
      database.devotion.count({
        where: {
          userId: user.id,
          visibility: "PRIVATE",
        },
      }),
      database.devotion.count({
        where: filterWhere,
      }),
    ]);

  const hasExtra = rows.length > PAGE_SIZE;
  const devotions = rows.slice(0, PAGE_SIZE);

  if (movingNewer) {
    devotions.reverse();
  }

  const first = devotions[0];
  const last = devotions[devotions.length - 1];

  const hasNewer = movingNewer ? hasExtra : Boolean(afterCursor);
  const hasOlder = movingNewer ? Boolean(beforeCursor) : hasExtra;

  const newerCursor =
    first && hasNewer
      ? encodeDateIdCursor({
          createdAt: first.createdAt,
          id: first.id,
        })
      : undefined;

  const olderCursor =
    last && hasOlder
      ? encodeDateIdCursor({
          createdAt: last.createdAt,
          id: last.id,
        })
      : undefined;

  const filteredHref = buildFilteredJournalHref(query, visibility);
  const hasFilters = Boolean(query) || visibility !== "all";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            My Devotions
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-foreground">
            Your personal devotion journal.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Search what you have learned and return to the reflections worth
            carrying forward.
          </p>
        </div>

        <Link
          href="/devotions/new"
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
        >
          <PenLine className="size-4" />
          New devotion
        </Link>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="py-4 pr-4">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            All
          </dt>
          <dd className="mt-1 text-xl font-medium text-foreground">{total}</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Public
          </dt>
          <dd className="mt-1 text-xl font-medium text-foreground">
            {publicTotal}
          </dd>
        </div>
        <div className="py-4 pl-4">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Private
          </dt>
          <dd className="mt-1 text-xl font-medium text-foreground">
            {privateTotal}
          </dd>
        </div>
      </dl>

      <div className="py-6">
        <JournalFilters query={query} visibility={visibility} />
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Journal entries
        </p>
        <p className="text-xs text-muted-foreground">
          {filteredTotal === 1
            ? "1 matching devotion"
            : `${filteredTotal} matching devotions`}
        </p>
      </div>

      {devotions.length > 0 ? (
        <>
          <div className="divide-y divide-border">
            {devotions.map((devotion) => {
              const VisibilityIcon =
                devotion.visibility === "PUBLIC" ? Globe2 : Lock;
              const wasEdited =
                devotion.updatedAt.getTime() - devotion.createdAt.getTime() >
                1000;

              return (
                <article
                  key={devotion.id}
                  className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <VisibilityIcon className="size-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                        {devotion.visibility === "PUBLIC"
                          ? "Public"
                          : "Private"}
                      </span>
                      <span className="text-border" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(devotion.createdAt)}
                      </span>
                      {wasEdited ? (
                        <span className="text-xs text-muted-foreground">
                          · Edited
                        </span>
                      ) : null}
                    </div>

                    <Link
                      href={`/devotions/${devotion.id}`}
                      className="mt-2 block text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {devotion.scriptureReference}
                    </Link>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {devotion.observation}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Heart className="size-3.5 text-devotion-sage" />
                        {devotion._count.amens}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="size-3.5" />
                        {devotion._count.comments}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/devotions/${devotion.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      View
                    </Link>
                    <Link
                      href={`/devotions/${devotion.id}/edit`}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <JournalPagination
            query={query}
            visibility={visibility}
            newerCursor={newerCursor}
            olderCursor={olderCursor}
          />
        </>
      ) : (
        <EmptyState
          title={
            total === 0
              ? "Your journal is empty."
              : hasFilters
                ? "No devotions match these filters."
                : "No devotions on this page."
          }
          description={
            total === 0
              ? "Begin with one passage and write what you observe, how you will respond, and what you want to pray."
              : hasFilters
                ? "Try another Scripture reference, reflection keyword, or visibility."
                : "Your journal may have changed since this page was opened."
          }
          actionHref={
            total === 0
              ? "/devotions/new"
              : hasFilters
                ? "/my-devotions"
                : filteredHref
          }
          actionLabel={
            total === 0
              ? "Write devotion"
              : hasFilters
                ? "Clear filters"
                : "Return to latest"
          }
        />
      )}
    </main>
  );
}
