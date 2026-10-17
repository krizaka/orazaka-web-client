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
import { type ReproducePart } from "@/features/landing/utils/gallery";

/** The still a clip was made FROM (image-to-video): its own Studio run, so its own record. */
export interface ImageRecord {
  /** The key of its description in `t.gallery.stills`. */
  id: string;
  /** The media path of the published file: `products/orazaka/showcase/<id>.webp`. */
  src: string;
  /** Exactly what reached the model. */
  prompt: string;
  /** The seed the run reported (some providers ignore the one asked for). */
  seed: string;
  /** The size the provider answered; the video's frame is cut from it. */
  width: number;
  height: number;
  /** What the run took, by the platform's clock. */
  seconds: number;
  /** What the provider charges for the image, in US dollars. */
  costUsd: number;
  /** The Orazaka run (Studio run) that made it. */
  runId: string;
}

/** The model that made a clip, and where it ran. */
export interface ClipVia {
  /** The Studio's key (`model` input of `video-generation`). */
  key: string;
  name: string;
  licence: string;
  provider: string;
}

/** The optional super-resolution pass after a clip (Studio `upscale`): what upscaled it, from what to what, how long it takes. */
export interface ClipUpscale {
  model: string;
  licence: string;
  from: string;
  to: string;
  /** What the run reported for its upscale pass (`metrics.upscaleSeconds`): inside the clip's run, on the same GPU. */
  seconds: number;
  /** That time at the GPU's hourly rate, US dollars (already inside the run's GPU cost). */
  costUsd: number;
}

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
  /** Set when the clip was made on our own GPU rather than by the provider's serverless Wan (`CLIP_MODEL`): the model, its licence, where it ran; `costUsd` is then the GPU time of the run. */
  via?: ClipVia;
  /** The 1080p pass after the clip, when it has one: `width` x `height` are then the upscaled frame. */
  upscale?: ClipUpscale;
  /** The image the clip starts from, when it does: the clip is `prompt → image → video`. */
  image?: ImageRecord;
  /** The share of the starting image the frame kept (`metrics.imageKept`): near 1 when the still was made at the video's own aspect. */
  imageKept?: number;
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

/** The fast model of the bake-off: LTX-Video 0.9.8 13B distilled, about 15 s for a 5 s clip on an H100 (landscape, iteration). */
export const LTX: ClipVia = {
  key: "ltx-video-0.9.8-13b-distilled",
  name: "LTX-Video 0.9.8",
  licence: "LTX-Video Open Weights License 0.X",
  provider: "RunPod H100 80 GB",
};

/** The bake-off's winner for people and animals in 9:16: Wan 2.2 I2V A14B at its full 40 steps, about 18 minutes a clip. */
export const WAN_HQ: ClipVia = {
  key: "wan2.2-i2v-a14b-hq",
  name: "Wan 2.2 A14B (40 steps)",
  licence: "Apache-2.0",
  provider: "RunPod H100 80 GB",
};

/** SeedVR2 3B, the upscaler of the Studio's `upscale` step (Apache-2.0). */
export const SEEDVR2 = { model: "SeedVR2 3B", licence: "Apache-2.0" } as const;

/** The model of every still of the home page's strip: a run of the `image-generation` Studio, made at the video's own aspect. */
export const IMAGE_MODEL = {
  key: "flux-2-klein-4b",
  name: "FLUX.2 [klein] 4B",
  licence: "Apache-2.0",
  provider: "RunPod H100 80 GB",
} as const;

/** What each run recorded, by the media path of its file (no extension). */
const RECORDS: Record<string, ClipRecord> = {
  "products/orazaka/video/old-port": {
    id: "old-port",
    featured: true,
    prompt: "Slow lateral dolly along the quay: the amber lights of the Clock Tower and the lamps shimmer in long reflections on the glassy water, the moored ship's rigging sways very slightly, thin mist drifts across the river, distant silhouettes stroll along the quay, subtle parallax between the tower, the ship and the skyline. Steady cinematic camera, smooth natural motion.",
    seed: "20261301",
    width: 1920,
    height: 1080,
    fps: 24,
    duration: 5.04,
    seconds: 238,
    costUsd: 0.2638,
    runId: "e8bca125-ada6-4802-a4a9-f123bb6755d6",
    via: LTX,
    upscale: { ...SEEDVR2, from: "1216×704", to: "1920×1080", seconds: 137.1, costUsd: 0.152 },
    imageKept: 0.9754,
    image: {
      id: "old-port",
      src: "products/orazaka/showcase/old-port.webp",
      prompt: "Cinematic photograph, 35mm lens, blue hour: the Old Port of Montréal seen from the quay, the stone Clock Tower lit warm amber against a deep indigo sky, the St. Lawrence river glassy with long reflections of the city lights, a tall ship moored at the quay with softly lit rigging, a few distant people walking as silhouettes, thin mist on the water, cobalt shadows against warm amber lamps, filmic teal-orange grade, ultra-sharp detail, photographic realism. No text, no lettering, no logos, no readable signs.",
      seed: "4095650755",
      width: 1360,
      height: 768,
      seconds: 6,
      costUsd: 0.0067,
      runId: "a686199b-74a7-4248-b8c5-a90d6f7fe49c",
    },
  },
  "products/orazaka/video/snow-walk": {
    id: "snow-walk",
    featured: true,
    prompt: "The woman and the golden retriever keep walking forward along the snowy path with a natural gait, the dog's tail sways, her breath is visible in the cold air, mist drifts over the river. Slow gentle camera follow from behind, subtle parallax, steady cinematic shot, smooth natural motion.",
    seed: "20261305",
    width: 1080,
    height: 1920,
    fps: 16,
    duration: 5.06,
    seconds: 1352,
    costUsd: 1.4985,
    runId: "586bd6a3-78e3-40f2-a26c-e089eebcd0f9",
    via: WAN_HQ,
    upscale: { ...SEEDVR2, from: "720×1280", to: "1080×1920", seconds: 121.1, costUsd: 0.134 },
    imageKept: 0.9961,
    image: {
      id: "snow-walk",
      src: "products/orazaka/showcase/snow-walk.webp",
      prompt: "Cinematic photograph, 50mm lens, shallow depth of field: a young woman in a long camel wool coat and a red scarf walks a golden retriever on a lead along a snowy riverside path at dawn, seen from three quarters behind and the side, both walking forward in mid-stride, breath visible in the cold air, soft pink-gold sunrise light and low mist over the river, bare trees and a stone bridge in the distance, natural proportions and anatomy, five fingers on the visible hand, filmic colour grade, ultra-sharp detail, photographic realism. No text, no lettering, no logos.",
      seed: "33",
      width: 768,
      height: 1360,
      seconds: 7,
      costUsd: 0.0078,
      runId: "12cee392-9a0e-4a18-a496-44bf0d324c8a",
    },
  },
  "products/orazaka/video/chefchaouen": {
    id: "chefchaouen",
    featured: true,
    prompt: "Slow forward dolly with a gentle upward tilt along the blue steps: warm golden-hour light slides across the cobalt walls, leaves and flower petals in the pots sway in a light breeze, dust motes float in the sunbeams, the distant mountains glow through soft haze, subtle parallax. Steady cinematic camera, smooth natural motion.",
    seed: "20261302",
    width: 1920,
    height: 1080,
    fps: 24,
    duration: 5.04,
    seconds: 201,
    costUsd: 0.2228,
    runId: "fa484aa7-3c52-4468-acbd-c786746e2ebb",
    via: LTX,
    upscale: { ...SEEDVR2, from: "1216×704", to: "1920×1080", seconds: 126.1, costUsd: 0.14 },
    imageKept: 0.9754,
    image: {
      id: "chefchaouen",
      src: "products/orazaka/showcase/chefchaouen.webp",
      prompt: "Cinematic photograph, 28mm lens, golden hour: the blue-washed stepped alleys of Chefchaouen in Morocco seen from a low angle, deep cobalt walls glowing in warm low sun, terracotta pots overflowing with green plants and pink flowers on the steps, a white-and-blue archway in the background, long soft shadows, the Rif mountains hazy and warm behind the rooftops, warm highlights against cool blue shadows, tack-sharp, photographic realism. No text, no lettering, no logos.",
      seed: "4271044981",
      width: 1360,
      height: 768,
      seconds: 5,
      costUsd: 0.0055,
      runId: "ec7b08ac-c270-4099-84b0-5f4fbae93296",
    },
  },
  "products/orazaka/video/grenoble": {
    id: "grenoble",
    featured: true,
    prompt: "Slow dolly-in toward the cabin: the orange cable-car cabin sways gently on its cable, mist drifts slowly through the valley below, the city lights twinkle, subtle parallax between the pylon, the cabin and the mountains, the first sunrise light slides along the snowy ridges. Steady cinematic camera, smooth natural motion.",
    seed: "20261303",
    width: 1920,
    height: 1080,
    fps: 24,
    duration: 5.04,
    seconds: 195,
    costUsd: 0.2161,
    runId: "fc7ad9bf-0724-4129-94fb-239d062d57ec",
    via: LTX,
    upscale: { ...SEEDVR2, from: "1216×704", to: "1920×1080", seconds: 127.7, costUsd: 0.142 },
    imageKept: 0.9754,
    image: {
      id: "grenoble",
      src: "products/orazaka/showcase/grenoble.webp",
      prompt: "Cinematic aerial photograph at dawn over Grenoble: a bright orange spherical cable-car cabin hanging from a taut steel cable in the upper third of the frame, a pylon on the left, the city far below sinking in luminous low mist, a wall of snow-capped Alps catching the first pink-gold sunrise light on their ridges, soft volumetric haze in the valley, atmospheric perspective, teal shadows against warm orange highlights, 35mm anamorphic lens, filmic colour grade, ultra-sharp detail, photographic realism. No text, no lettering, no logos.",
      seed: "33",
      width: 1360,
      height: 768,
      seconds: 5,
      costUsd: 0.0055,
      runId: "c3efac13-6c5b-4743-af3b-e856204f3d96",
    },
  },
  "products/orazaka/video/montreal-snow": {
    id: "montreal-snow",
    featured: true,
    prompt: "Slow tracking shot forward past the snow-dusted spiral staircase: fat snowflakes drift down in layers through the warm lamp light, soft bokeh highlights, a thin plume of steam rises from a street vent, the lit window flickers gently. Consistent exposure and natural colours from the first frame to the last. Steady cinematic camera, smooth natural motion.",
    seed: "20261304",
    width: 1920,
    height: 1080,
    fps: 24,
    duration: 5.04,
    seconds: 208,
    costUsd: 0.2305,
    runId: "f72d2c40-0c45-4f4e-ba26-a93fdbca5ab4",
    via: LTX,
    upscale: { ...SEEDVR2, from: "1216×704", to: "1920×1080", seconds: 127, costUsd: 0.141 },
    imageKept: 0.9754,
    image: {
      id: "montreal-snow",
      src: "products/orazaka/showcase/montreal-snow.webp",
      prompt: "Cinematic photograph, 85mm lens, shallow depth of field: a snowy winter night on a street of the Plateau in Montréal, an iron outside spiral staircase dusted with snow, a warm glowing street lamp with fat snowflakes caught in its light, a lit window glowing orange in a dark brick facade, fresh snow on the road, falling snow in layers of bokeh, deep teal shadows against warm amber highlights, natural muted colours, sharp focus on the staircase, photographic realism. No text, no lettering, no logos, no readable signs.",
      seed: "61842442",
      width: 1360,
      height: 768,
      seconds: 6,
      costUsd: 0.0067,
      runId: "4848a156-4ad3-43d4-b388-886ac3ecd2ff",
    },
  },
  "products/orazaka/gallery-video/tea-pour": {
    id: "tea-pour",
    imageId: "tea-pour",
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

/** One slide of "Prompt → image → video": a clip and, when it was made from one, its image. */
export interface FeaturedItem {
  id: string;
  clip: GalleryClip;
  image?: ImageRecord;
}

/** The items of the home page's section: the featured clips, each with the image it was made from. */
export const FEATURED: readonly FeaturedItem[] = CLIPS.filter((clip) => clip.featured).map((clip) => ({ id: clip.id, clip, image: clip.image }));

export const imageUrl = (image: ImageRecord) => mediaUrl(image.src);

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
  if (clip.image) {
    // Made from an image: the Studio takes the image's asset id (the file of step 2, uploaded) beside the prompt.
    return [
      {
        language: "json",
        file: "inputs.json",
        code: JSON.stringify({ prompt: clip.prompt, image: "<asset id of the image of step 2>", durationSeconds: Math.round(clip.duration), aspect: clip.aspect, seed: clip.seed, model: clip.via?.key ?? CLIP_MODEL.key, ...(clip.upscale ? { upscale: `${Math.min(...clip.upscale.to.split("×").map(Number))}p` } : {}) }, null, 2),
      },
      { language: "bash", file: "Terminal", code: "orazaka studio run --studio video-generation --inputs-file inputs.json" },
    ];
  }
  return [
    {
      language: "bash",
      file: "Terminal",
      code: `orazaka video ${quoted} \\\n  --model ${CLIP_MODEL.key} --aspect ${clip.aspect} --seed ${clip.seed} --duration ${Math.round(clip.duration)}`,
    },
  ];
}

/** The commands that make the still again: the Studio's own inputs, then the run. */
export function imageReproduceParts(image: ImageRecord): ReproducePart[] {
  return [
    { language: "json", file: "inputs.json", code: JSON.stringify({ prompt: image.prompt, size: `${image.width}x${image.height}`, model: IMAGE_MODEL.key }, null, 2) },
    { language: "bash", file: "Terminal", code: "orazaka studio run --studio image-generation --inputs-file inputs.json" },
  ];
}
