function SkeletonLine({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-sm bg-secondary ${className}`} />;
}

export function FeedListSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading devotions" aria-busy="true">
      {Array.from({ length: 3 }, (_, index) => (
        <article
          key={index}
          className="rounded-lg border border-border bg-card"
        >
          <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
            <div className="size-9 shrink-0 animate-pulse rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-3.5 w-32" />
              <SkeletonLine className="h-3 w-24" />
            </div>
          </div>

          <div className="space-y-7 px-4 pb-5 pt-6 sm:px-5">
            <div className="border-l-2 border-border pl-4">
              <SkeletonLine className="h-3 w-24" />
              <div className="mt-4 space-y-2.5">
                <SkeletonLine className="h-5 w-full" />
                <SkeletonLine className="h-5 w-5/6" />
              </div>
            </div>

            {Array.from({ length: 3 }, (_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                <SkeletonLine className="h-2.5 w-20" />
                <SkeletonLine className="h-3.5 w-full" />
                <SkeletonLine className="h-3.5 w-11/12" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 border-t border-border">
            {Array.from({ length: 3 }, (_, actionIndex) => (
              <div
                key={actionIndex}
                className="flex h-11 items-center justify-center border-l border-border first:border-l-0"
              >
                <SkeletonLine className="h-3 w-14" />
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
