import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Next Devotion exists and how Scripture, reflection, application, prayer, and community shape the experience.",
};

const principles = [
  {
    title: "Scripture comes first",
    body: "The experience begins with the passage itself. Everything else exists to help you pay attention and respond faithfully.",
  },
  {
    title: "Reflection should become practice",
    body: "A devotion is not complete when it stays on the page. Application turns insight into a concrete response for daily life.",
  },
  {
    title: "Prayer makes it personal",
    body: "Prayer creates space to respond honestly to God rather than treating devotion as another task to complete.",
  },
  {
    title: "Community should encourage",
    body: "Sharing is designed around encouragement, not popularity. The social layer supports devotion instead of competing with it.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <main>
        <section className="border-b border-border">
          <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">
                About Next Devotion
              </p>
              <h1 className="mt-5 max-w-xl text-balance text-4xl font-medium tracking-[-0.035em] text-foreground sm:text-6xl">
                A quieter way to grow in Scripture together.
              </h1>
            </div>

            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Next Devotion is built around a simple idea: daily time with
                Scripture should be focused enough to become a habit, personal
                enough to matter, and communal enough to encourage others
                without becoming another noisy social network.
              </p>
            </div>
          </Container>
        </section>

        <section>
          <Container className="grid gap-14 py-20 sm:py-24 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-devotion-sage uppercase">
                The practice
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.025em] text-foreground">
                Scripture. Observation. Application. Prayer.
              </h2>
            </div>

            <div className="border-y border-border">
              {principles.map((principle, index) => (
                <article
                  key={principle.title}
                  className={cn(
                    "grid gap-3 py-7 sm:grid-cols-[4rem_1fr] sm:gap-6",
                    index > 0 && "border-t border-border",
                  )}
                >
                  <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="text-base font-medium text-foreground">
                      {principle.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {principle.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-border bg-sidebar">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
                Why community matters
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl">
                Share what you are learning without turning faith into a performance.
              </h2>
            </div>

            <div className="max-w-xl lg:justify-self-end">
              <p className="text-base leading-7 text-muted-foreground">
                The feed is intentionally simple. People can share their daily
                devotion, encourage a post with Amen, and join the reflection
                through comments. The goal is connection and consistency, not
                engagement for its own sake.
              </p>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "mt-7")}
              >
                Start your devotion
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
