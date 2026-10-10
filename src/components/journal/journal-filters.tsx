import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type JournalFiltersProps = {
  query: string;
  visibility: "all" | "public" | "private";
};

export function JournalFilters({
  query,
  visibility,
}: JournalFiltersProps) {
  const active = Boolean(query) || visibility !== "all";

  return (
    <form
      action="/my-devotions"
      method="get"
      className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-end"
    >
      <div className="grid gap-2">
        <label
          htmlFor="journal-search"
          className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase"
        >
          Search journal
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="journal-search"
            name="q"
            defaultValue={query}
            maxLength={120}
            placeholder="Scripture or reflection..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="journal-visibility"
          className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase"
        >
          Visibility
        </label>
        <select
          id="journal-visibility"
          name="visibility"
          defaultValue={visibility}
          className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-primary/70"
        >
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="h-11 flex-1 sm:h-9 sm:flex-none">
          Apply
        </Button>
        {active ? (
          <Link
            href="/my-devotions"
            aria-label="Clear journal filters"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-11 shrink-0 sm:size-9",
            )}
          >
            <X className="size-4" />
          </Link>
        ) : null}
      </div>
    </form>
  );
}
