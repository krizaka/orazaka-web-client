import { expect, test } from "@playwright/test";

/** /gallery is the whole "Made here" catalogue: a Videos section with every published clip, then the images. */
test("the Videos section lists every clip with its prompt, facts and command, and the Video · Image switch works where a clip has an image", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gallery");
  const videos = page.locator("#videos");
  await expect(videos.getByRole("heading", { level: 2, name: "Videos" })).toBeVisible();
  const cards = videos.locator("article[aria-label]");
  await expect(cards).toHaveCount(10);
  await expect(videos.locator("video[aria-label]")).toHaveCount(10);
  const tea = videos.locator("#video-tea-pour");
  await tea.scrollIntoViewIfNeeded();
  await expect(tea.getByText(/Orazaka run/)).toBeVisible();
  await expect(tea.getByText(/orazaka video "/).first()).toBeVisible();
  await tea.getByRole("tab", { name: "Image" }).click();
  await expect(tea.getByRole("heading", { name: /image prompt/i })).toBeVisible();
  await expect(tea.getByText(/Orazaka run/)).toBeHidden();
  // The filter: videos only.
  await page.getByRole("link", { name: "Videos", exact: true }).first().click();
  await expect(page).toHaveURL(/kind=videos/);
  await expect(page.locator("#credits")).toBeVisible();
});

test("a clip is a full-width 16:9 card on a phone, with no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gallery?kind=videos");
  const first = page.locator("#videos video").first();
  await first.scrollIntoViewIfNeeded();
  const box = (await first.boundingBox())!;
  expect(box.width).toBeGreaterThan(390 - 2 * 24 - 40);
  expect(box.width / box.height).toBeCloseTo(26 / 15, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("Compare models: one prompt, every model's image side by side with where it ran and its run id; one column on a phone", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gallery?kind=compare");
  const compare = page.locator("#compare");
  await expect(compare.getByRole("heading", { level: 2, name: "Compare models" })).toBeVisible();
  const card = compare.locator("#compare-alps-dawn");
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByRole("img")).toHaveCount(3);
  await expect(card.getByText("DigitalOcean serverless inference")).toBeVisible();
  await expect(card.getByText("One Mac (Metal) — nothing left the machine").first()).toBeVisible();
  await expect(card.getByText("$0.08 an image")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
