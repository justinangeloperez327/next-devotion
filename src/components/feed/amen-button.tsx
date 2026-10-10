"use client";

import { Heart } from "lucide-react";
import { useOptimistic, useTransition } from "react";

import { setAmenAction } from "@/actions/amens";
import { cn } from "@/lib/utils";

type AmenButtonProps = {
  devotionId: string;
  initialHasAmen: boolean;
  initialAmenCount: number;
  disabled?: boolean;
};

type AmenState = {
  hasAmen: boolean;
  count: number;
};

export function AmenButton({
  devotionId,
  initialHasAmen,
  initialAmenCount,
  disabled = false,
}: AmenButtonProps) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic<AmenState, boolean>(
    {
      hasAmen: initialHasAmen,
      count: initialAmenCount,
    },
    (state, nextHasAmen) => ({
      hasAmen: nextHasAmen,
      count: Math.max(
        0,
        state.count +
          (nextHasAmen === state.hasAmen ? 0 : nextHasAmen ? 1 : -1),
      ),
    }),
  );

  function handleClick() {
    const nextHasAmen = !optimistic.hasAmen;

    startTransition(async () => {
      setOptimistic(nextHasAmen);
      await setAmenAction(devotionId, nextHasAmen);
    });
  }

  return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending}
        aria-pressed={optimistic.hasAmen}
        aria-label={
          optimistic.hasAmen
            ? "Remove Amen from this devotion"
            : "Amen this devotion"
        }
        className={cn(
          "flex h-12 w-full min-w-0 items-center justify-center gap-1.5 px-1 text-xs transition-colors sm:h-11 sm:gap-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60",
          disabled
            ? "cursor-default text-muted-foreground opacity-60"
            : "hover:bg-accent",
          optimistic.hasAmen
            ? "text-devotion-sage"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Heart
          className={cn(
            "size-4",
            optimistic.hasAmen && "fill-current",
          )}
        />
        <span>Amen</span>
        <span
          aria-live="polite"
          aria-atomic="true"
          aria-label={`${optimistic.count} Amens`}
        >
          {optimistic.count}
        </span>
      </button>
  );
}
