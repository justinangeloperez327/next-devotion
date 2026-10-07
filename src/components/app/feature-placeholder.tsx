import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function FeaturePlaceholder({
  eyebrow,
  title,
  description,
  actionHref = "/feed",
  actionLabel = "Back to feed",
}: FeaturePlaceholderProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-2xl border-y border-border py-10">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {description}
        </p>
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "mt-7",
          )}
        >
          {actionLabel}
        </Link>
      </div>
    </main>
  );
}
