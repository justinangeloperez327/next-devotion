import { expect, test } from "@playwright/test";

const publicPages = ["/", "/login", "/register", "/about", "/contact"];

for (const theme of ["light", "dark"] as const) {
  test(`${theme} theme persists across public pages without horizontal overflow`, async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Color theme" }).selectOption(theme);
    for (const path of publicPages) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("combobox", { name: "Color theme" })).toHaveValue(theme);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.goto("/");
    await page.screenshot({ path: testInfo.outputPath(`home-${theme}.png`), fullPage: true });
    await page.goto("/register");
    await page.screenshot({ path: testInfo.outputPath(`register-${theme}.png`), fullPage: true });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  });
}

test("system preference tracks the device and an explicit choice takes priority", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const control = page.getByRole("combobox", { name: "Color theme" });
  await expect(control).toHaveValue("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await control.selectOption("dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await control.selectOption("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("a saved theme applies before client bundles load", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("next-devotion-theme", "dark"));
  await page.route("**/_next/static/**/*.js*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 26, 24)");
});

test("theme choice synchronizes across tabs", async ({ page, context }) => {
  await page.goto("/");
  const second = await context.newPage();
  await second.goto("/login");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("dark");
  await expect(second.locator("html")).toHaveAttribute("data-theme", "dark");
  await second.getByRole("combobox", { name: "Color theme" }).selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("theme switching still works when storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage blocked"); };
    Storage.prototype.setItem = () => { throw new Error("Storage blocked"); };
  });
  await page.goto("/");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("compact layout fits a 320px viewport with keyboard-accessible controls", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    await page.getByRole("combobox", { name: "Color theme" }).selectOption(theme);
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Close navigation" }).click();
  }
  await page.getByRole("combobox", { name: "Color theme" }).focus();
  await expect(page.getByRole("combobox", { name: "Color theme" })).toBeFocused();
});
