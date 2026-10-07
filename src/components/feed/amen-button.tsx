"use client";

import { Heart } from "lucide-react";
import { useOptimistic } from "react";

import { toggleAmenAction } from "@/actions/amens";
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
  const [optimistic, toggleOptimistic] = useOptimistic<AmenState, void>(
    {
      hasAmen: initialHasAmen,
      count: initialAmenCount,
    },
    (state) => ({
      hasAmen: !state.hasAmen,
      count: Math.max(0, state.count + (state.hasAmen ? -1 : 1)),
    }),
  );

  async function action() {
    toggleOptimistic();
    await toggleAmenAction(devotionId);
  }

  return (
    <form action={action} className="contents">
      <button
        type="submit"
        disabled={disabled}
        aria-pressed={optimistic.hasAmen}
        aria-label={
          optimistic.hasAmen
            ? "Remove Amen from this devotion"
            : "Amen this devotion"
        }
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 text-xs transition-colors",
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
        <span aria-label={`${optimistic.count} Amens`}>
          {optimistic.count}
        </span>
      </button>
    </form>
  );
}
