import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ consoleGuard: void }>({
  consoleGuard: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat|didn't match|React error/i.test(message.text())) errors.push(message.text());
    });
    await use();
    expect(errors, "Browser runtime and hydration errors").toEqual([]);
  }, { auto: true }],
});

export { expect };
