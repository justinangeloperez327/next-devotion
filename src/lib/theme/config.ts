export const THEME_STORAGE_KEY = "next-devotion-theme";
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function parseTheme(value: unknown): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}

// Runs before the page paints. Only fixed application code is interpolated.
export const THEME_BOOTSTRAP = `(function(){var t='system';try{var v=localStorage.getItem('${THEME_STORAGE_KEY}');if(v==='light'||v==='dark')t=v}catch(e){}var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';r.dataset.themePreference=t})()`;
