import Link from "next/link";
import { BookOpenText, CalendarDays } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedSidebar() {
  return (
    <aside className="space-y-4">
      <section className="rounded-lg border border-border bg-sidebar p-5">
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-primary uppercase">
          <BookOpenText className="size-4" />
          Featured Scripture
        </div>
        <p className="mt-4 text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
          Psalm 46:10
        </p>
        <blockquote className="scripture mt-3 text-xl leading-8 text-foreground">
          “Be still, and know that I am God.”
        </blockquote>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Take a moment before scrolling further. Read slowly and sit with the
          words first.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-devotion-sage uppercase">
          <CalendarDays className="size-4" />
          Daily rhythm
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2" aria-label="SOAP devotion rhythm">
          {["S", "O", "A", "P"].map((letter, index) => (
            <div
              key={letter}
              className="flex aspect-square items-center justify-center rounded-md border border-border bg-background text-xs font-medium text-muted-foreground"
            >
              <span>
                {letter}
                <span className="sr-only">
                  {["Scripture", "Observation", "Application", "Prayer"][index]}
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          A simple structure is enough. Consistency matters more than writing
          something long.
        </p>

        <Link
          href="/devotions/new"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "mt-5 w-full",
          )}
        >
          Write today&apos;s devotion
        </Link>
      </section>
    </aside>
  );
}
