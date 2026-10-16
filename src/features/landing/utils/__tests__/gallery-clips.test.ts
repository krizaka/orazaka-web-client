import { translations } from "@/core/context/translations";
import { hasMedia, mediaPaths } from "@/core/media/cdn";
import { GALLERY } from "@/features/landing/utils/gallery";
import { CLIPS, CLIP_MODEL, FEATURED, clipFiles, clipModel, clipOf, clipReproduceParts } from "@/features/landing/utils/gallery-clips";

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
      if (clip.fromImage) {
        // Image to video on a GPU droplet: Wan 2.2 TI2V 5B at a size it was trained at (or the next one down on 20 GB), 24 fps, 5 s; the cost is GPU time.
        expect(clip.model).toBe("wan2.2-ti2v-5b");
        expect([[1280, 704], [960, 544], [832, 480]]).toContainEqual([clip.width, clip.height]);
        expect(clip.fps).toBe(24);
        // 5 s (121 frames), or 10 s as two linked runs cross-faded over 4 frames (238 frames).
        expect(clip.linkedRunId ? clip.duration : 5.04).toBe(clip.linkedRunId ? 9.92 : clip.duration);
        if (!clip.linkedRunId) expect(clip.duration).toBe(5.04);
        else expect(clip.linkedRunId).toMatch(/^[0-9a-f]{8}-/);
        expect(clip.gpu).toMatch(/RTX 4000 Ada|H100/);
        expect(clip.gpuRateUsdPerHour).toBeGreaterThan(0);
        expect(clip.imageId).toBeTruthy();
        expect(clip.seconds).toBeGreaterThan(0);
        // cost = wall seconds x the hourly rate (the data says how it was computed)
        expect(clip.costUsd).toBeCloseTo(((clip.seconds ?? 0) / 3600) * (clip.gpuRateUsdPerHour ?? 0), 1);
      } else {
        if (clip.model === "wan2.2-t2v-a14b") {
          // The 720p A14B on our own 80 GB GPU: 1280x720, 16 fps, 81 frames, cost = GPU time.
          expect([clip.width, clip.height, clip.fps]).toEqual([1280, 720, 16]);
          expect(clip.gpuRateUsdPerHour).toBeGreaterThan(0);
          expect(clip.costUsd).toBeCloseTo(((clip.seconds ?? 0) / 3600) * (clip.gpuRateUsdPerHour ?? 0), 1);
        } else {
          // The provider's measured shape: 832x480, 16:9, 16 fps, 81 frames.
          expect([clip.width, clip.height, clip.fps]).toEqual([832, 480, 16]);
          expect(clip.duration).toBeCloseTo(5.06, 1);
          expect(clip.costUsd).toBe(0.6);
        }
      }
      if (clip.seconds !== undefined) expect(clip.seconds).toBeGreaterThan(0);
      if (clip.imageId) expect(GALLERY.some((item) => item.id === clip.imageId)).toBe(true);
    }
    expect(new Set(CLIPS.map((c) => c.id)).size).toBe(CLIPS.length);
    expect(CLIP_MODEL.key).toBe("wan2-2-t2v-a14b");
    expect(clipModel({ model: "wan2.2-ti2v-5b" }).name).toBe("Wan 2.2 TI2V 5B");
    expect(clipModel({}).name).toBe("Wan 2.2 A14B");
  });

  it("does not show a time that includes a worker restart", () => {
    for (const id of ["maroc", "grenoble", "arcade"]) expect(CLIPS.find((clip) => clip.id === id)?.seconds).toBeUndefined();
  });

  it("features the clips made from a photo first (each with the image it starts from), then the Old Port, the assistant and the best of the rest", () => {
    const ids = FEATURED.map((item) => item.clip.id);
    const fromImage = FEATURED.filter((item) => item.clip.fromImage);
    expect(fromImage.length).toBeGreaterThanOrEqual(1);
    expect(ids.slice(0, fromImage.length)).toEqual(fromImage.map((item) => item.clip.id)); // the whole path comes first
    for (const item of fromImage) expect(item.image?.id).toBe(item.clip.imageId);
    // then the 720p heroes (text to video on our GPU), tea-pour (text to video, serverless), the assistant and the best of the rest
    const heroes = FEATURED.filter((item) => item.clip.model === "wan2.2-t2v-a14b").map((item) => item.clip.id);
    expect(heroes).toContain("old-port");
    expect(ids.filter((id) => !fromImage.some((i) => i.clip.id === id) && !heroes.includes(id))).toEqual(["tea-pour", "assistant", "montreal", "grenoble", "yasakia-montreal-dawn"]);
    expect(FEATURED.find((item) => item.clip.id === "tea-pour")?.image?.id).toBe("tea-pour");
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
    // tea-pour has two clips: the text-to-video one and the image-to-video one; the one made FROM the image is the one it continues.
    expect(clipOf("tea-pour")?.fromImage).toBe(true);
    expect(clipOf("mtl-ruelle")).toBeUndefined();
  });

  it("reproduces a clip with the real orazaka-cli syntax: same prompt, model, frame, seed and length", () => {
    const clip = CLIPS.find((c) => c.id === "tea-pour") ?? CLIPS[0];
    const [part] = clipReproduceParts(clip);
    expect(part.language).toBe("bash");
    expect(part.code).toContain("orazaka video \"");
    expect(part.code).toContain("--model wan2-2-t2v-a14b --aspect 16:9 --seed 20261011 --duration 5");
    // The prompt reaches the shell as one word: its quotes, backslashes, dollars and backticks are escaped.
    expect(clipReproduceParts({ ...clip, prompt: 'a "b" $c `d` \\e' })[0].code).toContain('"a \\"b\\" \\$c \\`d\\` \\\\e"');
  });

  it("reproduces an image-to-video clip with the Studio's own inputs (the CLI has no --image yet): its photo is an upload, never a path", () => {
    const clip = CLIPS.find((c) => c.fromImage);
    expect(clip).toBeDefined();
    const [part] = clipReproduceParts(clip as NonNullable<typeof clip>);
    expect(part.language).toBe("json");
    const inputs = JSON.parse(part.code);
    expect(inputs).toMatchObject({ model: "wan2.2-ti2v-5b", aspect: "16:9", seed: (clip as NonNullable<typeof clip>).seed, durationSeconds: 5 });
    expect(inputs.image).toMatch(/^<.*upload.*>$/);
  });

  it("names no copyrighted character, brand or logo in a prompt", () => {
    for (const clip of CLIPS) expect(clip.prompt).not.toMatch(/iron man|marvel|snk|king of fighters|jarvis/i);
  });
});
