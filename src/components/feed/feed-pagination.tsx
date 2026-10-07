import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedPaginationProps = {
  newerCursor?: string;
  olderCursor?: string;
};

export function FeedPagination({
  newerCursor,
  olderCursor,
}: FeedPaginationProps) {
  if (!newerCursor && !olderCursor) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-3 border-t border-border pt-5"
      aria-label="Feed pages"
    >
      {newerCursor ? (
        <Link
          href={`/feed?before=${encodeURIComponent(newerCursor)}`}
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
          href={`/feed?after=${encodeURIComponent(olderCursor)}`}
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
