/**
 * @file gallery-clips.ts
 * @description The videos of "Prompt → image → video": each clip is a run of the video Studio of orazaka-media on
 * dev.orazaka.com (`orazaka video … --model wan2-2-t2v-a14b`), made by Wan 2.2 A14B on DigitalOcean's serverless
 * inference and routed by Orazaka — the run id, the seed, the size, the frame rate, the duration, the time and the cost
 * are what the run recorded. The prompt is exactly what reached the model. Files: products/orazaka/gallery-video/ on the
 * CDN (core/media), `<id>.mp4`, `<id>.webm`, `<id>-poster.webp`. Words: `t.gallery`.
 */
import { mediaUrl } from "@/core/media/cdn";
import { GALLERY, type GalleryItem, type ReproducePart } from "@/features/landing/utils/gallery";

export interface GalleryClip {
  /** The file stem on the CDN, and the key of its caption in `t.gallery.clips`. */
  id: string;
  /** The gallery image this clip continues (same scene), when there is one. */
  imageId?: string;
  prompt: string;
  seed: string;
  aspect: "16:9" | "9:16";
  width: number;
  height: number;
  fps: number;
  /** The length of the clip, in seconds. */
  duration: number;
  /** What the run took, in seconds, from the command to the file. */
  seconds: number;
  /** What the provider charges for the clip, in US dollars. */
  costUsd: number;
  /** The Orazaka run (Studio run) that made it. */
  runId: string;
}

export const CLIP_MODEL = {
  /** The CLI's key (`orazaka video --model`). */
  key: "wan2-2-t2v-a14b",
  name: "Wan 2.2 A14B",
  licence: "Apache-2.0",
  provider: "DigitalOcean serverless inference",
} as const;

export const CLIPS: readonly GalleryClip[] = [
  {
    id: "tea-pour",
    imageId: "tea-pour",
    prompt:
      "Extreme close-up, slow motion: a stream of amber mint tea pours from a silver teapot held high into a small engraved glass, steam curling through a shaft of golden-hour light inside a Berber tent, dust motes floating, shallow depth of field, anamorphic lens flare, 35mm film grain, cinematic color grade.",
    seed: "20261011",
    aspect: "16:9",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 134,
    costUsd: 0.60,
    runId: "25948442-7c68-4e66-94d6-39cd8b96438d",
  },
  {
    id: "assistant",
    prompt:
      "A genius engineer's workshop at night, a floating holographic interface of orange light blooms in mid-air and organises blueprints of a machine, sparks from a welding arm in the background, reflections on brushed metal, volumetric haze, cinematic sci-fi, no person's face. No text, no lettering, no logos.",
    seed: "20261011",
    aspect: "16:9",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 130,
    costUsd: 0.60,
    runId: "53ca1083-cdc5-47d3-a923-5092016db13b",
  },
];

export const clipFiles = (clip: GalleryClip) => ({
  mp4: mediaUrl(`products/orazaka/gallery-video/${clip.id}.mp4`),
  webm: mediaUrl(`products/orazaka/gallery-video/${clip.id}.webm`),
  poster: mediaUrl(`products/orazaka/gallery-video/${clip.id}-poster.webp`),
});

/** One slide of "Prompt → image → video": a clip, with the image it continues when it has one. */
export interface FeaturedItem {
  id: string;
  clip: GalleryClip;
  image?: GalleryItem;
}

/** The items of the home page's section, in the order the clips are listed. */
export const FEATURED: readonly FeaturedItem[] = CLIPS.map((clip) => ({
  id: clip.id,
  clip,
  image: clip.imageId ? GALLERY.find((item) => item.id === clip.imageId) : undefined,
}));

/** The clip that continues an image, if any. */
export const clipOf = (imageId: string): GalleryClip | undefined => CLIPS.find((clip) => clip.imageId === imageId);

/** The command that makes the clip again: same prompt, model, frame, duration and seed, through the CLI. */
export function clipReproduceParts(clip: GalleryClip): ReproducePart[] {
  const quoted = `"${clip.prompt.replace(/(["\\$`])/g, "\\$1")}"`;
  return [
    {
      language: "bash",
      file: "Terminal",
      code: `orazaka video ${quoted} \\\n  --model ${CLIP_MODEL.key} --aspect ${clip.aspect} --seed ${clip.seed} --duration ${Math.round(clip.duration)}`,
    },
  ];
}
