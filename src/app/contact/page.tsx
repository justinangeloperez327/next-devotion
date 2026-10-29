import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Contact", description: "Contact availability for Next Devotion." };

export default function ContactPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <Container className="max-w-3xl py-14 sm:py-20">
          <p className="text-sm font-medium text-primary">Contact</p>
          <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl">We would like to hear from you.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Questions, feedback, and ideas help shape this community.</p>
          <section className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8" aria-labelledby="contact-availability">
            <Mail className="size-6 text-primary" aria-hidden="true" />
            <h2 id="contact-availability" className="mt-4 text-lg font-medium">Contact messaging is temporarily unavailable.</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Please check back later. In the meantime, you can read about Next Devotion and the daily practice behind it.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about" className={buttonVariants()}>About Next Devotion</Link>
              <Link href="/" className={buttonVariants({ variant: "secondary" })}>Return home</Link>
            </div>
          </section>
        </Container>
      </main>
      <PublicFooter />
    </div>
  );
}
