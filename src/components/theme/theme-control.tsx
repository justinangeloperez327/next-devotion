"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { parseTheme } from "@/lib/theme/config";
import { cn } from "@/lib/utils";

export function ThemeControl({ compact = true }: { compact?: boolean }) {
  const { preference, setPreference } = useTheme();
  const Icon = preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;
  return (
    <label
      title={`Color theme: ${preference}`}
      className={cn("relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-card text-sm text-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring", compact ? "w-11 sm:w-auto sm:px-3" : "w-fit px-3")}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">Color theme</span>
      <select
        aria-label="Color theme"
        value={preference}
        onChange={(event) => setPreference(parseTheme(event.target.value))}
        className={cn("min-h-11 cursor-pointer bg-transparent text-sm outline-none", compact ? "absolute inset-0 w-full opacity-0 sm:static sm:w-auto sm:opacity-100" : "max-w-full")}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}
