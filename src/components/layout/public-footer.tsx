import Link from "next/link";

import { Container } from "@/components/layout/container";

export function PublicFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-medium tracking-[0.12em] text-foreground uppercase"
          >
            Next Devotion
          </Link>
          <span className="hidden text-border sm:inline" aria-hidden="true">
            /
          </span>
          <p className="hidden sm:block">Read. Reflect. Apply. Pray.</p>
        </div>

        <nav className="flex items-center gap-5" aria-label="Footer navigation">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
