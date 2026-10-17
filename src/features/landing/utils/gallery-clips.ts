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
  /** The pass alone on a free H100 (measured), not its time beside another job. */
  seconds: number;
  /** That time at the GPU's hourly rate, US dollars. */
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
  /** Set when the clip was made from an image by another model than `CLIP_MODEL`; `costUsd` is then the GPU time of the run. */
  via?: ClipVia;
  /** The 1080p pass after the clip, when it has one: `width` x `height` are then the upscaled frame. */
  upscale?: ClipUpscale;
  /** The image the clip starts from, when it does: the clip is `prompt → image → video`. */
  image?: ImageRecord;
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

/** Image to video: Wan 2.2 A14B (its image-to-video checkpoint) on an H100 80 GB (RunPod, by the hour), run by Orazaka's video Studio through its GPU relay. */
export const IMAGE_TO_VIDEO: ClipVia = {
  key: "wan2.2-t2v-a14b",
  name: "Wan 2.2 A14B",
  licence: "Apache-2.0",
  provider: "RunPod H100 80 GB",
};

/** SeedVR2 3B takes the 1280x720 clip to 1920x1080: 107 s alone on an H100 (measured, docs/_generated/MEASURED_RUNS.md), $3.99 an hour. */
export const UPSCALE_1080P: ClipUpscale = {
  model: "SeedVR2 3B",
  licence: "Apache-2.0",
  from: "1280×720",
  to: "1920×1080",
  seconds: 107,
  costUsd: 0.12,
};

/** The model of every image of the home page's strip: a run of the `image-generation` Studio. */
export const IMAGE_MODEL = {
  key: "stable-diffusion-3.5-large",
  name: "Stable Diffusion 3.5 Large",
  licence: "Stability AI Community Licence",
  provider: "DigitalOcean serverless inference",
} as const;

/** What each run recorded, by the media path of its file (no extension). */
const RECORDS: Record<string, ClipRecord> = {
  "products/orazaka/video/old-port": {
    id: "old-port",
    featured: true,
    prompt: "Slow lateral dolly along the quay at 35mm anamorphic: the amber lights of the Clock Tower and the quay lamps shimmer in long reflections on the glassy water, the moored ship's rigging sways very slightly, thin mist drifts across the river, distant silhouettes stroll along the quay, subtle anamorphic lens flare from the lamps. Cobalt blue hour grade with warm amber highlights, one continuous steady shot, photographic realism. No text, no lettering, no logos.",
    seed: "20261103",
    width: 1920,
    height: 1080,
    fps: 16,
    duration: 5.06,
    seconds: 1117,
    costUsd: 1.238,
    runId: "f476a266-adc9-47eb-bc7b-b929d97480d4",
    via: IMAGE_TO_VIDEO,
    upscale: UPSCALE_1080P,
    image: {
      id: "old-port",
      src: "products/orazaka/showcase/old-port.webp",
      prompt: "Cinematic still, 35mm anamorphic lens, blue hour: the Old Port of Montréal seen from the quay, the stone Clock Tower lit warm amber against a deep indigo sky, the St. Lawrence river glassy with long reflections of the city lights, a tall ship moored at the quay with softly lit rigging, a few people walking far away as silhouettes, thin mist on the water, cobalt shadows against warm amber practical lights, filmic teal-orange grade, sharp, photographic realism, wide 16:9 composition. No text, no lettering, no logos, no readable signs.",
      seed: "678812080",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "58bf878c-75bc-4506-8d9e-e04bd852ac9a",
    },
  },
  "products/orazaka/video/chefchaouen": {
    id: "chefchaouen",
    featured: true,
    prompt: "Slow forward dolly with a gentle upward tilt at 28mm along the blue steps: warm golden-hour light slides across the cobalt walls, leaves and flower petals in the terracotta pots sway in a light breeze, dust motes float in the sunbeams, the distant Rif mountains glow through soft haze. Warm highlights against cool blue shadows, filmic grade, one continuous steady shot, photographic realism. No text, no lettering, no logos.",
    seed: "20261102",
    width: 1920,
    height: 1080,
    fps: 16,
    duration: 5.06,
    seconds: 1119,
    costUsd: 1.2402,
    runId: "61aefd72-e063-4d94-bbd4-23dbc1c617a8",
    via: IMAGE_TO_VIDEO,
    upscale: UPSCALE_1080P,
    image: {
      id: "chefchaouen",
      src: "products/orazaka/showcase/chefchaouen.webp",
      prompt: "Cinematic still, 28mm lens, golden hour: the blue-washed stepped alleys of Chefchaouen in Morocco seen from a low angle, deep cobalt-blue walls glowing in warm low sun, terracotta pots overflowing with green plants and pink flowers on the steps, a white-and-blue archway in the background, long soft shadows, the Rif mountains hazy and warm behind the rooftops, gentle atmospheric haze, rich filmic colour grade with warm highlights and cool blue shadows, tack-sharp, photographic realism, wide 16:9 composition. No text, no lettering, no logos.",
      seed: "3082126038",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "c6db2ef7-7c05-431c-a300-64a1ded419af",
    },
  },
  "products/orazaka/video/grenoble": {
    id: "grenoble",
    featured: true,
    prompt: "Slow cinematic crane-up and forward dolly at 35mm: the camera rises smoothly beside the orange cable-car cabin as it glides along its cable, parallax reveals the layered Alps behind it, the low mist drifts and breathes through the valley, first rim light of sunrise slides along the snow ridges, tiny city lights twinkle below. Teal-and-orange filmic grade, shallow atmospheric haze, one continuous unbroken shot, steady and smooth, photographic realism. No text, no lettering, no logos.",
    seed: "20261100",
    width: 1920,
    height: 1080,
    fps: 16,
    duration: 5.06,
    seconds: 1184,
    costUsd: 1.3123,
    runId: "5f59dea1-faed-4506-accb-a9e8ec882642",
    via: IMAGE_TO_VIDEO,
    upscale: UPSCALE_1080P,
    image: {
      id: "grenoble",
      src: "products/orazaka/showcase/grenoble.webp",
      prompt: "Cinematic aerial still, 35mm anamorphic lens, blue-hour dawn over Grenoble: a bright orange spherical cable-car cabin hangs from a taut cable in the upper third of the frame, the city below sinking in luminous low mist, a wall of snow-capped Alps catching the first pink-gold sunrise light on their ridges, soft volumetric haze in the valley, shallow atmospheric perspective, teal shadows against warm orange highlights, filmic colour grade, ultra-sharp, photographic realism, wide 16:9 composition. No text, no lettering, no logos, no people visible.",
      seed: "939883888",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "ee92acd3-0bff-4a4a-8ea5-74495ca17906",
    },
  },
  "products/orazaka/gallery-video/assistant": {
    id: "assistant",
    featured: true,
    prompt: "Slow push-in dolly at 50mm toward the floating orange hologram: its wireframe blueprint slowly rotates and rebuilds itself line by line, the out-of-focus welding arm in the background strikes a few bright sparks that fall and bounce on the steel, volumetric haze drifts through the orange key light and the teal rim light, reflections slide across the brushed metal. Filmic teal-orange grade, shallow depth of field, one continuous unbroken shot, no people. No text, no lettering, no logos.",
    seed: "20261101",
    width: 1920,
    height: 1080,
    fps: 16,
    duration: 5.06,
    seconds: 1118,
    costUsd: 1.2391,
    runId: "f9e981ee-a20a-4f86-8a4d-08b9947fafa4",
    via: IMAGE_TO_VIDEO,
    upscale: UPSCALE_1080P,
    image: {
      id: "assistant",
      src: "products/orazaka/showcase/assistant.webp",
      prompt: "Cinematic still, 50mm lens, shallow depth of field: a night engineer's workshop, a precise glowing orange holographic blueprint of a compact machine floats above a brushed-steel workbench, thin wireframe lines and soft light caught in drifting volumetric haze, a robotic welding arm out of focus in the background throwing a few warm sparks, strong orange key light from the hologram and a cool teal rim light from behind, reflections on brushed metal, filmic teal-orange grade, sharp focus on the hologram, photographic realism, wide 16:9 composition. No people, no faces, no text, no lettering, no logos.",
      seed: "4272951330",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "1ad21e0d-950a-440c-9211-47e9ba5e114d",
    },
  },
  "products/orazaka/video/montreal": {
    id: "montreal",
    featured: true,
    prompt: "Locked-off 85mm shot with a very slow, subtle push-in, shallow depth of field: the snowy spiral staircase and the glowing street lamp stay perfectly in place, fat snowflakes drift down in layers through the warm lamp light, soft bokeh highlights, a thin plume of steam rises from a street vent, the lit window flickers gently. Natural muted colours, consistent exposure and colour temperature from the first frame to the last, neutral grey-blue shadows with warm amber only on the lamp, brick kept dark and desaturated, filmic grade, photographic realism. No text, no lettering, no logos.",
    seed: "20261177",
    width: 1920,
    height: 1080,
    fps: 16,
    duration: 4.44,
    seconds: 1179,
    costUsd: 1.3067,
    runId: "73c98873-040f-4db9-ab29-af04a030e02c",
    via: IMAGE_TO_VIDEO,
    upscale: UPSCALE_1080P,
    image: {
      id: "montreal",
      src: "products/orazaka/showcase/montreal.webp",
      prompt: "Cinematic still, 85mm lens, shallow depth of field: a snowy winter night on a street of the Plateau in Montréal, an iron outside spiral staircase dusted with snow, a warm glowing street lamp with fat snowflakes caught in its light, a lit window glowing orange in a dark brick facade, fresh snow on the road, falling snow in layers of bokeh, deep teal shadows against warm amber highlights, filmic grade, sharp focus on the staircase, photographic realism, wide 16:9 composition. No text, no lettering, no logos, no readable signs.",
      seed: "1642656917",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "fc3797f0-1a1d-43ce-a605-79981e4617a5",
    },
  },
  "products/yasakia/video/montreal-dawn": {
    id: "yasakia-montreal-dawn",
    featured: true,
    prompt: "Smooth drone glide forward and slightly down at 24mm over the Old Montréal rooftops toward the river: low fog slowly drifts between the buildings, sunrise light grows and rakes across the copper dome and stone roofs, emerald and turquoise reflections shimmer on the river, a few birds cross the frame. Cool shadows with golden highlights, filmic grade, one continuous steady shot, photographic realism. No text, no lettering, no logos.",
    seed: "20261105",
    width: 1920,
    height: 1080,
    fps: 16,
    duration: 5.06,
    seconds: 1197,
    costUsd: 1.3267,
    runId: "71339847-5295-41e7-966f-157356a75716",
    via: IMAGE_TO_VIDEO,
    upscale: UPSCALE_1080P,
    image: {
      id: "montreal-dawn",
      src: "products/orazaka/showcase/montreal-dawn.webp",
      prompt: "Cinematic aerial still, 24mm lens, dawn: Old Montréal rooftops seen from above, grey stone and copper roofs, a green-copper dome catching the first light, a low layer of fog hanging between the buildings, the St. Lawrence river beyond glowing in soft emerald and turquoise reflections, long warm shafts of sunrise light raking across the roofs, atmospheric depth, cool shadows against golden highlights, filmic colour grade, crisp architectural detail, photographic realism, wide 16:9 composition. No text, no lettering, no logos.",
      seed: "2905808571",
      width: 1024,
      height: 1024,
      seconds: 9,
      costUsd: 0.08,
      runId: "9a0ce9d2-44c2-4614-8adb-a61c7e456dc7",
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
        code: JSON.stringify({ prompt: clip.prompt, image: "<asset id of the image of step 2>", durationSeconds: Math.round(clip.duration), aspect: clip.aspect, seed: clip.seed, model: clip.via?.key ?? CLIP_MODEL.key, ...(clip.upscale ? { upscale: clip.upscale.to.split("×")[1] + "p" } : {}) }, null, 2),
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
