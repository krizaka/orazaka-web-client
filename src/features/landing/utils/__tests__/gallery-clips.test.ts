import { translations } from "@/core/context/translations";
import { hasMedia } from "@/core/media/cdn";
import { GALLERY } from "@/features/landing/utils/gallery";
import { CLIPS, CLIP_MODEL, FEATURED, clipFiles, clipOf, clipReproduceParts } from "@/features/landing/utils/gallery-clips";

describe("the videos of Prompt → image → video", () => {
  it("records, for every clip, what its Orazaka run recorded", () => {
    expect(CLIPS.length).toBeGreaterThanOrEqual(2);
    for (const clip of CLIPS) {
      expect(clip.runId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(clip.seed).toMatch(/^\d+$/);
      expect(clip.prompt.length).toBeGreaterThan(80);
      expect(clip.width * clip.height).toBeGreaterThan(0);
      // The provider's measured shape: 832x480, 16:9, 16 fps, 81 frames.
      expect([clip.width, clip.height, clip.aspect, clip.fps]).toEqual([832, 480, "16:9", 16]);
      expect(clip.duration).toBeCloseTo(5.06, 1);
      expect(clip.seconds).toBeGreaterThan(0);
      expect(clip.costUsd).toBe(0.6);
      if (clip.imageId) expect(GALLERY.some((item) => item.id === clip.imageId)).toBe(true);
    }
    expect(new Set(CLIPS.map((c) => c.id)).size).toBe(CLIPS.length);
    expect(CLIP_MODEL.key).toBe("wan2-2-t2v-a14b");
    expect(FEATURED.map((item) => item.clip.id)).toEqual(CLIPS.map((c) => c.id));
  });

  it("knows every file of every clip on the CDN, with a content hash", () => {
    for (const clip of CLIPS) {
      for (const ext of ["mp4", "webm"]) expect(hasMedia(`products/orazaka/gallery-video/${clip.id}.${ext}`)).toBe(true);
      expect(hasMedia(`products/orazaka/gallery-video/${clip.id}-poster.webp`)).toBe(true);
      const files = clipFiles(clip);
      expect(files.mp4).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/gallery-video\/[a-z-]+\.[0-9a-f]{10}\.mp4$/);
      expect(files.poster).toMatch(/-poster\.[0-9a-f]{10}\.webp$/);
    }
  });

  it("has a caption in English and French for every clip", () => {
    for (const locale of ["en", "fr"] as const) for (const clip of CLIPS) expect(translations[locale].gallery.clips[clip.id]?.trim()).toBeTruthy();
    expect(translations.fr.gallery.clips["tea-pour"]).not.toBe(translations.en.gallery.clips["tea-pour"]);
  });

  it("links a clip to the image it continues", () => {
    expect(clipOf("tea-pour")?.id).toBe("tea-pour");
    expect(clipOf("mtl-ruelle")).toBeUndefined();
  });

  it("reproduces a clip with the real orazaka-cli syntax: same prompt, model, frame, seed and length", () => {
    const clip = CLIPS[0];
    const [part] = clipReproduceParts(clip);
    expect(part.language).toBe("bash");
    expect(part.code).toContain("orazaka video \"");
    expect(part.code).toContain("--model wan2-2-t2v-a14b --aspect 16:9 --seed 20261011 --duration 5");
    // The prompt reaches the shell as one word: its quotes, backslashes, dollars and backticks are escaped.
    expect(clipReproduceParts({ ...clip, prompt: 'a "b" $c `d` \\e' })[0].code).toContain('"a \\"b\\" \\$c \\`d\\` \\\\e"');
  });

  it("names no copyrighted character, brand or logo in a prompt", () => {
    for (const clip of CLIPS) expect(clip.prompt).not.toMatch(/iron man|marvel|snk|king of fighters|jarvis/i);
  });
});
