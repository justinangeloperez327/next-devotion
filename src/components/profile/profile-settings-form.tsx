"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/actions/profile";
import { UserAvatar } from "@/components/user/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialProfileFormState } from "@/lib/profile/types";

type ProfileSettingsFormProps = {
  user: {
    name: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
  };
};

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialProfileFormState,
  );

  return (
    <form action={formAction} className="grid gap-6">
      <div className="flex items-start gap-4 border-b border-border pb-6">
        <UserAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          size="lg"
          className="ring-1 ring-border"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">@{user.username}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Username changes are not enabled yet.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          name="name"
          defaultValue={user.name}
          maxLength={80}
          autoComplete="name"
          aria-invalid={Boolean(state.errors?.name)}
          required
        />
        {state.errors?.name ? (
          <p className="text-xs text-destructive">{state.errors.name}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="profile-bio">Bio</Label>
          <span className="text-[11px] text-muted-foreground">
            Up to 280 characters
          </span>
        </div>
        <Textarea
          id="profile-bio"
          name="bio"
          defaultValue={user.bio ?? ""}
          maxLength={280}
          className="min-h-28"
          placeholder="A short introduction for your devotion profile..."
          aria-invalid={Boolean(state.errors?.bio)}
        />
        {state.errors?.bio ? (
          <p className="text-xs text-destructive">{state.errors.bio}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profile-avatar">Avatar URL</Label>
        <Input
          id="profile-avatar"
          name="avatarUrl"
          type="url"
          inputMode="url"
          defaultValue={user.avatarUrl ?? ""}
          maxLength={2048}
          placeholder="https://example.com/avatar.jpg"
          aria-invalid={Boolean(state.errors?.avatarUrl)}
        />
        {state.errors?.avatarUrl ? (
          <p className="text-xs text-destructive">{state.errors.avatarUrl}</p>
        ) : (
          <p className="text-xs leading-5 text-muted-foreground">
            HTTPS images only. Direct image upload can be added with storage later.
          </p>
        )}
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
          {state.message ?? "Your public profile updates across the app."}
        </p>

        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
