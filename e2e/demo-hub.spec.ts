import { expect, test } from "@playwright/test";

/** /gallery is Orazaka's demo: the hub of images, videos, comparisons, documents and a day of work. */
test("the bar's Demo leads to /gallery, which holds the day of work and an honest documents placeholder", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Demo", exact: true }).first().click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.locator("#demo-creations")).toBeAttached();
  await expect(page.locator("#documents")).toContainText(/interactive replays/i);
  // No fake recording stands in for the documents.
  await expect(page.locator("#documents video")).toHaveCount(0);
  await page.getByRole("link", { name: "A day of work" }).click();
  await expect(page).toHaveURL(/kind=day/);
  await expect(page.locator("#demo-chat")).toBeAttached();
});

test("the home keeps a Made here teaser at #demo with a way to the demo, and an old #demo-<clip> link lands on the clip", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#demo")).toBeAttached();
  await expect(page.locator("#made").getByRole("link", { name: "See the demo" })).toHaveAttribute("href", "/gallery");
  await page.goto("/#demo-chat");
  await expect(page).toHaveURL(/\/gallery#demo-chat$/, { timeout: 15_000 });
  await expect(page.locator("#demo-chat")).toBeAttached();
});
