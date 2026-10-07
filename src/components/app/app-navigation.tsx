"use client";

import Link from "next/link";
import {
  Bookmark,
  BookOpenText,
  Home,
  PenLine,
  Settings,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type AppNavigationProps = {
  username: string;
};

const baseItems = [
  {
    href: "/feed",
    label: "Home",
    icon: Home,
  },
  {
    href: "/my-devotions",
    label: "My Devotions",
    icon: BookOpenText,
  },
  {
    href: "/saved",
    label: "Saved",
    icon: Bookmark,
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavigation({ username }: AppNavigationProps) {
  const pathname = usePathname();

  const items = [
    ...baseItems,
    {
      href: `/profile/${username}`,
      label: "Profile",
      icon: UserRound,
    },
  ];

  return (
    <nav className="grid gap-1 p-3" aria-label="Application navigation">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-[18px]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className="my-2 border-t border-sidebar-border" />

      <Link
        href="/settings"
        aria-current={isActive(pathname, "/settings") ? "page" : undefined}
        className={cn(
          "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
          isActive(pathname, "/settings")
            ? "bg-sidebar-accent text-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
        )}
      >
        <Settings
          className={cn(
            "size-[18px]",
            isActive(pathname, "/settings")
              ? "text-primary"
              : "text-muted-foreground",
          )}
        />
        <span>Settings</span>
      </Link>
    </nav>
  );
}

export function MobileNavigation({ username }: AppNavigationProps) {
  const pathname = usePathname();

  const items = [
    {
      href: "/feed",
      label: "Home",
      icon: Home,
    },
    {
      href: "/my-devotions",
      label: "Devotions",
      icon: BookOpenText,
    },
    {
      href: "/devotions/new",
      label: "Write",
      icon: PenLine,
      primary: true,
    },
    {
      href: "/saved",
      label: "Saved",
      icon: Bookmark,
    },
    {
      href: `/profile/${username}`,
      label: "Profile",
      icon: UserRound,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-sidebar pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile application navigation"
    >
      <div className="mx-auto grid min-h-16 max-w-xl grid-cols-5 px-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center",
                  item.primary &&
                    "size-9 rounded-md bg-primary text-primary-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px]",
                    !item.primary && active && "text-primary",
                  )}
                />
              </span>
              <span className={cn("max-w-full truncate", item.primary && "text-primary")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
