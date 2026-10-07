import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test("authenticated user can create and delete a private devotion", async ({
  page,
}) => {
  test.skip(
    !email || !password,
    "Set E2E_EMAIL and E2E_PASSWORD to run authenticated browser coverage.",
  );

  const marker = `E2E reflection ${Date.now()}`;

  await page.goto("/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/feed$/);

  await page.goto("/devotions/new");

  await page.getByRole("button", { name: "Manual" }).click();
  await page.getByLabel("Reference").fill("John 15:5");
  await page
    .getByPlaceholder(
      "Write what you notice before trying to solve or apply it...",
    )
    .fill(marker);
  await page
    .getByPlaceholder("How will you live this out today?")
    .fill("Return to Scripture before reacting to pressure.");
  await page
    .getByPlaceholder("Write your prayer...")
    .fill("Help me remain connected to You today.");

  await page.getByRole("button", { name: "Private" }).click();
  await page.getByRole("button", { name: "Post devotion" }).click();

  await expect(page).toHaveURL(/\/devotions\/[0-9a-f-]+$/i);
  await expect(page.getByText(marker)).toBeVisible();
  await expect(page.getByText("Private devotion")).toBeVisible();

  await page.getByText("Delete", { exact: true }).click();
  await page.getByRole("button", { name: "Delete permanently" }).click();

  await expect(page).toHaveURL(/\/my-devotions$/);
  await expect(page.getByText(marker)).toHaveCount(0);
});
