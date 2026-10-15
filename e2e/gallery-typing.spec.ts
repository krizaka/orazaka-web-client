import { expect, test } from "@playwright/test";

/** The video prompt types in inside its popover (Details of step 3), over its final size: the block never grows while it types. */
test("the video prompt types over its final size in the Details popover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const slide = page.locator('#made [aria-roledescription="slide"][data-active]').first();
  await slide.scrollIntoViewIfNeeded();
  await slide.getByRole("button", { name: "Details" }).last().click();
  const quote = page.locator("[data-typed-prompt]").first();
  await expect(quote).toBeVisible();
  const height = (await quote.boundingBox())!.height;
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(300);
    expect((await quote.boundingBox())!.height).toBeCloseTo(height, 0);
  }
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
