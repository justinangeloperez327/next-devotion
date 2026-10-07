import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-svh bg-background">
      <div className="grid min-h-svh lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden border-r border-border bg-sidebar lg:flex">
          <div className="flex w-full flex-col justify-between px-10 py-10 xl:px-16 xl:py-12">
            <Link
              href="/"
              className="w-fit text-sm font-semibold tracking-[0.18em] text-foreground uppercase"
            >
              Next Devotion
            </Link>

            <div className="max-w-xl">
              <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
                Psalm 119:105
              </p>
              <blockquote className="scripture mt-5 text-4xl leading-[1.35] tracking-[-0.02em] text-foreground xl:text-5xl">
                “Thy word is a lamp unto my feet, and a light unto my path.”
              </blockquote>
              <p className="mt-8 max-w-md text-sm leading-6 text-muted-foreground">
                A quiet place to read Scripture, reflect honestly, apply what
                you learn, and pray through your day.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Read. Reflect. Apply. Pray.
            </p>
          </div>
        </section>

        <section className="flex min-h-svh items-center">
          <Container className="max-w-xl py-10 sm:px-8 lg:px-12 xl:px-16">
            <div className="mb-14 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                className="text-sm font-semibold tracking-[0.18em] text-foreground uppercase"
              >
                Next Devotion
              </Link>
              <Link
                href="/"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Back home
              </Link>
            </div>

            <div className="w-full max-w-md">
              <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>

              <div className="mt-9">{children}</div>
            </div>
          </Container>
        </section>
      </div>
    </main>
  );
}
