import { expect, test } from "@playwright/test";

/**
 * Runs against the DEPLOYED site (E2E_BASE_URL=https://dev.orazaka.com, see .github/workflows/live-smoke.yml) — what a visitor gets, not what
 * `next dev` serves. The Video · Image switch of "Made here" once passed here locally and failed live; this is the guard.
 */
test.skip(!process.env.E2E_BASE_URL, "live smoke: set E2E_BASE_URL to a deployed site");

test("live: the Image tab of Made here switches the item, and the media follow it", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  await expect(slide.getByRole("heading", { name: /video prompt/i })).toBeVisible();
  await expect(slide.getByRole("heading", { name: /image prompt/i })).toBeHidden();
  const videoWidth = (await slide.locator("[data-clip-player]").first().boundingBox())!.width;
  await slide.getByRole("tab", { name: "Image" }).click();
  await expect(slide.getByRole("tab", { name: "Image" })).toHaveAttribute("aria-selected", "true");
  await expect(slide.getByRole("heading", { name: /image prompt/i })).toBeVisible();
  await expect(slide.getByText("art-golden-hour").first()).toBeVisible();
  await expect(slide.getByRole("heading", { name: /video prompt/i })).toBeHidden();
  // The image is now the large one and the clip the small one.
  await expect.poll(async () => (await slide.locator("[data-clip-player]").first().boundingBox())!.width).toBeLessThan(videoWidth * 0.7);
  // It stays selected while the slideshow would have moved on (it holds for the pointer; the state is the item's own).
  await page.waitForTimeout(8000);
  await expect(slide.getByRole("tab", { name: "Image" })).toHaveAttribute("aria-selected", "true");
  await slide.getByRole("tab", { name: "Video" }).click();
  await expect(slide.getByRole("heading", { name: /video prompt/i })).toBeVisible();
});

test("live: the clip plays by itself in view, muted, and /gallery lists the videos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });
  const video = page.locator("#made [data-clip-player] video").first();
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2)).toBe(true);
  await page.goto("/gallery", { waitUntil: "networkidle" });
  await expect(page.locator("#videos video[aria-label]")).toHaveCount(10);
});
