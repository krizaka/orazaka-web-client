import { translations } from "@/core/context/translations";
import { CLIPS, SHOTS, clipUrls, shotUrl } from "@/features/mobile/mobile";

const CDN = /^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/mobile\/[a-z0-9-]+\.[0-9a-f]{10}\.(webm|mp4|webp)$/;

describe("the mobile recordings", () => {
  it("point at the CDN under products/orazaka/mobile, with a content hash, in both encodings and a poster", () => {
    expect(CLIPS.length).toBeGreaterThanOrEqual(4);
    for (const id of CLIPS) {
      const u = clipUrls(id);
      expect([u.webm, u.mp4, u.poster].every((x) => CDN.test(x))).toBe(true);
    }
  });

  it("know every screenshot, iOS and Android", () => {
    expect(SHOTS.some((s) => s.platform === "ios")).toBe(true);
    expect(SHOTS.some((s) => s.platform === "android")).toBe(true);
    for (const s of SHOTS) expect(shotUrl(s.id)).toMatch(CDN);
  });

  it("refuses a file the manifest does not know", () => {
    expect(() => shotUrl("nope")).toThrow();
  });

  it("have words in English and French for every clip and screenshot", () => {
    for (const locale of ["en", "fr"] as const) {
      const m = translations[locale].mobile;
      for (const id of CLIPS) {
        expect(m.clips[id].label.trim()).not.toBe("");
        expect(m.clips[id].caption.trim()).not.toBe("");
      }
      for (const s of SHOTS) expect(m.shots[s.id].trim()).not.toBe("");
    }
    expect(translations.fr.mobile.clips["sign-in"].caption).not.toBe(translations.en.mobile.clips["sign-in"].caption);
  });
});
