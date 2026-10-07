import type { Metadata } from "next";
import { Suspense } from "react";

import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedListSkeleton } from "@/components/feed/feed-list-skeleton";
import { FeedResults } from "@/components/feed/feed-results";
import { FeedSidebar } from "@/components/feed/feed-sidebar";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Home Feed",
};

type FeedPageProps = {
  searchParams: Promise<{
    after?: string | string[];
    before?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const after = firstParam(params.after);
  const before = after ? undefined : firstParam(params.before);
  const paginationKey = after
    ? `after:${after}`
    : before
      ? `before:${before}`
      : "latest";

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

          <FeedComposer name={user.name} avatarUrl={user.avatarUrl} />

          <Suspense
            key={paginationKey}
            fallback={
              <>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Recent devotions
                  </p>
                  <p className="text-xs text-muted-foreground">Loading…</p>
                </div>
                <FeedListSkeleton />
              </>
            }
          >
            <FeedResults after={after} before={before} />
          </Suspense>
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
