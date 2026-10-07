import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { deleteDevotionAction } from "@/actions/devotions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DevotionOwnerActionsProps = {
  devotionId: string;
};

export function DevotionOwnerActions({
  devotionId,
}: DevotionOwnerActionsProps) {
  const deleteAction = deleteDevotionAction.bind(null, devotionId);

  return (
    <div className="flex w-full items-start gap-2 sm:w-auto">
      <Link
        href={`/devotions/${devotionId}/edit`}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "min-h-10 flex-1 gap-2 sm:flex-none",
        )}
      >
        <Pencil className="size-3.5" />
        Edit
      </Link>

      <details className="relative">
        <summary
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "min-h-10 cursor-pointer list-none gap-2 text-destructive hover:text-destructive [&::-webkit-details-marker]:hidden",
          )}
        >
          <Trash2 className="size-3.5" />
          Delete
        </summary>

        <div className="absolute right-0 z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-4 shadow-lg shadow-black/20">
          <p className="text-sm font-medium text-foreground">
            Delete this devotion?
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            This permanently removes the devotion and its related activity.
            This action cannot be undone.
          </p>
          <form action={deleteAction} className="mt-4">
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "destructive", size: "sm" }),
                "w-full",
              )}
            >
              Delete permanently
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
