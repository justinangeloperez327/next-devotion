"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { parseTheme, resolveTheme, THEME_STORAGE_KEY } from "@/lib/theme/config";
import type { ThemePreference } from "@/lib/theme/config";

const CHANGE_EVENT = "next-devotion-theme-change";
let memoryPreference: ThemePreference | undefined;

function readPreference(): ThemePreference {
  if (memoryPreference !== undefined) return memoryPreference;
  try { return parseTheme(localStorage.getItem(THEME_STORAGE_KEY)); }
  catch { return "system"; }
}

function readSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      memoryPreference = undefined;
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  media.addEventListener("change", notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
    media.removeEventListener("change", notify);
  };
}

function setPreference(preference: ThemePreference) {
  memoryPreference = preference;
  try { localStorage.setItem(THEME_STORAGE_KEY, preference); }
  catch { /* Switching still works when browser storage is unavailable. */ }
  const resolved = resolveTheme(preference, readSystemDark());
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const ThemeContext = createContext({ preference: "system" as ThemePreference, setPreference });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as ThemePreference);
  const systemDark = useSyncExternalStore(subscribe, readSystemDark, () => false);
  useEffect(() => {
    // Read the live store here: hydration initially uses the server snapshot.
    const currentPreference = readPreference();
    const resolved = resolveTheme(currentPreference, readSystemDark());
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = currentPreference;
  }, [preference, systemDark]);
  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
