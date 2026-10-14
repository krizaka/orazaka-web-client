/**
 * @file gallery.ts
 * @description The "Made here" gallery — images Orazaka generated on one Mac (M1 Max, 64 GB), signed in as Eric, the
 * demo persona: each is a run of an art-direction Studio of orazaka-media (`orazaka studio run --studio <key>`), one
 * job at a time. `prompt` is exactly what reached the model (the subject + the Studio's direction); `seed` remakes it
 * with the same model and size; `seconds` is the generation time the job reported. Only what the data records is
 * shown. Files: products/orazaka/gallery/ on the CDN (core/media). Words: `t.gallery`.
 */
import { mediaUrl } from "@/core/media/cdn";

export type GalleryStyle = "golden" | "miniature" | "stillLife" | "montreal";

export interface GalleryItem {
  id: string;
  style: GalleryStyle;
  /** The art-direction Studio's key. */
  studio: string;
  width: number;
  height: number;
  seed: string;
  seconds: number;
  prompt: string;
}

export const GALLERY_MODEL = {
  /** The CLI's key (`orazaka models image use <key>`). */
  key: "flux-2-klein-4b",
  name: "FLUX.2 [klein] 4B",
  licence: "Apache-2.0",
  engine: "stable-diffusion.cpp on Metal",
  steps: 4,
} as const;

export const STYLES: readonly GalleryStyle[] = ["golden", "miniature", "stillLife", "montreal"];

export const GALLERY: readonly GalleryItem[] = [
  {
    id: "tea-pour",
    style: "golden",
    studio: "art-golden-hour",
    width: 1024,
    height: 1280,
    seed: "20261011",
    seconds: 120,
    prompt:
      "A man in a crisp white djellaba pours mint tea from a silver teapot held high above a small engraved tea glass, a long thin amber stream in the air, inside a Berber tent in the Sahara, fresh mint and almonds on a weathered wooden table. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
  {
    id: "mini-ironing",
    style: "miniature",
    studio: "art-miniature",
    width: 1024,
    height: 1280,
    seed: "21",
    seconds: 100,
    prompt:
      "Two grandmother figurines in richly embroidered North African kaftans and headscarves on a patterned Berber rug: one presses a large plain white linen tablecloth with a tiny old brass iron on a low woven ironing board, the other sits beside her sipping mint tea from a tiny glass, a brass teapot and a basket of oranges nearby. Tilt-shift miniature diorama photograph: handcrafted figurines and props at 1:24 scale, macro lens, extremely shallow depth of field with a thin plane of focus, soft window light, ultra-detailed textures of felt, embroidered thread, painted resin and carved wood. Warm ochre, saffron and indigo palette, playful and tender. No text, no lettering, no logos.",
  },
  {
    id: "mtl-ruelle",
    style: "montreal",
    studio: "art-montreal-night",
    width: 1360,
    height: 768,
    seed: "12",
    seconds: 109,
    prompt:
      "A narrow back alley of the Plateau between plain brick walls with no signs, exterior spiral staircases, wooden balconies with potted plants and parked bicycles, a lone cyclist far away. Night street photograph in Montreal after rain: wet cobblestones and asphalt mirroring warm window light and a neon glow of magenta and teal, light mist, 35mm lens at f/1.8, cinematic colour grading, deep blacks, rich textures of old brick, wrought-iron spiral staircases and wet pavement. No readable signs, no lettering, no logos.",
  },
  {
    id: "still-tea",
    style: "stillLife",
    studio: "art-still-life",
    width: 1024,
    height: 1280,
    seed: "99",
    seconds: 103,
    prompt:
      "A hammered copper teapot, two engraved tea glasses, fresh figs and dates on a crumpled linen cloth, a sprig of mint. Artisanal still life photograph on a weathered table: side light from a single window, deep soft shadows, chiaroscuro, 100mm macro lens at f/4, tactile textures of hand-thrown ceramics, hammered copper, linen and fresh produce. Muted earthy palette of clay, olive, cream and deep brown, quiet and timeless, painterly. No text, no lettering, no logos.",
  },
  {
    id: "mini-souk",
    style: "miniature",
    studio: "art-miniature",
    width: 1024,
    height: 1280,
    seed: "1212",
    seconds: 100,
    prompt:
      "A tiny souk alley: figurine spice merchants behind pyramids of saffron, paprika and cumin, hanging pierced-brass lanterns, woven baskets, a cat asleep on a blue doorstep. Tilt-shift miniature diorama photograph: handcrafted figurines and props at 1:24 scale, macro lens, extremely shallow depth of field with a thin plane of focus, soft window light, ultra-detailed textures of felt, embroidered thread, painted resin and carved wood. Warm ochre, saffron and indigo palette, playful and tender. No text, no lettering, no logos.",
  },
  {
    id: "mtl-mont-royal",
    style: "golden",
    studio: "art-golden-hour",
    width: 1360,
    height: 768,
    seed: "1876",
    seconds: 79,
    prompt:
      "The view from a stone lookout on Mount Royal in autumn: maple trees in crimson, orange and gold framing the Montreal skyline, the St. Lawrence River shining beyond. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
  {
    id: "tea-hands",
    style: "golden",
    studio: "art-golden-hour",
    width: 1024,
    height: 1280,
    seed: "314159",
    seconds: 120,
    prompt:
      "Close-up of an elderly woman's hands placing fresh mint sprigs into a silver teapot on a brass tray with three gilded tea glasses, inside a woven tent, sand dunes glowing through the opening. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
  {
    id: "mini-bagels",
    style: "miniature",
    studio: "art-miniature",
    width: 1024,
    height: 1280,
    seed: "2718",
    seconds: 102,
    prompt:
      "A tiny Montreal bagel bakery with bare plaster walls: baker figurines sliding sesame bagels out of a glowing wood-fired oven with long wooden peels, flour dust in the air, bagels cooling on a wooden counter, nothing hanging on the walls. Tilt-shift miniature diorama photograph: handcrafted figurines and props at 1:24 scale, macro lens, extremely shallow depth of field with a thin plane of focus, soft window light, ultra-detailed textures of felt, embroidered thread, painted resin and carved wood. Warm ochre, saffron and indigo palette, playful and tender. No text, no lettering, no logos.",
  },
  {
    id: "mtl-terrasse",
    style: "montreal",
    studio: "art-montreal-night",
    width: 1024,
    height: 1280,
    seed: "1980",
    seconds: 102,
    prompt:
      "A café terrace on a Montreal street at dusk: string lights over bistro tables with wine glasses and small plates, old greystone facades with wrought-iron balconies, people seen from behind. Night street photograph in Montreal after rain: wet cobblestones and asphalt mirroring warm window light and a neon glow of magenta and teal, light mist, 35mm lens at f/1.8, cinematic colour grading, deep blacks, rich textures of old brick, wrought-iron spiral staircases and wet pavement. No readable signs, no lettering, no logos.",
  },
  {
    id: "desert-camp",
    style: "golden",
    studio: "art-golden-hour",
    width: 1360,
    height: 768,
    seed: "271828",
    seconds: 136,
    prompt:
      "A desert camp at dusk: a low Berber tent with its flaps tied open, carpets and cushions laid on the sand, a copper kettle on glowing embers, two camels resting nearby, long shadows across the dunes. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
  {
    id: "mini-picnic",
    style: "miniature",
    studio: "art-miniature",
    width: 1360,
    height: 768,
    seed: "808",
    seconds: 80,
    prompt:
      "A family picnic in a tiny olive grove: grandfather figurine telling a story to children on a patterned rug, a tea set, oranges and bread, olive trees with silvery leaves. Tilt-shift miniature diorama photograph: handcrafted figurines and props at 1:24 scale, macro lens, extremely shallow depth of field with a thin plane of focus, soft window light, ultra-detailed textures of felt, embroidered thread, painted resin and carved wood. Warm ochre, saffron and indigo palette, playful and tender. No text, no lettering, no logos.",
  },
  {
    id: "mtl-snow",
    style: "montreal",
    studio: "art-montreal-night",
    width: 1024,
    height: 1280,
    seed: "2112",
    seconds: 97,
    prompt:
      "A quiet residential street in Montreal during the first snowfall at night, snow falling through warm streetlight, exterior staircases dusted with snow, footprints on the sidewalk. Night street photograph in Montreal after rain: wet cobblestones and asphalt mirroring warm window light and a neon glow of magenta and teal, light mist, 35mm lens at f/1.8, cinematic colour grading, deep blacks, rich textures of old brick, wrought-iron spiral staircases and wet pavement. No readable signs, no lettering, no logos.",
  },
  {
    id: "tea-glass",
    style: "golden",
    studio: "art-golden-hour",
    width: 1024,
    height: 1280,
    seed: "1618",
    seconds: 112,
    prompt:
      "A single engraved tea glass of mint tea catching the low sun on a weathered wooden table, a bowl of dates and almonds, fresh mint leaves, a patterned wool rug softly blurred behind. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
  {
    id: "still-table",
    style: "stillLife",
    studio: "art-still-life",
    width: 1360,
    height: 768,
    seed: "2026",
    seconds: 78,
    prompt:
      "Hand-thrown ceramic bowls of green olives and preserved lemons, a round loaf of bread, a small jug of olive oil and a branch of an olive tree on a weathered oak table. Artisanal still life photograph on a weathered table: side light from a single window, deep soft shadows, chiaroscuro, 100mm macro lens at f/4, tactile textures of hand-thrown ceramics, hammered copper, linen and fresh produce. Muted earthy palette of clay, olive, cream and deep brown, quiet and timeless, painterly. No text, no lettering, no logos.",
  },
  {
    id: "mini-skating",
    style: "miniature",
    studio: "art-miniature",
    width: 1360,
    height: 768,
    seed: "1643",
    seconds: 75,
    prompt:
      "A tiny winter park in Montreal: figurines skating on a frozen pond, a small plain wooden cabin with a glowing window and no signboard, snow-covered spruce trees and warm string lights at dusk. Tilt-shift miniature diorama photograph: handcrafted figurines and props at 1:24 scale, macro lens, extremely shallow depth of field with a thin plane of focus, soft window light, ultra-detailed textures of felt, embroidered thread, painted resin and carved wood. Warm ochre, saffron and indigo palette, playful and tender. No text, no lettering, no logos.",
  },
  {
    id: "mtl-jean-talon",
    style: "golden",
    studio: "art-golden-hour",
    width: 1360,
    height: 768,
    seed: "1933",
    seconds: 70,
    prompt:
      "A covered open-air farmers' market in Montreal in late summer: crates of heirloom tomatoes, corn, peppers, blueberries and bunches of wildflowers under a long market canopy, shoppers seen from behind, no signs. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
  {
    id: "tea-friends",
    style: "golden",
    studio: "art-golden-hour",
    width: 1360,
    height: 768,
    seed: "4242",
    seconds: 91,
    prompt:
      "Three friends laughing on floor cushions in a desert tent as a woman in an indigo linen dress pours tea, brass lanterns not yet lit, the dunes bright through the open side. Editorial lifestyle photograph at golden hour: warm low sunlight raking from the side, long soft shadows, dust motes glowing in the air. 85mm lens at f/2, shallow depth of field, natural skin and fabric texture, rich tactile materials — weathered wood, wool, brass, linen. Warm palette of amber, terracotta, saffron and sand, gentle film grain, refined composition with breathing space. No text, no lettering, no logos.",
  },
];

export const gallerySrc = (id: string): string => mediaUrl(`products/orazaka/gallery/${id}.webp`);

/** Where a Studio's own direction begins in the stored prompt: what precedes it is the subject Eric typed. */
const DIRECTION_MARKERS: Record<GalleryStyle, string> = {
  golden: "Editorial lifestyle photograph at golden hour",
  miniature: "Tilt-shift miniature diorama photograph",
  stillLife: "Artisanal still life photograph",
  montreal: "Night street photograph in Montreal",
};

/**
 * The subject of an image — the Studio's only prose input. The stored prompt is `<subject>. <direction>` (the
 * blueprint's `{{inputs.subject}}. …`), so the subject is what comes before the direction.
 */
export function subjectOf(item: GalleryItem): string {
  const at = item.prompt.indexOf(DIRECTION_MARKERS[item.style]);
  if (at < 0) throw new Error(`${item.id}: the Studio's direction is not in its prompt`);
  return item.prompt.slice(0, at).replace(/\.\s*$/, "").trim();
}

/**
 * The commands that make the image again on an Orazaka install: the same model, then the same Studio with the same
 * subject, size and seed (`orazaka studio run --studio <key>`, `--inputs-file` for prose — orazaka-cli).
 */
export function reproduceCommand(item: GalleryItem): string {
  const subject = JSON.stringify({ subject: subjectOf(item) }, null, 2);
  return [
    `orazaka models image use ${GALLERY_MODEL.key}`,
    `cat > inputs.json <<'JSON'`,
    subject,
    `JSON`,
    `orazaka studio run --studio ${item.studio} --inputs-file inputs.json \\`,
    `  --inputs size=${item.width}x${item.height},seed=${item.seed}`,
  ].join("\n");
}
