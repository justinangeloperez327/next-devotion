import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SavedPaginationProps = {
  newerCursor?: string;
  olderCursor?: string;
};

export function SavedPagination({
  newerCursor,
  olderCursor,
}: SavedPaginationProps) {
  if (!newerCursor && !olderCursor) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 border-t border-border pt-5"
      aria-label="Saved devotion pages"
    >
      {newerCursor ? (
        <Link
          href={`/saved?before=${encodeURIComponent(newerCursor)}`}
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
          href={`/saved?after=${encodeURIComponent(olderCursor)}`}
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
