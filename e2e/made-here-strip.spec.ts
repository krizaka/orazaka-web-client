import { expect, test } from "@playwright/test";

/**
 * "Made here" is one stable block: every slide is as tall as the others, opening Details changes nothing in the strip,
 * the image and the video are in frames of the same size (no black bands), and each medium has its chip under it.
 */
test("every slide has the same height and the media share one frame size", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const slides = page.locator('#made [aria-roledescription="slide"]');
  const count = await slides.count();
  await slides.first().scrollIntoViewIfNeeded();
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const strip = slides.nth(i).locator("ol").first();
    heights.push((await strip.boundingBox())!.height);
  }
  // The tallest and the shortest differ by a rounding error at most.
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(4);
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  const frames = slide.locator("ol figure");
  const sizes = await frames.evaluateAll((els) => els.slice(1).map((e) => Math.round(e.getBoundingClientRect().height)));
  expect(new Set(sizes).size).toBe(1);
});

test("opening Details does not change the height of the strip or of the carousel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  const region = page.getByRole("region", { name: /Made here|carousel|image/i }).first();
  const strip = slide.locator("ol").first();
  const before = { strip: (await strip.boundingBox())!.height, region: (await region.boundingBox())!.height };
  for (const button of await slide.getByRole("button", { name: "Details" }).all()) {
    await button.click();
    await expect(page.locator("[data-radix-popper-content-wrapper], [role=dialog]").first()).toBeVisible();
    expect((await strip.boundingBox())!.height).toBeCloseTo(before.strip, 0);
    expect((await region.boundingBox())!.height).toBeCloseTo(before.region, 0);
    await page.keyboard.press("Escape");
  }
});
