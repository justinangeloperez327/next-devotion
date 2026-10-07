import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Lock, PenLine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import { getPrisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Devotions",
};

export default async function MyDevotionsPage() {
  const user = await requireUser();
  const database = getPrisma();

  const [devotions, total] = await Promise.all([
    database.devotion.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      select: {
        id: true,
        scriptureReference: true,
        observation: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    database.devotion.count({
      where: {
        userId: user.id,
      },
    }),
  ]);

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
            {total === 1 ? "1 devotion" : `${total} devotions`} recorded.
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

      {devotions.length > 0 ? (
        <div className="divide-y divide-border">
          {devotions.map((devotion) => {
            const VisibilityIcon =
              devotion.visibility === "PUBLIC" ? Globe2 : Lock;

            return (
              <article
                key={devotion.id}
                className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <VisibilityIcon className="size-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                      {devotion.visibility === "PUBLIC" ? "Public" : "Private"}
                    </span>
                    <span className="text-border" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(devotion.createdAt)}
                    </span>
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
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            Your journal is empty.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Begin with one passage and write what you observe, how you will
            respond, and what you want to pray.
          </p>
        </div>
      )}

      {total > devotions.length ? (
        <p className="border-t border-border pt-5 text-center text-xs text-muted-foreground">
          Showing your 50 most recent devotions. Journal pagination can be added
          when the history grows beyond this initial view.
        </p>
      ) : null}
    </main>
  );
}
