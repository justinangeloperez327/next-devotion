import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-svh bg-background">
      <div className="grid min-h-svh lg:grid-cols-[1fr_1fr]">
        <aside className="hidden flex-col justify-between border-r border-border bg-sidebar p-12 lg:flex xl:p-16">
          <Link href="/" className="flex w-fit items-center gap-3 text-sm font-semibold">
            <BookOpen className="size-5 text-primary" aria-hidden="true" /> Next Devotion
          </Link>
          <div className="my-16 max-w-lg">
            <p className="mb-8 text-sm text-primary">A little stillness. A daily rhythm.</p>
            <blockquote className="scripture text-4xl leading-[1.4] tracking-tight xl:text-5xl">
              “Thy word is a lamp unto my feet, and a light unto my path.”
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">Psalm 119:105 · KJV</p>
            <div className="mt-12 border-t border-border pt-6">
              <p className="text-sm leading-7 text-muted-foreground">Bring your attention back to Scripture. Keep the reflections you want to remember, and grow alongside others.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Scripture / Observation / Application / Prayer</p>
        </aside>
        <section className="flex flex-col px-6 py-6 sm:px-10 lg:px-14">
          <Link href="/" className="flex min-h-11 w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back home
          </Link>
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 sm:py-12">
            <p className="mb-8 flex items-center gap-2 text-sm font-semibold lg:hidden"><BookOpen className="size-5 text-primary" aria-hidden="true" />Next Devotion</p>
            <p className="text-sm font-medium text-primary">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
          <p className="mx-auto pb-2 text-xs text-muted-foreground">Make room for time with God.</p>
        </section>
      </div>
    </main>
  );
}
