import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { parseTheme, resolveTheme, THEME_BOOTSTRAP } from "@/lib/theme/config";
import { devotionPreview } from "@/lib/devotion/preview";

describe("appearance preference", () => {
  it("accepts only supported preferences and follows the system when unset", () => {
    expect(parseTheme(null)).toBe("system");
    expect(parseTheme("invalid")).toBe("system");
    expect(resolveTheme(parseTheme("dark"), false)).toBe("dark");
    expect(resolveTheme(parseTheme("light"), true)).toBe("light");
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
  it.each(["light", "dark", null, "invalid", "blocked"])("bootstraps %s without depending on client hydration", (saved) => {
    const classes = new Set<string>();
    const root = { dataset: {} as Record<string, string>, classList: { toggle: (name: string, enabled: boolean) => { if (enabled) classes.add(name); else classes.delete(name); } } };
    runInNewContext(THEME_BOOTSTRAP, {
      document: { documentElement: root },
      localStorage: { getItem: () => { if (saved === "blocked") throw new Error("Unavailable"); return saved; } },
      matchMedia: () => ({ matches: true }),
    });
    expect(root.dataset.theme).toBe(saved === "light" ? "light" : "dark");
    expect(classes.has("dark")).toBe(saved !== "light");
  });
});

describe("reading previews", () => {
  it("keeps short text intact and bounds long text without splitting Unicode code points", () => {
    expect(devotionPreview("Short reflection")).toBe("Short reflection");
    expect(devotionPreview("🙂".repeat(300), 240)).toBe("🙂".repeat(240) + "…");
  });
});

function luminance(hex: string) {
  const rgb = hex.replace("#", "").match(/../g)!.map((value) => Number.parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

it("keeps normal text and functional accent colors at WCAG AA contrast in both palettes", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  for (const selector of [":root", ".dark"]) {
    const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
    const tokens = Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[a-f0-9]{6})/g)].map((match) => [match[1], match[2]]));
    for (const surface of ["background", "card", "sidebar"]) {
      for (const text of ["foreground", "muted-foreground", "primary", "devotion-sage", "destructive"]) {
        expect(contrast(tokens[text], tokens[surface]), `${selector}: ${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    expect(contrast(tokens.primary, tokens["primary-foreground"])).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.destructive, tokens["destructive-foreground"])).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.input, tokens.card)).toBeGreaterThanOrEqual(3);
  }
});
