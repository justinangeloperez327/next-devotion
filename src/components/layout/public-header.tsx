"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.18em] text-foreground uppercase"
          onClick={() => setOpen(false)}
        >
          Next Devotion
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "font-normal",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "ml-2 text-foreground",
            )}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "sm" }), "ml-1")}
          >
            Register
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </Container>

      {open ? (
        <div id="mobile-navigation" className="border-t border-border bg-sidebar md:hidden">
          <Container className="grid gap-1 py-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            <Link
              href="/login"
              className="rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "default" }), "mt-1")}
              onClick={() => setOpen(false)}
            >
              Register
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
