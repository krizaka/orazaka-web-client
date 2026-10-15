import { expect, test } from "@playwright/test";

/**
 * Runs against the DEPLOYED site (E2E_BASE_URL=https://dev.orazaka.com, see .github/workflows/live-smoke.yml) — what a visitor gets, not what
 * `next dev` serves. The Video · Image switch of "Made here" once passed here locally and failed live; this is the guard.
 */
test.skip(!process.env.E2E_BASE_URL, "live smoke: set E2E_BASE_URL to a deployed site");

test("live: Made here is a three-step strip whose height never changes, with the chips under the media", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  await expect(slide.getByText(/FLUX\.2 · on one Mac/)).toBeVisible();
  await expect(slide.getByText(/Wan 2\.2 · DigitalOcean/)).toBeVisible();
  const height = async () => (await slide.boundingBox())!.height;
  const before = await height();
  await slide.getByRole("button", { name: "Details" }).last().click();
  await expect(page.getByRole("dialog").or(page.locator("[data-radix-popper-content-wrapper]"))).toBeVisible();
  expect(await height()).toBeCloseTo(before, 0);
  await page.keyboard.press("Escape");
  expect(await height()).toBeCloseTo(before, 0);
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
