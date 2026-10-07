import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <Container className="flex min-h-[calc(100svh-4rem)] items-center py-16 sm:py-24">
          <section className="w-full max-w-2xl border-y border-border py-10">
            <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
              404
            </p>
            <h1 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-5xl">
              This page could not be found.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              The address may be incorrect, or the page may have moved.
            </p>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "mt-7",
              )}
            >
              Back home
            </Link>
          </section>
        </Container>
      </main>
      <PublicFooter />
    </div>
  );
}
