import { expect, test } from "@playwright/test";

test.describe("public experience", () => {
  test("homepage exposes the primary journey", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Make time for what matters.",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Start your devotion",
      }),
    ).toHaveAttribute("href", "/register");

    await expect(
      page.getByRole("link", {
        name: "Log in",
        exact: true,
      }).first(),
    ).toHaveAttribute("href", "/login");
  });

  test("skip link moves keyboard focus to main content", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", {
      name: "Skip to main content",
    });

    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");

    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("contact page communicates unavailable submission clearly", async ({
    page,
  }) => {
    await page.goto("/contact");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "We would like to hear from you.",
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Contact messaging is temporarily unavailable."),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Send message",
      }),
    ).toBeDisabled();
  });

  test("mobile navigation opens and exposes public routes", async (
    { page },
    testInfo,
  ) => {
    test.skip(
      testInfo.project.name !== "mobile-chrome",
      "Mobile navigation is only applicable to the mobile project.",
    );

    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();

    const navigation = page.getByRole("navigation", {
      name: "Mobile navigation",
    });

    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole("link", { name: "About" })).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: "Contact" }),
    ).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: "Register" }),
    ).toBeVisible();
  });
});
