import { translations } from "@/core/context/translations";
import { STEPS, clipUrls } from "@/features/landing/utils/mobile";

const CDN = /^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/mobile\/[a-z0-9-]+\.[0-9a-f]{10}\.(webm|mp4|webp)$/;

describe("the mobile journey", () => {
  it("is a few clear steps, in the order a person lives them", () => {
    expect(STEPS).toEqual(["sign-in", "studio-run", "ask", "jobs"]);
  });

  it("points every step at the CDN under products/orazaka/mobile, with a content hash, in both encodings and a poster", () => {
    for (const id of STEPS) {
      const u = clipUrls(id);
      expect([u.webm, u.mp4, u.poster].every((x) => CDN.test(x))).toBe(true);
    }
  });

  it("has a goal, a purpose, an alt and three things to notice for every step, in English and French", () => {
    for (const locale of ["en", "fr"] as const) {
      const m = translations[locale].mobile;
      expect(Object.keys(m.steps).sort()).toEqual([...STEPS].sort());
      for (const id of STEPS) {
        const s = m.steps[id];
        for (const text of [s.goal, s.short, s.purpose, s.alt]) expect(text.trim()).not.toBe("");
        expect(s.notice).toHaveLength(3);
        s.notice.forEach((n) => expect(n.trim()).not.toBe(""));
      }
    }
    for (const id of STEPS) {
      expect(translations.fr.mobile.steps[id].goal).not.toBe(translations.en.mobile.steps[id].goal);
      expect(translations.fr.mobile.steps[id].purpose).not.toBe(translations.en.mobile.steps[id].purpose);
    }
  });
});
