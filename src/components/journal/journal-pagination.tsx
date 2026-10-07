import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JournalPaginationProps = {
  query: string;
  visibility: "all" | "public" | "private";
  newerCursor?: string;
  olderCursor?: string;
};

function buildJournalHref({
  query,
  visibility,
  cursorName,
  cursor,
}: {
  query: string;
  visibility: "all" | "public" | "private";
  cursorName: "before" | "after";
  cursor: string;
}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (visibility !== "all") {
    params.set("visibility", visibility);
  }

  params.set(cursorName, cursor);

  return `/my-devotions?${params.toString()}`;
}

export function JournalPagination({
  query,
  visibility,
  newerCursor,
  olderCursor,
}: JournalPaginationProps) {
  if (!newerCursor && !olderCursor) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 border-t border-border pt-5"
      aria-label="Journal pages"
    >
      {newerCursor ? (
        <Link
          href={buildJournalHref({
            query,
            visibility,
            cursorName: "before",
            cursor: newerCursor,
          })}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "gap-2",
          )}
        >
          <ArrowLeft className="size-3.5" />
          Newer
        </Link>
      ) : (
        <span />
      )}

      {olderCursor ? (
        <Link
          href={buildJournalHref({
            query,
            visibility,
            cursorName: "after",
            cursor: olderCursor,
          })}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "gap-2",
          )}
        >
          Older
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </nav>
  );
}
