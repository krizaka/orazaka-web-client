import { test, expect } from "@playwright/test";

/** The hero must not move while the sovereign chat plays: its box is the same at the start and at the end (CLS 0). */
for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["phone", { width: 390, height: 844 }]] as const) {
  test(`the hero keeps its height while the chat plays (${name})`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() => {
      (window as unknown as { shifts: number }).shifts = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) (window as unknown as { shifts: number }).shifts += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/");
    const hero = page.locator(".landing-hero").first();
    await expect(hero).toBeVisible();
    const heights = new Set<number>();
    for (let t = 0; t < 12; t++) {
      heights.add(Math.round((await hero.boundingBox())!.height));
      await page.waitForTimeout(500);
    }
    await expect(page.getByText(/routed locally/i).last()).toBeVisible();
    heights.add(Math.round((await hero.boundingBox())!.height));
    expect([...heights]).toHaveLength(1);
    expect(await page.evaluate(() => (window as unknown as { shifts: number }).shifts)).toBeLessThan(0.01);
  });
}
