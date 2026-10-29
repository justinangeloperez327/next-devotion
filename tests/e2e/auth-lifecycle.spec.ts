import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";

test.setTimeout(90_000);

test("register, persist session, log out, reject wrong password, and log in again", async ({ page, context }, testInfo) => {
  test.skip(process.env.E2E_AUTH_ENABLED !== "true", "Requires an isolated migrated test database.");
  const username = `test${randomUUID().replaceAll("-", "").slice(0, 20)}`;
  const email = `${username}@example.com`;
  const password = "Test-password-123";
  await page.goto("/register");
  await page.getByLabel("Name", { exact: true }).fill("Test Reader");
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).toHaveURL(/\/feed$/);
  await page.reload();
  await expect(page).toHaveURL(/\/feed$/);
  const cookie = (await context.cookies()).find((entry) => entry.name.endsWith("next_devotion_session"));
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  // App navigation is available on desktop and inside the mobile menu.
  const logout = page.getByRole("button", { name: "Log out", exact: true });
  if (!await logout.isVisible()) await page.getByLabel("Open account menu", { exact: true }).click();
  await logout.click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Wrong-password-123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("#login-status")).toContainText("incorrect");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/feed$/);
  // Exercise the redesigned authenticated screens and reading/comment flow.
  const fullObservation = "A reflection worth remembering. ".repeat(20) + "The complete reflection ends here.";
  await page.goto("/devotions/new");
  await page.getByRole("button", { name: "Manual", exact: true }).click();
  await page.getByLabel("Reference", { exact: true }).fill("Psalm 46:10");
  await page.getByLabel("Observation", { exact: true }).fill(fullObservation);
  await page.getByLabel("Application", { exact: true }).fill("Pause and reflect before starting the day.");
  await page.getByLabel("Prayer", { exact: true }).fill("Lord, help me listen to Your Word.");
  await page.getByRole("button", { name: "Public", exact: true }).click();
  await page.getByRole("button", { name: "Post devotion", exact: true }).click();
  await expect(page).toHaveURL(/\/devotions\/[0-9a-f-]+$/i);
  const devotionURL = page.url();
  await expect(page.getByText(fullObservation, { exact: true })).toBeVisible();
  const comment = `An encouraging comment ${username}`;
  await page.getByRole("textbox", { name: "Comment", exact: true }).fill(comment);
  await page.getByRole("button", { name: "Post comment", exact: true }).click();
  await expect(page.locator("#comments article").filter({ hasText: comment })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Comment", exact: true })).toHaveValue("");

  for (const theme of ["light", "dark"]) {
    await page.getByRole("combobox", { name: "Color theme" }).first().selectOption(theme);
    for (const path of ["/feed", "/my-devotions", "/saved", `/profile/${username}`, "/settings", "/devotions/new", devotionURL]) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath(`devotion-${theme}.png`), fullPage: true });
  }
  await page.goto("/feed");
  const card = page.locator("article").filter({ has: page.getByRole("link", { name: "Psalm 46:10", exact: true }) }).first();
  await expect(card.getByText(fullObservation, { exact: true })).toHaveCount(0);
  await card.getByRole("link", { name: "Read devotion", exact: true }).click();
  await expect(page.getByText(fullObservation, { exact: true })).toBeVisible();
  const commentRow = page.locator("#comments article").filter({ hasText: comment });
  await commentRow.getByLabel("Delete comment", { exact: true }).click();
  await commentRow.getByRole("button", { name: "Delete comment", exact: true }).click();
  await expect(page.locator("#comments article").filter({ hasText: comment })).toHaveCount(0);
  await page.getByText("Delete", { exact: true }).click();
  await page.getByRole("button", { name: "Delete permanently", exact: true }).click();
  await expect(page).toHaveURL(/\/my-devotions$/);

});

test("registration works without JavaScript and submits a valid origin", async ({ browser, baseURL }, testInfo) => {
  test.skip(process.env.E2E_AUTH_ENABLED !== "true", "Requires an isolated migrated test database.");
  test.skip(testInfo.project.name !== "chromium", "One progressive-enhancement regression is sufficient.");
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    const username = `test${randomUUID().replaceAll("-", "").slice(0, 20)}`;
    await page.goto("/register");
    await page.getByLabel("Name", { exact: true }).fill("No Script Reader");
    await page.getByLabel("Username", { exact: true }).fill(username);
    await page.getByLabel("Email", { exact: true }).fill(`${username}@example.com`);
    await page.getByLabel("Password", { exact: true }).fill("Test-password-123");
    await page.getByLabel("Confirm password", { exact: true }).fill("Test-password-123");
    const origin = new URL(page.url()).origin;
    const requestPromise = page.waitForRequest((request) =>
      request.method() === "POST" && new URL(request.url()).pathname === "/register",
    );
    await page.getByRole("button", { name: "Create account", exact: true }).click();
    const request = await requestPromise;
    expect(await request.headerValue("origin")).toBe(origin);
    await expect(page).toHaveURL(/\/feed$/);
  } finally {
    await context.close();
  }
});
