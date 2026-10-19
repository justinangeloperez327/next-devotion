import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";

test("register, persist session, log out, reject wrong password, and log in again", async ({ page, context }) => {
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
  await expect(page.getByRole("alert")).toContainText("incorrect");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/feed$/);
});
