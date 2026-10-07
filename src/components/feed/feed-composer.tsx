import Link from "next/link";
import { BookOpenText, PenLine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";

type FeedComposerProps = {
  name: string;
  avatarUrl?: string | null;
};

export function FeedComposer({ name, avatarUrl }: FeedComposerProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <UserAvatar name={name} avatarUrl={avatarUrl} />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            Share today&apos;s devotion
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Capture the Scripture, what you observed, how you will apply it,
            and your prayer.
          </p>
        </div>
      </div>

      <Link
        href="/devotions/new"
        className="mt-4 flex min-h-12 w-full items-center rounded-md border border-input bg-background px-4 text-left text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-foreground"
      >
        What are you reflecting on today?
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpenText className="size-4 text-primary" />
          SOAP devotion
        </div>

        <Link
          href="/devotions/new"
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
        >
          <PenLine className="size-4" />
          Write devotion
        </Link>
      </div>
    </section>
  );
}
