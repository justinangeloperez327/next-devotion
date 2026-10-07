import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const devotionSteps = [
  {
    label: "Scripture",
    description: "Begin with God's Word and give your attention to the passage in front of you.",
  },
  {
    label: "Observation",
    description: "Notice what stands out, what it reveals, and what you are being invited to consider.",
  },
  {
    label: "Application",
    description: "Turn reflection into a clear response you can carry into the rest of your day.",
  },
  {
    label: "Prayer",
    description: "Respond honestly and personally through prayer before moving on.",
  },
];

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <main id="main-content" tabIndex={-1}>
        <section className="border-b border-border">
          <Container className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-20 text-center sm:py-28">
            <p className="mb-6 text-xs font-medium tracking-[0.24em] text-primary uppercase">
              Daily Scripture · Reflection · Community
            </p>

            <h1 className="max-w-4xl text-balance text-4xl font-medium tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">
              Make time for what matters.
            </h1>

            <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Read Scripture, reflect on what it means, apply it to your life,
              and share your daily devotion with a community growing in faith.
            </p>

            <div className="mt-9 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:min-w-44 sm:w-auto")}
              >
                Start your devotion
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "w-full sm:min-w-32 sm:w-auto",
                )}
              >
                Log in
              </Link>
            </div>

            <div className="mt-20 w-full max-w-2xl border-t border-border pt-9 sm:mt-24">
              <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
                Psalm 46:10
              </p>
              <blockquote className="scripture mt-4 text-balance text-2xl leading-relaxed text-foreground sm:text-3xl">
                “Be still, and know that I am God.”
              </blockquote>
            </div>
          </Container>
        </section>

        <section aria-labelledby="devotion-practice">
          <Container className="py-20 sm:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
                A simple daily practice
              </p>
              <h2
                id="devotion-practice"
                className="mt-4 text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl"
              >
                Read. Reflect. Apply. Pray.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Next Devotion follows the SOAP rhythm so your daily time in
                Scripture stays focused, personal, and practical.
              </p>
            </div>

            <div className="mt-12 grid border-y border-border md:grid-cols-2 lg:grid-cols-4">
              {devotionSteps.map((step, index) => (
                <div
                  key={step.label}
                  className={cn(
                    "py-7 md:px-6 lg:py-9",
                    index > 0 && "border-t border-border md:border-t-0",
                    index % 2 === 1 && "md:border-l",
                    index > 1 && "md:border-t lg:border-t-0",
                    index > 0 && "lg:border-l lg:border-border",
                  )}
                >
                  <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                    {String(index + 1).padStart(2, "0")} · {step.label}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-sidebar">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-devotion-sage uppercase">
                A devotion worth keeping
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl">
                Build a record of how Scripture is shaping your life.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Your devotions become more than posts. They become a personal
                history of what you read, noticed, practiced, and prayed.
              </p>
            </div>

            <article className="border-l-2 border-primary/70 pl-6 sm:pl-8">
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                John 15:5
              </p>
              <p className="scripture mt-3 text-xl leading-8 text-foreground sm:text-2xl">
                “I am the vine; you are the branches.”
              </p>

              <div className="mt-7 space-y-6 text-sm leading-6 text-muted-foreground">
                <div>
                  <p className="mb-2 text-xs font-medium tracking-[0.16em] text-foreground uppercase">
                    Observation
                  </p>
                  <p>
                    Growth begins with remaining connected to God rather than
                    trying to produce everything through effort alone.
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium tracking-[0.16em] text-foreground uppercase">
                    Application
                  </p>
                  <p>
                    Begin the day with Scripture before allowing work and
                    notifications to set the pace.
                  </p>
                </div>
              </div>
            </article>
          </Container>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
