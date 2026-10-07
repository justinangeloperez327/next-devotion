"use client";

import { useEffect } from "react";

import { AppErrorState } from "@/components/states/app-error-state";

export default function Error({
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
    <AppErrorState
      title="This page could not load."
      description="Retry the request or return to the Next Devotion home page."
      onRetry={reset}
      homeHref="/"
      homeLabel="Back home"
    />
  );
}
