function JournalRowSkeleton() {
  return (
    <div className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0 space-y-3">
        <div className="flex gap-2">
          <div className="h-3 w-16 animate-pulse rounded-sm bg-secondary" />
          <div className="h-3 w-20 animate-pulse rounded-sm bg-secondary" />
        </div>
        <div className="h-5 w-36 animate-pulse rounded-sm bg-secondary" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-sm bg-secondary" />
        <div className="h-3 w-24 animate-pulse rounded-sm bg-secondary" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-14 animate-pulse rounded-md bg-secondary" />
        <div className="h-8 w-14 animate-pulse rounded-md bg-secondary" />
      </div>
    </div>
  );
}

export default function MyDevotionsLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="border-b border-border pb-7">
        <div className="h-3 w-24 animate-pulse rounded-sm bg-secondary" />
        <div className="mt-3 h-8 w-72 animate-pulse rounded-sm bg-secondary" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-sm bg-secondary" />
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="px-4 py-4 first:pl-0 last:pr-0">
            <div className="h-3 w-14 animate-pulse rounded-sm bg-secondary" />
            <div className="mt-2 h-6 w-10 animate-pulse rounded-sm bg-secondary" />
          </div>
        ))}
      </div>

      <div className="my-6 h-24 animate-pulse rounded-lg border border-border bg-card" />

      <div className="divide-y divide-border border-t border-border">
        {Array.from({ length: 5 }, (_, index) => (
          <JournalRowSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
