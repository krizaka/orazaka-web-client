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

/** Image to video: Wan 2.2 TI2V 5B on an H100 80 GB (RunPod, by the hour), run by Orazaka's video Studio through its GPU relay. */
export const IMAGE_TO_VIDEO: ClipVia = {
  key: "wan2.2-ti2v-5b",
  name: "Wan 2.2 TI2V 5B",
  licence: "Apache-2.0",
  provider: "RunPod H100 80 GB",
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
  "products/orazaka/video/grenoble": {
    id: "grenoble",
    featured: true,
    prompt: "The spherical cable-car cabins glide slowly up above the city, the Alps glow pink, mist drifts in the valley. Slow aerial drift, one continuous shot. No text, no lettering, no logos. Photographic realism, stable composition, subtle natural motion, the subject keeps its shape.",
    seed: "20261020",
    width: 1280,
    height: 704,
    fps: 24,
    duration: 5.04,
    seconds: 181,
    costUsd: 0.2006,
    runId: "1b56755b-063c-409e-8244-5a16bec55a44",
    via: IMAGE_TO_VIDEO,
    image: {
      id: "grenoble",
      src: "products/orazaka/showcase/grenoble.webp",
      prompt: "Dawn over Grenoble, the spherical cable-car cabins of the Bastille above the city, snow-capped Alps glowing pink behind, mist in the valley, aerial cinematic wide 16:9 photograph. No text, no lettering, no logos.",
      seed: "2380877182",
      width: 1024,
      height: 1024,
      seconds: 9,
      costUsd: 0.08,
      runId: "1eddafe2-06d5-454d-817e-5e6d130d5ed2",
    },
  },
  "products/orazaka/gallery-video/assistant": {
    id: "assistant",
    featured: true,
    prompt: "The holographic orange interface blooms and rearranges the blueprints in mid-air, sparks fly from the welding arm in the background, reflections move on the brushed metal, haze drifts slowly. Slow push-in, one continuous shot. No text, no lettering, no logos. Photographic realism, stable composition, subtle natural motion, the subject keeps its shape.",
    seed: "20261018",
    width: 1280,
    height: 704,
    fps: 24,
    duration: 5.04,
    seconds: 177,
    costUsd: 0.1962,
    runId: "22b5fc0e-3c82-4c6c-b520-9dd935b7b23e",
    via: IMAGE_TO_VIDEO,
    image: {
      id: "assistant",
      src: "products/orazaka/showcase/assistant.webp",
      prompt: "An engineer's workshop at night, a clean orange holographic blueprint of a machine hovering above a steel workbench, a robotic welding arm in the background, brushed metal surfaces, volumetric haze, sharp focus, cinematic sci-fi, no people. No text, no lettering, no logos.",
      seed: "3870958429",
      width: 1024,
      height: 1024,
      seconds: 10,
      costUsd: 0.08,
      runId: "295be566-d7e9-4244-9409-2ff3fc277dea",
    },
  },
  "products/orazaka/video/chefchaouen": {
    id: "chefchaouen",
    featured: true,
    prompt: "Slow drone glide forward over the blue alleys of Chefchaouen at golden hour, warm light shifts gently across the walls, a few plants sway in a light breeze, soft haze over the Rif mountains. One continuous shot, steady camera. No text, no lettering, no logos. Photographic realism, stable composition, subtle natural motion.",
    seed: "20261030",
    width: 1280,
    height: 704,
    fps: 24,
    duration: 5.04,
    seconds: 170,
    costUsd: 0.1884,
    runId: "f001c354-32b1-451c-afeb-24c904a8c5fc",
    via: IMAGE_TO_VIDEO,
    image: {
      id: "chefchaouen",
      src: "products/orazaka/showcase/chefchaouen.webp",
      prompt: "Golden hour over the blue-washed alleys of Chefchaouen in Morocco seen from a rooftop, stepped blue walls, terracotta pots with plants, warm light on the old town, the Rif mountains behind, wide 16:9 cinematic photograph. No text, no lettering, no logos.",
      seed: "234499369",
      width: 1024,
      height: 1024,
      seconds: 9,
      costUsd: 0.08,
      runId: "8a618a00-6852-44c1-b88b-936caba21b1f",
    },
  },
  "products/orazaka/video/old-port": {
    id: "old-port",
    featured: true,
    prompt: "Smooth cinematic drone glide forward over the Old Port, the water shimmers with reflections of the warm lights, a few people stroll along the quay, soft haze drifts. One single continuous shot, steady camera, no cuts. No text, no lettering, no logos. Photographic realism, stable composition, subtle natural motion, the subject keeps its shape.",
    seed: "20261017",
    width: 1280,
    height: 704,
    fps: 24,
    duration: 5.04,
    seconds: 182,
    costUsd: 0.2017,
    runId: "5c8fc9ca-b50f-4520-ae13-b1da956395d7",
    via: IMAGE_TO_VIDEO,
    image: {
      id: "old-port",
      src: "products/orazaka/showcase/old-port.webp",
      prompt: "The Old Port of Montréal at blue hour seen from above, the cobblestone quay and the Clock Tower lit in warm lights against a deep blue sky, the St. Lawrence river reflecting the city, a few people strolling, soft haze, wide cinematic 16:9 composition, photographic realism. No text, no lettering, no logos.",
      seed: "1305211136",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "021c4fde-afaa-4a5e-8f2d-c3f21ee3a01d",
    },
  },
  "products/orazaka/video/montreal": {
    id: "montreal",
    featured: true,
    prompt: "Slow tracking shot along the snowy street, snowflakes fall through the streetlight, steam rises from the vent, warm windows glow. One continuous shot, steady camera. No text, no lettering, no logos. Photographic realism, stable composition, subtle natural motion, the subject keeps its shape.",
    seed: "20261019",
    width: 1280,
    height: 704,
    fps: 24,
    duration: 5.04,
    seconds: 184,
    costUsd: 0.2039,
    runId: "88e648fb-68c6-4245-89bd-e79c42864ef7",
    via: IMAGE_TO_VIDEO,
    image: {
      id: "montreal",
      src: "products/orazaka/showcase/montreal.webp",
      prompt: "Winter night in Montréal, a snowy street of the Plateau with outside spiral staircases, warm windows glowing, snowflakes in the streetlight, steam rising from a vent, cinematic 35mm, shallow depth of field, wide 16:9. No text, no lettering, no logos.",
      seed: "2636103373",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "6869549d-e2ea-45a9-bb10-dddd16ce6e16",
    },
  },
  "products/yasakia/video/montreal-dawn": {
    id: "yasakia-montreal-dawn",
    featured: true,
    prompt: "Aerial drone shot gliding slowly over Old Montréal rooftops toward the river, low fog drifts, the light grows on the domes, reflections shimmer on the water. Smooth, one continuous shot. No text, no lettering, no logos. Photographic realism, stable composition, subtle natural motion, the subject keeps its shape.",
    seed: "20261021",
    width: 1280,
    height: 704,
    fps: 24,
    duration: 5.04,
    seconds: 194,
    costUsd: 0.215,
    runId: "6b7dc141-4f3e-46fd-9d58-3eb838a6ef9e",
    via: IMAGE_TO_VIDEO,
    image: {
      id: "montreal-dawn",
      src: "products/orazaka/showcase/montreal-dawn.webp",
      prompt: "Aerial view at dawn over Old Montréal rooftops toward the St. Lawrence river, low fog, emerald and turquoise reflections on the water, first light hitting the domes, wide 16:9 cinematic color grade. No text, no lettering, no logos.",
      seed: "1328802241",
      width: 1024,
      height: 1024,
      seconds: 8,
      costUsd: 0.08,
      runId: "bd749a18-c27c-4d11-9a96-b4565489389b",
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
        code: JSON.stringify({ prompt: clip.prompt, image: "<asset id of the image of step 2>", durationSeconds: Math.round(clip.duration), aspect: clip.aspect, seed: clip.seed, model: clip.via?.key ?? CLIP_MODEL.key }, null, 2),
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
