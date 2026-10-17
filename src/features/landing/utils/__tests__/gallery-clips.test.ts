import { translations } from "@/core/context/translations";
import { hasMedia, mediaPaths } from "@/core/media/cdn";
import { GALLERY } from "@/features/landing/utils/gallery";
import { CLIPS, CLIP_MODEL, FEATURED, IMAGE_MODEL, clipFiles, clipOf, clipReproduceParts, imageReproduceParts, imageUrl } from "@/features/landing/utils/gallery-clips";

describe("the videos of Made here", () => {
  it("lists every clip the media manifest publishes — no hand list — each with the record of its run", () => {
    const published = mediaPaths("products/").filter((path) => /^products\/[a-z]+\/(gallery-video|video)\/[a-z0-9-]+\.mp4$/.test(path));
    expect(published.length).toBeGreaterThanOrEqual(10);
    expect(CLIPS.map((clip) => `${clip.stem}.mp4`).sort()).toEqual(published);
    for (const clip of CLIPS) {
      expect(clip.runId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(clip.seed).toMatch(/^\d+$/);
      expect(clip.prompt.length).toBeGreaterThan(80);
      expect(clip.aspect).toBe("16:9");
      if (clip.via) {
        // Made on our own H100 (LTX-Video 0.9.8 at 24 fps, or Wan 2.2 A14B at 16 fps), upscaled to 1080p by SeedVR2 in the same run; priced by the GPU's hour.
        const portrait = clip.height > clip.width;
        expect([clip.width, clip.height]).toEqual(portrait ? [1080, 1920] : [1920, 1080]);
        expect(clip.fps).toBe(clip.via.key.startsWith("ltx") ? 24 : 16);
        expect(clip.duration).toBeGreaterThan(4.9);
        expect(clip.duration).toBeLessThan(5.1);
        expect(clip.costUsd).toBeGreaterThan(0.05);
        expect(clip.costUsd).toBeLessThan(2);
        expect(clip.upscale).toMatchObject({ model: "SeedVR2 3B", licence: "Apache-2.0", to: portrait ? "1080×1920" : "1920×1080" });
        expect(clip.imageKept).toBeGreaterThan(0.95); // the still was made at the video's own aspect: almost all of it stays in the frame
      } else {
        // The provider's measured shape: 832x480, 16 fps, 81 frames, $0.60 a clip.
        expect([clip.width, clip.height, clip.fps]).toEqual([832, 480, 16]);
        expect(clip.duration).toBeCloseTo(5.06, 1);
        expect(clip.costUsd).toBe(0.6);
      }
      if (clip.seconds !== undefined) expect(clip.seconds).toBeGreaterThan(0);
      if (clip.imageId) expect(GALLERY.some((item) => item.id === clip.imageId)).toBe(true);
    }
    expect(new Set(CLIPS.map((c) => c.id)).size).toBe(CLIPS.length);
    expect(CLIP_MODEL.key).toBe("wan2-2-t2v-a14b");
  });

  it("does not show a time that includes a worker restart", () => {
    for (const id of ["maroc", "arcade"]) expect(CLIPS.find((clip) => clip.id === id)?.seconds).toBeUndefined();
  });

  it("features five on the home page, the strongest first, each made from its own image: prompt → image → video", () => {
    expect(FEATURED.map((item) => item.clip.id)).toEqual(["old-port", "snow-walk", "chefchaouen", "grenoble", "montreal-snow"]);
    for (const item of FEATURED) {
      const image = item.image;
      expect(image).toBeDefined();
      // Two real runs in a row, each with its own record.
      expect(image!.runId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(image!.runId).not.toBe(item.clip.runId);
      expect(image!.seed).toMatch(/^\d+$/);
      expect(image!.prompt.length).toBeGreaterThan(80);
      expect(image!.costUsd).toBeLessThan(0.01); // seconds of an H100 by the hour
      expect(["ltx-video-0.9.8-13b-distilled", "wan2.2-i2v-a14b-hq"]).toContain(item.clip.via?.key);
      expect(item.clip.imageKept).toBeGreaterThan(0.95);
      expect(imageUrl(image!)).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/orazaka\/showcase\/[a-z0-9-]+\.[0-9a-f]{10}\.webp$/);
    }
    expect(new Set(FEATURED.map((item) => item.image!.id)).size).toBe(FEATURED.length);
  });

  it("describes every featured still in English and French", () => {
    for (const locale of ["en", "fr"] as const) for (const item of FEATURED) expect(translations[locale].gallery.stills[item.image!.id]?.trim()).toBeTruthy();
    expect(translations.fr.gallery.stills.grenoble).not.toBe(translations.en.gallery.stills.grenoble);
  });

  it("knows every file of every clip on the CDN, with a content hash", () => {
    for (const clip of CLIPS) {
      for (const ext of ["mp4", "webm"]) expect(hasMedia(`${clip.stem}.${ext}`)).toBe(true);
      expect(hasMedia(`${clip.stem}-poster.webp`)).toBe(true);
      const files = clipFiles(clip);
      expect(files.mp4).toMatch(/^https:\/\/krizaka-assets\.b-cdn\.net\/site\/products\/[a-z]+\/(gallery-video|video)\/[a-z0-9-]+\.[0-9a-f]{10}\.mp4$/);
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
    const clip = CLIPS.find((c) => !c.image)!; // a text-to-video clip: the CLI command
    const [part] = clipReproduceParts(clip);
    expect(part.language).toBe("bash");
    expect(part.code).toContain("orazaka video \"");
    expect(part.code).toContain("--model wan2-2-t2v-a14b --aspect 16:9 --seed 20261011 --duration 5");
    // The prompt reaches the shell as one word: its quotes, backslashes, dollars and backticks are escaped.
    expect(clipReproduceParts({ ...clip, prompt: 'a "b" $c `d` \\e' })[0].code).toContain('"a \\"b\\" \\$c \\`d\\` \\\\e"');
  });

  it("reproduces an image-to-video clip and its still through the Studios, not the text-only CLI shortcut", () => {
    const item = FEATURED[0];
    const [inputs, run] = clipReproduceParts(item.clip);
    expect(JSON.parse(inputs.code)).toMatchObject({ prompt: item.clip.prompt, seed: item.clip.seed, model: item.clip.via!.key, aspect: item.clip.aspect, upscale: "1080p" });
    expect(run.code).toBe("orazaka studio run --studio video-generation --inputs-file inputs.json");
    const [still, stillRun] = imageReproduceParts(item.image!);
    expect(JSON.parse(still.code)).toEqual({ prompt: item.image!.prompt, size: `${item.image!.width}x${item.image!.height}`, model: IMAGE_MODEL.key });
    expect(stillRun.code).toContain("--studio image-generation");
  });

  it("names no copyrighted character, brand or logo in a prompt", () => {
    for (const clip of CLIPS) expect(clip.prompt).not.toMatch(/iron man|marvel|snk|king of fighters|jarvis/i);
  });
});
