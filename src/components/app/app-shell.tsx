import Link from "next/link";
import { PenLine, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { logoutAction } from "@/actions/auth";
import {
  DesktopNavigation,
  MobileNavigation,
} from "@/components/app/app-navigation";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";

type AppShellUser = {
  name: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
};

type AppShellProps = {
  user: AppShellUser;
  children: ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-sidebar">
        <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:h-16 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_auto] lg:px-0">
          <Link
            href="/feed"
            className="truncate text-[13px] font-semibold tracking-[0.16em] text-foreground uppercase sm:text-sm sm:tracking-[0.18em] lg:border-r lg:border-sidebar-border lg:px-5"
          >
            Next Devotion
          </Link>

          <div className="hidden px-6 lg:block">
            <p className="text-xs text-muted-foreground">
              Read. Reflect. Apply. Pray.
            </p>
          </div>

          <div className="flex items-center gap-2 lg:pr-5">
            <Link
              href="/devotions/new"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden gap-2 sm:inline-flex",
              )}
            >
              <PenLine className="size-4" />
              New devotion
            </Link>

            <details className="group relative">
              <summary aria-label="Open account menu" className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-md border border-border bg-card px-2.5 text-sm text-foreground transition-colors hover:bg-accent sm:h-9 [&::-webkit-details-marker]:hidden">
                <UserAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  size="xs"
                />
                <span className="hidden max-w-28 truncate md:block">
                  {user.name}
                </span>
              </summary>

              <div className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-1.5rem))] rounded-lg border border-border bg-popover p-2 shadow-lg shadow-black/20">
                <div className="border-b border-border px-2 py-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                </div>

                <div className="grid gap-1 py-2">
                  <Link
                    href={`/profile/${user.username}`}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <UserRound className="size-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </div>

                <form action={logoutAction} className="border-t border-border pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          <DesktopNavigation username={user.username} />

          <div className="mt-auto border-t border-sidebar-border p-4">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </aside>

        <div id="main-content" tabIndex={-1} className="min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</div>
      </div>

      <MobileNavigation username={user.username} />
    </div>
  );
}
