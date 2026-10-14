import { translations } from "@/core/context/translations";
import { hasMedia } from "@/core/media/cdn";
import { GALLERY, GALLERY_MODEL, STYLES, gallerySrc, reproduceCommand, subjectOf } from "@/features/landing/utils/gallery";

describe("the Made here gallery data", () => {
  it("records for every image its prompt, seed, model, size, time and Studio", () => {
    expect(GALLERY.length).toBe(17);
    for (const item of GALLERY) {
      expect(item.prompt.length).toBeGreaterThan(80);
      expect(item.seed).toMatch(/^\d+$/);
      expect(item.studio).toMatch(/^art-/);
      expect(item.seconds).toBeGreaterThan(0);
      expect(item.width * item.height).toBeGreaterThan(0);
      expect(STYLES).toContain(item.style);
    }
    expect(GALLERY_MODEL.name).toBe("FLUX.2 [klein] 4B");
    expect(new Set(GALLERY.map((i) => i.id)).size).toBe(GALLERY.length);
  });

  it("knows every image on the CDN, with a content hash", () => {
    for (const item of GALLERY) {
      expect(hasMedia(`products/orazaka/gallery/${item.id}.webp`)).toBe(true);
      expect(gallerySrc(item.id)).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery\/[a-z-]+\.[0-9a-f]{10}\.webp$/);
    }
    expect(() => gallerySrc("nope")).toThrow();
  });

  it("has an alt text, a style name and every label in English and French", () => {
    for (const locale of ["en", "fr"] as const) {
      const g = translations[locale].gallery;
      for (const item of GALLERY) expect(g.items[item.id]?.trim()).toBeTruthy();
      for (const s of STYLES) expect(g.styles[s].trim()).not.toBe("");
      for (const v of Object.values(g).filter((x): x is string => typeof x === "string")) expect(v.trim()).not.toBe("");
    }
    expect(translations.fr.gallery.items["tea-pour"]).not.toBe(translations.en.gallery.items["tea-pour"]);
  });

  it("splits the prompt into the subject Eric typed and the Studio's direction", () => {
    for (const item of GALLERY) {
      const subject = subjectOf(item);
      expect(subject.length).toBeGreaterThan(20);
      expect(item.prompt.startsWith(`${subject}. `)).toBe(true);
    }
  });

  it("reproduces an image with the real orazaka-cli syntax: same model, Studio, subject, size and seed", () => {
    const item = GALLERY.find((i) => i.id === "tea-pour")!;
    const cmd = reproduceCommand(item);
    expect(cmd).toContain("orazaka models image use flux-2-klein-4b");
    expect(cmd).toContain("orazaka studio run --studio art-golden-hour --inputs-file inputs.json");
    expect(cmd).toContain("--inputs size=1024x1280,seed=20261011");
    expect(cmd).toContain(JSON.stringify(subjectOf(item)));
  });
});
