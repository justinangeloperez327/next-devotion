import Link from "next/link";
import { CalendarDays, Settings } from "lucide-react";

import { UserAvatar } from "@/components/user/user-avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProfileHeaderProps = {
  profile: {
    name: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
  };
  isOwner: boolean;
  stats: {
    devotions: number;
    amens: number;
    comments: number;
  };
};

export function ProfileHeader({
  profile,
  isOwner,
  stats,
}: ProfileHeaderProps) {
  const joined = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(profile.createdAt);

  return (
    <section className="border-b border-border pb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <UserAvatar
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          size="xl"
          className="ring-1 ring-border"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                @{profile.username}
              </p>
            </div>

            {isOwner ? (
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "gap-2 self-start",
                )}
              >
                <Settings className="size-3.5" />
                Edit profile
              </Link>
            ) : null}
          </div>

          <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-6 text-foreground/90">
            {profile.bio?.trim() ||
              (isOwner
                ? "Add a short bio in Settings to introduce yourself to the community."
                : "No bio added yet.")}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Joined {joined}
          </div>
        </div>
      </div>

      <dl className="mt-7 grid grid-cols-3 divide-x divide-border border-y border-border">
        <div className="py-4 pr-4">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Devotions
          </dt>
          <dd className="mt-1 text-xl font-medium text-foreground">
            {stats.devotions}
          </dd>
        </div>
        <div className="px-4 py-4">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Amens received
          </dt>
          <dd className="mt-1 text-xl font-medium text-foreground">
            {stats.amens}
          </dd>
        </div>
        <div className="py-4 pl-4">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Comments
          </dt>
          <dd className="mt-1 text-xl font-medium text-foreground">
            {stats.comments}
          </dd>
        </div>
      </dl>

      {isOwner ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/my-devotions"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Personal journal
          </Link>
          <Link
            href="/devotions/new"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Write devotion
          </Link>
        </div>
      ) : null}
    </section>
  );
}
