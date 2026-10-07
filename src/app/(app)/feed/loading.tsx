import { FeedListSkeleton } from "@/components/feed/feed-list-skeleton";

function BlockSkeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-secondary ${className}`} />;
}

export default function FeedLoading() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_300px] xl:justify-center">
        <div className="min-w-0 space-y-5">
          <div className="space-y-3">
            <BlockSkeleton className="h-3 w-20" />
            <BlockSkeleton className="h-8 w-56" />
            <BlockSkeleton className="h-4 w-full max-w-md" />
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex gap-3">
              <div className="size-9 animate-pulse rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <BlockSkeleton className="h-4 w-40" />
                <BlockSkeleton className="h-3.5 w-4/5" />
              </div>
            </div>
            <BlockSkeleton className="mt-4 h-12 w-full" />
          </div>

          <FeedListSkeleton />
        </div>

        <div className="hidden space-y-4 xl:block">
          <BlockSkeleton className="h-56 w-full" />
          <BlockSkeleton className="h-64 w-full" />
        </div>
      </div>
    </main>
  );
}
