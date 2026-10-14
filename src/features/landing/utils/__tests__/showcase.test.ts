import { clipsFor, packsFor } from "@/features/landing/utils/showcase";
import data from "@/features/landing/utils/showcase.generated.json";

describe("landing showcase", () => {
  it("points every recording at the CDN, with its hash, in both encodings and a poster", () => {
    for (const c of clipsFor("en")) {
      expect(c.webm).toMatch(/^https:\/\/.+\/site\/products\/orazaka\/tour\/[a-z]+\.[0-9a-f]{10}\.webm$/);
      expect(c.mp4).toMatch(/\.[0-9a-f]{10}\.mp4$/);
      expect(c.poster).toMatch(/\.[0-9a-f]{10}\.jpg$/);
    }
  });

  it("has words in both languages for every recording and pack", () => {
    for (const l of ["en", "fr"] as const) {
      for (const c of clipsFor(l)) expect(`${c.label}${c.caption}`).not.toBe("");
      for (const p of packsFor(l)) expect(`${p.label}${p.tagline}`).not.toBe("");
    }
  });

  it("never shows a draft pack (the test pack)", () => {
    const keys = packsFor("en").map((p) => p.key);
    expect(keys).not.toContain("echo-toolkit");
    expect(keys.length).toBe(data.packs.length);
  });
});
