"use client";

import { Bookmark } from "lucide-react";
import { useOptimistic } from "react";

import { toggleSavedDevotionAction } from "@/actions/saved-devotions";
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
  const [saved, setOptimisticSaved] = useOptimistic<boolean, null>(
    initialSaved,
    (state) => !state,
  );

  async function action() {
    setOptimisticSaved(null);
    await toggleSavedDevotionAction(devotionId);
  }

  return (
    <form action={action} className="contents">
      <button
        type="submit"
        disabled={disabled}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved devotions" : "Save devotion"}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 border-l border-border text-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60",
          disabled
            ? "cursor-default text-muted-foreground opacity-60"
            : "hover:bg-accent",
          saved
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Bookmark className={cn("size-4", saved && "fill-current")} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
    </form>
  );
}
