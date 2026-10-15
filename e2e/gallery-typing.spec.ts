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

/** The Video · Image switch of "Prompt → image → video" really switches (it once showed both panels at once). */
test("the Image tab shows the image prompt and its facts and hides the video ones; arrows move between tabs; state is per item", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  const videoTab = slide.getByRole("tab", { name: "Video" });
  const imageTab = slide.getByRole("tab", { name: "Image" });
  const videoPrompt = slide.getByRole("heading", { name: /video prompt/i });
  const imagePrompt = slide.getByRole("heading", { name: /image prompt/i });
  await expect(videoPrompt).toBeVisible();
  await expect(imagePrompt).toBeHidden();
  const videoFrame = slide.locator("[data-clip-player]").first();
  const videoWidth = (await videoFrame.boundingBox())!.width;
  await imageTab.click();
  await expect(imagePrompt).toBeVisible();
  // The media follow the tab: the image becomes the large one, the clip the small one (and keeps playing).
  await expect.poll(async () => (await videoFrame.boundingBox())!.width).toBeLessThan(videoWidth * 0.7);
  await expect(slide.getByText("art-golden-hour").first()).toBeVisible();
  await expect(videoPrompt).toBeHidden();
  await expect(slide.getByText(/Orazaka run/)).toBeHidden();
  // Keyboard: arrows move the selection of the segmented control.
  await imageTab.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(videoTab).toHaveAttribute("aria-selected", "true");
  await expect(videoPrompt).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(imageTab).toHaveAttribute("aria-selected", "true");
  // State per item: the next item starts on its video.
  await page.getByRole("button", { name: "Next image" }).click();
  const next = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await expect(next.getByRole("heading", { name: /video prompt/i })).toBeVisible();
});

/** The clip is plainly a clip: a badge, it plays by itself in view, it has controls, and it opens larger. */
test("the video says it is a video, plays in view, has play/pause and sound, and opens larger", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  const frame = slide.locator("[data-clip-player]").first();
  await expect(frame.locator("[data-clip-badge]")).toContainText(/Video · 5 s/);
  const video = frame.locator("video");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2)).toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.loop)).toBe(true);
  await frame.hover();
  await frame.getByRole("button", { name: "Pause the video" }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await frame.getByRole("button", { name: "Play the video" }).click();
  await frame.getByRole("button", { name: "Turn the sound on" }).click();
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(false);
  await frame.getByRole("button", { name: "Open the video larger" }).click({ position: { x: 20, y: 200 } });
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("video")).toHaveAttribute("controls", "");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("under reduced motion the clip shows its poster and a play button, and does not play by itself", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const frame = page.locator("#made [data-clip-player]").first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(await frame.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await expect(frame.getByRole("button", { name: "Play the video" }).first()).toBeVisible();
});
