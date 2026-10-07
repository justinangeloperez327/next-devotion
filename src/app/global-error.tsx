"use client";

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
    <html lang="en" className="dark">
      <body className="min-h-svh bg-[#171817] text-[#f1f0ea]">
        <main className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-4 py-16">
          <section className="w-full border-y border-[#343734] py-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#c9b98a]">
              Application error
            </p>
            <h1 className="mt-3 text-3xl font-medium">
              Next Devotion could not load.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#aaafa8]">
              Retry the application. If the problem continues, return later after the service is available.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 inline-flex h-10 items-center justify-center rounded-md bg-[#c9b98a] px-4 text-sm font-medium text-[#171817]"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
