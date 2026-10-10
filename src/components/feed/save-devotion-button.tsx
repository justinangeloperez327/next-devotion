"use client";

import { Bookmark } from "lucide-react";
import { useOptimistic, useTransition } from "react";

import { setSavedDevotionAction } from "@/actions/saved-devotions";
import { cn } from "@/lib/utils";

type SaveDevotionButtonProps = {
  devotionId: string;
  initialSaved: boolean;
  disabled?: boolean;
};

export function SaveDevotionButton({
  devotionId,
  initialSaved,
  disabled = false,
}: SaveDevotionButtonProps) {
  const [pending, startTransition] = useTransition();
  const [saved, setOptimisticSaved] = useOptimistic<boolean, boolean>(
    initialSaved,
    (_state, nextSaved) => nextSaved,
  );

  function handleClick() {
    const nextSaved = !saved;

    startTransition(async () => {
      setOptimisticSaved(nextSaved);
      const success = await setSavedDevotionAction(devotionId, nextSaved);

      if (!success) {
        setOptimisticSaved(!nextSaved);
      }
    });
  }

  return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved devotions" : "Save devotion"}
        className={cn(
          "flex h-12 w-full min-w-0 items-center justify-center gap-1.5 border-l border-border px-1 text-xs transition-colors sm:h-11 sm:gap-2",
          disabled || pending
            ? "cursor-default text-muted-foreground opacity-60"
            : "hover:bg-accent",
          saved
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Bookmark className={cn("size-4", saved && "fill-current")} />
        <span aria-live="polite" aria-atomic="true">
          {saved ? "Saved" : "Save"}
        </span>
      </button>
  );
}
