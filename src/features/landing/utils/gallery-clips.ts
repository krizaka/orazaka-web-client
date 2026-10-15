/**
 * @file gallery-clips.ts
 * @description The videos of "Made here": every clip is a run of the video Studio of orazaka-media on dev.orazaka.com
 * (`orazaka video … --model wan2-2-t2v-a14b`), made by Wan 2.2 A14B on DigitalOcean's serverless inference and routed by
 * Orazaka. The LIST of clips is the media manifest (`media.generated.json`: every `products/<product>/{gallery-video,video}/<clip>.mp4`
 * with its webm and poster) — nothing here lists a file; `RECORDS` holds what each run recorded (prompt, seed, run id, size, time,
 * price), keyed by the file. A published clip without its record, or a record without its files, fails the build.
 * Words: `t.gallery`.
 */
import { hasMedia, mediaPaths, mediaUrl } from "@/core/media/cdn";
import { GALLERY, type GalleryItem, type ReproducePart } from "@/features/landing/utils/gallery";

/** What a run recorded about a clip. */
export interface ClipRecord {
  /** The key of its caption in `t.gallery.clips` (the file stem, prefixed by the product when it is not Orazaka's). */
  id: string;
  /** The gallery image this clip continues (same scene), when there is one. */
  imageId?: string;
  /** Shown first, on the home page. */
  featured?: true;
  /** Exactly what reached the model. */
  prompt: string;
  seed: string;
  width: number;
  height: number;
  fps: number;
  /** The length of the clip, in seconds. */
  duration: number;
  /** What the run took, from the command to the file; absent when the run was interrupted (a worker restart) and the figure would mislead. */
  seconds?: number;
  /** What the provider charges for the clip, in US dollars. */
  costUsd: number;
  /** The Orazaka run (Studio run) that made it. */
  runId: string;
}

/** A published clip: its record and where its files are. */
export interface GalleryClip extends ClipRecord {
  /** The folder it is published under: `products/<product>/<dir>/`. */
  product: string;
  dir: "gallery-video" | "video";
  /** Always 16:9: the only shape the provider answers. */
  aspect: "16:9";
  /** The media path without extension: `products/orazaka/gallery-video/tea-pour`. */
  stem: string;
}

export const CLIP_MODEL = {
  /** The CLI's key (`orazaka video --model`). */
  key: "wan2-2-t2v-a14b",
  name: "Wan 2.2 A14B",
  licence: "Apache-2.0",
  provider: "DigitalOcean serverless inference",
} as const;

/** What each run recorded, by the media path of its file (no extension). */
const RECORDS: Record<string, ClipRecord> = {

  "products/orazaka/gallery-video/tea-pour": {
    id: "tea-pour",
    imageId: "tea-pour",
    featured: true,
    prompt: "Extreme close-up, slow motion: a stream of amber mint tea pours from a silver teapot held high into a small engraved glass, steam curling through a shaft of golden-hour light inside a Berber tent, dust motes floating, shallow depth of field, anamorphic lens flare, 35mm film grain, cinematic color grade.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 134,
    costUsd: 0.60,
    runId: "25948442-7c68-4e66-94d6-39cd8b96438d",
  },
  "products/orazaka/video/old-port": {
    featured: true,
    id: "old-port",
    prompt: "Smooth cinematic drone glide forward over the Old Port of Montréal at blue hour, the cobblestone quay and the Clock Tower lit in warm lights against a deep blue sky, the St. Lawrence river reflecting the city, a few people strolling, soft haze, single continuous shot, no cuts. No text, no lettering, no logos.",
    seed: "20261015",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 135,
    costUsd: 0.60,
    runId: "bd30798f-12fb-4d5b-95ed-cfe0414f37ee",
  },  "products/orazaka/gallery-video/assistant": {
    id: "assistant",
    featured: true,
    prompt: "A genius engineer's workshop at night, a floating holographic interface of orange light blooms in mid-air and organises blueprints of a machine, sparks from a welding arm in the background, reflections on brushed metal, volumetric haze, cinematic sci-fi, no person's face. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 130,
    costUsd: 0.60,
    runId: "53ca1083-cdc5-47d3-a923-5092016db13b",
  },
  "products/orazaka/video/montreal": {
    featured: true,
    id: "montreal",
    prompt: "Winter night in Montréal, slow tracking shot along a snowy street of the Plateau with outside spiral staircases, warm windows glowing, snowflakes in streetlight, steam from a vent, cinematic 35mm, shallow depth of field. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 132,
    costUsd: 0.60,
    runId: "0515ce61-0e91-4fe9-a0bf-2ca2838f74e3",
  },
  "products/orazaka/video/maroc": {
    id: "maroc",
    prompt: "Golden hour drone glide over the blue alleys of Chefchaouen into the Rif mountains, then a slow push into a riad courtyard with a zellige fountain, orange trees, light shafts, cinematic. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    costUsd: 0.60,
    runId: "bfaae551-3c58-4d18-b93b-f16911acf4e5",
  },
  "products/orazaka/video/grenoble": {
    featured: true,
    id: "grenoble",
    prompt: "Dawn over Grenoble, the spherical cable-car cabins of the Bastille gliding up above the city, snow-capped Alps glowing pink behind, mist in the valley, aerial cinematic. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    costUsd: 0.60,
    runId: "1842dbfa-587f-4846-adb0-0cac8866a507",
  },
  "products/orazaka/video/arcade": {
    id: "arcade",
    prompt: "1990s arcade at night, rows of glowing cabinets, a two-player fighting-game duel reflected in a player's hands on the joystick and buttons (no screen detail, no characters), neon magenta and cyan, smoke, CRT glow, slow dolly, cinematic. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    costUsd: 0.60,
    runId: "0494384e-c8d0-473a-9a9e-b91f5f1b1946",
  },
  "products/yasakia/video/montreal-dawn": {
    featured: true,
    id: "yasakia-montreal-dawn",
    prompt: "Aerial drone shot at dawn gliding over Old Montréal rooftops toward the St. Lawrence river, low fog, emerald and turquoise reflections on the water, first light hitting the domes, slow and smooth, epic, cinematic color grade. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 131,
    costUsd: 0.60,
    runId: "733c6e0b-51e8-446e-9fe1-7309f5711f84",
  },
  "products/yororis/video/microphone": {
    id: "yororis-microphone",
    prompt: "Close-up of a vintage ribbon microphone in a quiet sand-coloured room, sage-green curtains moving gently in a breeze, sunlight particles drifting, a faint sound-wave ripple across a glass of water beside it, serene, cinematic, shallow depth of field. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 131,
    costUsd: 0.60,
    runId: "ebb70c88-cd2c-4ffe-81ae-362b45ff8096",
  },
  "products/orochia/video/studio-night": {
    id: "orochia-studio-night",
    prompt: "A creator's studio at night seen from behind a cinema camera on a slider, violet and magenta neon practicals, haze, ring light bokeh, the camera glides slowly sideways revealing a softly lit set, cinematic, music-video aesthetic, 35mm. No text, no lettering, no logos.",
    seed: "20261011",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 129,
    costUsd: 0.60,
    runId: "ad50109a-44c0-40f8-80fa-e44e65775492",
  },
  "products/yomizaka/video/contracts": {
    id: "yomizaka-contracts",
    prompt: "Macro shot, a stack of paper contracts on a walnut desk at blue hour, a thin line of warm light sweeps slowly across the pages, highlighting passages, fountain pen and a cup of coffee steaming, soft window light, Montréal snowfall outside, shallow depth of field, cinematic, calm. No text, no lettering, no logos.",
    seed: "20261012",
    width: 832,
    height: 480,
    fps: 16,
    duration: 5.06,
    seconds: 131,
    costUsd: 0.60,
    runId: "57ccad61-e1dd-4ff2-aeab-2c9645908a70",
  },
};

const CLIP_FILE = /^products\/([a-z]+)\/(gallery-video|video)\/([a-z0-9-]+)\.mp4$/;

/** The published clips, from the manifest: featured ones first (the order of `RECORDS`), then the rest in path order. */
function discover(): GalleryClip[] {
  const order = Object.keys(RECORDS);
  const found = mediaPaths("products/")
    .map((path) => CLIP_FILE.exec(path))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => {
      const stem = match[0].slice(0, -".mp4".length);
      const record = RECORDS[stem];
      if (!record) throw new Error(`${match[0]} is published but no run recorded it (gallery-clips RECORDS)`);
      for (const extra of [`${stem}.webm`, `${stem}-poster.webp`]) if (!hasMedia(extra)) throw new Error(`${extra} is missing beside ${match[0]}`);
      return { ...record, product: match[1], dir: match[2] as GalleryClip["dir"], aspect: "16:9" as const, stem };
    });
  for (const stem of order) if (!found.some((clip) => clip.stem === stem)) throw new Error(`${stem} has a record but is not published`);
  return found.sort((a, b) => order.indexOf(a.stem) - order.indexOf(b.stem));
}

export const CLIPS: readonly GalleryClip[] = discover();

/** One slide of "Prompt → image → video": a clip, with the image it continues when it has one. */
export interface FeaturedItem {
  id: string;
  clip: GalleryClip;
  image?: GalleryItem;
}

/** The items of the home page's section: the featured clips. */
export const FEATURED: readonly FeaturedItem[] = CLIPS.filter((clip) => clip.featured).map((clip) => ({
  id: clip.id,
  clip,
  image: clip.imageId ? GALLERY.find((item) => item.id === clip.imageId) : undefined,
}));

export const clipFiles = (clip: GalleryClip) => ({
  mp4: mediaUrl(`${clip.stem}.mp4`),
  webm: mediaUrl(`${clip.stem}.webm`),
  poster: mediaUrl(`${clip.stem}-poster.webp`),
});

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
