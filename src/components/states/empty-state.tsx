import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  compact?: boolean;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center",
        compact ? "px-5 py-10" : "rounded-lg border border-border bg-card px-5 py-12",
        className,
      )}
    >
      {icon ? (
        <div className="mx-auto mb-4 flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          {icon}
        </div>
      ) : null}

      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "mt-5",
          )}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
