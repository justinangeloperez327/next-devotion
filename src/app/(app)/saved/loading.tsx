function SavedCardSkeleton() {
  return (
    <div>
      <div className="mb-2 h-3 w-24 animate-pulse rounded-sm bg-secondary" />
      <div className="rounded-lg border border-border bg-card">
        <div className="flex gap-3 px-5 pt-5">
          <div className="size-9 animate-pulse rounded-full bg-secondary" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded-sm bg-secondary" />
            <div className="h-3 w-24 animate-pulse rounded-sm bg-secondary" />
          </div>
        </div>
        <div className="space-y-4 px-5 py-6">
          <div className="h-3 w-24 animate-pulse rounded-sm bg-secondary" />
          <div className="h-5 w-full animate-pulse rounded-sm bg-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded-sm bg-secondary" />
          <div className="h-4 w-full animate-pulse rounded-sm bg-secondary" />
        </div>
        <div className="h-11 border-t border-border" />
      </div>
    </div>
  );
}

export default function SavedLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="border-b border-border pb-7">
        <div className="h-3 w-20 animate-pulse rounded-sm bg-secondary" />
        <div className="mt-3 h-8 w-72 animate-pulse rounded-sm bg-secondary" />
        <div className="mt-3 h-4 w-32 animate-pulse rounded-sm bg-secondary" />
      </div>

      <div className="space-y-5 pt-6">
        {Array.from({ length: 3 }, (_, index) => (
          <SavedCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
