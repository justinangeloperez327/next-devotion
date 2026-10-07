"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export function AppErrorState({
  title = "Something went wrong.",
  description = "The page could not be completed. You can retry the request or return to a stable part of the app.",
  onRetry,
  homeHref = "/feed",
  homeLabel = "Back to feed",
}: AppErrorStateProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <section className="w-full border-y border-border py-10">
        <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-destructive">
          <AlertTriangle className="size-5" />
        </div>

        <p className="mt-6 text-xs font-medium tracking-[0.18em] text-primary uppercase">
          Unable to continue
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          {onRetry ? (
            <Button type="button" onClick={onRetry} className="gap-2">
              <RotateCcw className="size-4" />
              Try again
            </Button>
          ) : null}
          <Link
            href={homeHref}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full sm:w-auto",
            )}
          >
            {homeLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
