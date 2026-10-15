import { test, expect } from "@playwright/test";

/**
 * Every link of the public home leads to a real place: no 4xx/5xx, no login wall for public content, and a hash
 * always names an element that exists on its target page. Walks the links of the sections that sell the product
 * (Platform · Demo · Studios · Packs · Models) and the bar, in English and French.
 */
for (const locale of ["en", "fr"] as const) {
  test.describe(`home links (${locale})`, () => {
    test.use({ locale: locale === "fr" ? "fr-FR" : "en-US", storageState: { cookies: [{ name: "NEXT_LOCALE", value: locale, domain: "localhost", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }], origins: [] } });

    test("no link is broken, none lands on a login wall, every hash has its target", async ({ page }) => {
      test.setTimeout(240_000); // the dev server compiles each route on first visit
      await page.goto("/");
      const hrefs = await page.$$eval("header a[href], main a[href], footer a[href]", (as) => [...new Set(as.map((a) => a.getAttribute("href") ?? ""))]);
      const internal = hrefs.filter((h) => (h.startsWith("/") || h.startsWith("#")) && !h.startsWith("//"));
      expect(internal.length).toBeGreaterThan(15);

      const problems: string[] = [];
      for (const href of internal) {
        const target = href.startsWith("#") ? `/${href}` : href;
        const [path, hash] = target.split("#");
        const res = await page.goto(path || "/");
        if (!res || res.status() >= 400) problems.push(`${href}: HTTP ${res?.status()}`);
        if (href !== "/login" && new URL(page.url()).pathname === "/login") problems.push(`${href}: lands on the login wall`);
        if (hash && (await page.locator(`[id="${hash}"]`).count()) === 0) problems.push(`${href}: no element #${hash}`);
      }
      expect(problems).toEqual([]);
    });

    test("each Studio card leads to its own recording or pack, scrolled into view", async ({ page }) => {
      await page.goto("/");
      await page.locator("#studios a[href='/gallery#demo-documents']").click();
      await expect(page.locator("#demo-documents")).toBeInViewport({ timeout: 15_000 });
      await page.goto("/");
      await page.locator("#studios a[href='/docs/packs#trade-showcase']").click();
      await expect(page).toHaveURL(/\/docs\/packs#trade-showcase$/, { timeout: 30_000 });
    });

    test("the Mac band leads to /desktop, which offers the build or, failing GitHub, the releases page", async ({ page }) => {
      await page.goto("/");
      await page.locator("#mac a[href='/desktop']").click();
      await expect(page).toHaveURL(/\/desktop$/, { timeout: 30_000 });
      const download = page.locator("a[href$='.dmg']");
      const releases = page.locator("a[href='https://github.com/krizaka/orazaka/releases']");
      expect((await download.count()) + (await releases.count())).toBeGreaterThan(0);
      await expect(page.getByRole("note")).toBeVisible();
    });

    test("the Product menu reaches Models, Gallery, Studios and Packs", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("navigation", { name: "Orazaka" }).getByRole("button").first().click();
      for (const h of ["a[href='/models']", "a[href='/desktop']", "a[href='/gallery']", "a[href$='#studios']", "a[href$='#packs']", "a[href$='#how']"]) {
        await expect(page.locator(`[data-radix-navigation-menu-viewport] ${h}, [role=menu] ${h}, header ${h}`).first()).toBeVisible();
      }
    });
  });
}
