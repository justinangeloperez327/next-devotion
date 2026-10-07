"use client";

import { Globe2, Lock } from "lucide-react";
import { useActionState, useState } from "react";

import { updatePrivacyAction } from "@/actions/privacy";
import { Button } from "@/components/ui/button";
import { initialPrivacyFormState } from "@/lib/privacy/types";
import { cn } from "@/lib/utils";

type Visibility = "PUBLIC" | "PRIVATE";

type PrivacySettingsFormProps = {
  defaultVisibility: Visibility;
};

export function PrivacySettingsForm({
  defaultVisibility,
}: PrivacySettingsFormProps) {
  const [visibility, setVisibility] =
    useState<Visibility>(defaultVisibility);
  const [state, formAction, pending] = useActionState(
    updatePrivacyAction,
    initialPrivacyFormState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <input
        type="hidden"
        name="defaultDevotionVisibility"
        value={visibility}
      />

      <div>
        <h2 className="text-base font-medium text-foreground">
          Default devotion visibility
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          New devotions start with this visibility. You can still change it
          before posting or later when editing a devotion.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={visibility === "PUBLIC"}
          onClick={() => setVisibility("PUBLIC")}
          className={cn(
            "rounded-md border p-4 text-left transition-colors",
            visibility === "PUBLIC"
              ? "border-primary/70 bg-primary/5"
              : "border-border bg-card hover:bg-accent",
          )}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Globe2
              className={cn(
                "size-4",
                visibility === "PUBLIC"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            />
            Public
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted-foreground">
            New devotions can appear in the community feed and on your public
            profile.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={visibility === "PRIVATE"}
          onClick={() => setVisibility("PRIVATE")}
          className={cn(
            "rounded-md border p-4 text-left transition-colors",
            visibility === "PRIVATE"
              ? "border-primary/70 bg-primary/5"
              : "border-border bg-card hover:bg-accent",
          )}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lock
              className={cn(
                "size-4",
                visibility === "PRIVATE"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            />
            Private
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted-foreground">
            New devotions stay in your personal journal unless you explicitly
            make them public.
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={
            state.status === "error"
              ? "text-xs text-destructive"
              : state.status === "success"
                ? "text-xs text-devotion-sage"
                : "text-xs text-muted-foreground"
          }
          role={state.status === "error" ? "alert" : undefined}
        >
          {state.message ??
            "Changing the default does not change existing devotions."}
        </p>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save privacy"}
        </Button>
      </div>
    </form>
  );
}
