export function AppPageSkeleton() {
  return (
    <main
      className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div className="border-b border-border pb-7">
        <div className="h-3 w-24 animate-pulse rounded-sm bg-secondary" />
        <div className="mt-3 h-8 w-full max-w-sm animate-pulse rounded-sm bg-secondary" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-sm bg-secondary" />
      </div>

      <div className="space-y-5 py-7">
        <div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
        <div className="h-44 w-full animate-pulse rounded-lg border border-border bg-card" />
        <div className="h-28 w-full animate-pulse rounded-lg border border-border bg-card" />
      </div>
    </main>
  );
}
