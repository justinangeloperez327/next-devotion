import type { Metadata } from "next";

import { DevotionCard } from "@/components/feed/devotion-card";
import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedSidebar } from "@/components/feed/feed-sidebar";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Home Feed",
};

export default async function FeedPage() {
  const user = await requireUser();
  const database = getPrisma();

  const devotions = await database.devotion.findMany({
    where: {
      visibility: "PUBLIC",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
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

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_300px] xl:justify-center">
        <div className="min-w-0 space-y-5">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              Home Feed
            </p>
            <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
              Good to see you, {user.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Read slowly. Share honestly. Encourage what is worth carrying forward.
            </p>
          </div>

          <FeedComposer name={user.name} />

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Recent devotions
            </p>
            <p className="text-xs text-muted-foreground">
              {devotions.length === 1
                ? "1 devotion"
                : `${devotions.length} devotions`}
            </p>
          </div>

          {devotions.length > 0 ? (
            <div className="space-y-5">
              {devotions.map((devotion) => (
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
          ) : (
            <div className="rounded-lg border border-border bg-card px-5 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                No public devotions yet.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Your community feed will begin filling as people share their
                daily Scripture reflections.
              </p>
            </div>
          )}
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-20">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
