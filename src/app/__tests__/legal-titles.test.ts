import fs from "node:fs";
import path from "node:path";

/** krizaka/orazaka#443: privacy and terms say it plainly — no internal jargon, sentence case, a title of their own. */
const JARGON = /invariant|telemetry|bridges|bare-metal|zéro|passerelles|prédictions/i;

describe.each(["privacy", "terms", "login"])("/%s", (route) => {
  const dir = path.join(__dirname, "..", route);
  it("has its own page title", () => {
    expect(fs.readFileSync(path.join(dir, "layout.tsx"), "utf8")).toMatch(/title: "[^"]+ — Orazaka"/);
  });
  if (route !== "login") {
    it("uses no internal jargon in its headings, and no Title Case", () => {
      const titles = [...fs.readFileSync(path.join(dir, "page.tsx"), "utf8").matchAll(/title: "([^"]+)"/g)].map((m) => m[1]);
      expect(titles.length).toBeGreaterThan(4);
      for (const t of titles) {
        expect(t).not.toMatch(JARGON);
        expect(t).not.toMatch(/^(\d\. )?[A-Z]\w*( [A-Z]\w*){2,}/);
      }
    });
  }
});
