import { expect, test } from "@playwright/test";

/**
 * The prompt of "Prompt → image → video" types in over its final size: while it types, nothing below it moves
 * (CLS 0 for the block). Measured on the real boxes, in a browser that allows motion.
 */
test("typing the prompt does not move anything below it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  const below = slide.locator("section", { hasText: /Reproduce it/ }).first();
  const quote = slide.locator("[data-typed-prompt]").first();
  await expect(quote).toBeVisible();
  // Distances are measured from the prompt itself, so a scroll of the page cannot be mistaken for a shift of the layout.
  const gap = async () => (await below.boundingBox())!.y - (await quote.boundingBox())!.y;
  const quoteBox = await quote.boundingBox();
  const positions: number[] = [await gap()];
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(400);
    positions.push(await gap());
  }
  const after = await quote.boundingBox();
  // The block is as tall at the first frame as at the last, and the section after it never moved.
  expect(after!.height).toBeCloseTo(quoteBox!.height, 0);
  for (const y of positions) expect(Math.abs(y - positions[0])).toBeLessThan(1);
  // The typed text is laid over the reserved copy: it never makes the block grow.
  const reserved = await slide.locator("[data-typed-reserve]").first().boundingBox();
  expect(reserved!.height).toBeCloseTo(after!.height, 0);
});

test("under reduced motion the whole prompt is there at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const visible = page.locator("#made [data-typed-prompt] [data-typed-visible]").first();
  const reserve = page.locator("#made [data-typed-prompt] [data-typed-reserve]").first();
  await expect(visible).toHaveText((await reserve.textContent())!.trim());
});
