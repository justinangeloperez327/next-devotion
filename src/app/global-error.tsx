"use client";

import "./globals.css";
import { THEME_BOOTSTRAP } from "@/lib/theme/config";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head>
      <body className="min-h-svh bg-background text-foreground">
        <main className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-4 py-16">
          <section className="w-full border-y border-border py-10">
            <p className="text-xs font-medium text-primary">
              Application error
            </p>
            <h1 className="mt-3 text-3xl font-medium">
              Next Devotion could not load.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Retry the application. If the problem continues, return later after the service is available.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
