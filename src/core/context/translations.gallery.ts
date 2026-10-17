/**
 * @file translations.gallery.ts
 * @description Copy of the "Made here" gallery (the featured prompt-to-image section of the home page, /gallery and
 * its credits), en and fr. Image alts and style names come from krizaka.com's former gallery. The data (prompts,
 * seeds, sizes, times) is in features/landing/utils/gallery.ts — this file holds words only.
 */
type Locale = "en" | "fr";

export interface GalleryDictionary {
  eyebrow: string;
  featuredTitle: string;
  featuredLead: string;
  prev: string;
  next: string;
  /** "{n}" of "{total}". */
  counter: string;
  /** The slideshow's accessible name. */
  carousel: string;
  /** The pause button while it plays / once paused. */
  pause: string;
  play: string;
  /** A progress segment's name, "{n}". */
  goTo: string;
  /** A slide's name, "{n}" of "{total}". */
  slide: string;
  all: string;
  /** The home teaser's button: the demo is /gallery. */
  seeDemo: string;
  filterDocuments: string;
  filterDay: string;
  documentsTitle: string;
  documentsBody: string;
  documentsLink: string;
  galleryTitle: string;
  galleryLead: string;
  filterLabel: string;
  filterAll: string;
  count: string;
  studio: string;
  model: string;
  size: string;
  time: string;
  seedValue: string;
  copy: string;
  copied: string;
  copyFailed: string;
  reproduce: string;
  reproduceLead: string;
  copyCommand: string;
  commandCopied: string;
  promptHeading: string;
  home: string;
  creditsTitle: string;
  creditsLead: string;
  credits: string[];
  meta: string;
  metaDescription: string;
  engine: string;
  promptLabel: string;
  seedLabel: string;
  /** "{seconds}" s on a Mac. */
  local: string;
  styles: Record<"golden" | "miniature" | "stillLife" | "montreal", string>;
  /** Alt text of every image, by id. */
  items: Record<string, string>;
  /** The accessible name of every clip, by id. */
  clips: Record<string, string>;
  /** "Video · {seconds} s": the badge that says a clip is a video. */
  videoBadge: string;
  videoPlay: string;
  videoPause: string;
  videoMute: string;
  videoUnmute: string;
  /** The whole frame of a clip opens it larger. */
  videoEnlarge: string;
  videoClose: string;
  /** The filter that lists only the images / only the videos of /gallery. */
  filterImages: string;
  filterVideos: string;
  /** The title and lead of the Videos section of /gallery. */
  videosTitle: string;
  videosLead: string;
  /** "{count}" videos. */
  countVideos: string;
  /** The heading of the facts of a run. */
  runHeading: string;
  /** The download button of a clip. */
  videoDownload: string;
  /** "Compare models": the title, the lead, the filter, the title of each inspiration, the image alt ("{model}", "{title}") and the honest "where". */
  compareTitle: string;
  compareLead: string;
  filterCompare: string;
  compareTitles: Record<string, string>;
  compareAlt: string;
  compareWhere: string;
  compareOnMac: string;
  compareOnDo: string;
  compareNoCost: string;
  /** "{cost}" US dollars an image. */
  compareImageCost: string;
  compareSeedIgnored: string;
  /** The link from the comparison to the generated docs page that holds every measurement. */
  compareMeasured: string;
  /** "{model}": a model whose run did not finish on this prompt (said, never hidden). */
  compareMissing: string;
  /** The name of the Video · Image tabs. */
  stepsLabel: string;
  /** The strip of the home page: three steps, each with a chip saying where it was made. */
  stepPrompt: string;
  stepImage: string;
  stepVideo: string;
  /** "{seconds}" s, "{cost}" US dollars: where the image was made. */
  imageChip: string;
  /** "{seconds}" s, "{cost}" US dollars. */
  videoChip: string;
  videoChipNoTime: string;
  /** "{cost}" US dollars of GPU time, and its label in the run's facts. */
  gpuCost: string;
  gpuCostLabel: string;
  /** The upscale pass of a clip: its label and its fact ("{model}", "{licence}", "{from}", "{to}", "{seconds}", "{cost}"). */
  upscaleLabel: string;
  upscaleFact: string;
  /** "{cost}" US dollars, the provider's price for the image. */
  imageCost: string;
  /** The still of each featured clip, described for a screen reader. */
  stills: Record<string, string>;
  /** The size the image was made at and the 16:9 frame the video starts from. */
  imageFrame: string;
  imageFrameLabel: string;
  details: string;
  more: string;
  less: string;
  /** The video starts from the image: the first frame is the image, cut to 16:9. */
  fromImage: string;
  imageStep: string;
  videoStep: string;
  imagePromptHeading: string;
  videoPromptHeading: string;
  /** What a clip is: its prompt is its own, no image feeds it. */
  videoModel: string;
  videoProvider: string;
  runBy: string;
  runId: string;
  frame: string;
  clipLength: string;
  clipCost: string;
  /** "{seconds}" s, from the command to the file. */
  videoTime: string;
  /** "{fps}" frames per second. */
  fps: string;
  /** "{seconds}" seconds. */
  seconds: string;
  /** "{cost}" US dollars, the provider's price for the clip. */
  cost: string;
  routedBy: string;
  videoReproduceLead: string;
  videoSection: string;
  videoNote: string;
}

export const gallery: Record<Locale, GalleryDictionary> = {
  en: {
    "eyebrow": "Made here",
    "featuredTitle": "One prompt, an image, a video: three real runs.",
    "featuredLead": "Each example is two Orazaka runs in a row: the prompt makes the image (Stable Diffusion 3.5 Large on DigitalOcean's serverless inference), then that image starts the video (Wan 2.2 A14B on an H100 GPU rented by the hour), upscaled to 1080p by SeedVR2 3B, graded and given its sound. Each step shows its exact prompt and what the run recorded — model, provider, time, cost, run id; reproduce it yourself.",
    "prev": "Previous image",
    "next": "Next image",
    "counter": "Image {n} of {total}",
    "carousel": "Prompt to image to video gallery",
    "pause": "Pause the gallery",
    "play": "Play the gallery",
    "goTo": "Go to image {n}",
    "slide": "{n} of {total}",
    "all": "See the whole gallery",
    "seeDemo": "See the demo",
    "filterDocuments": "Documents",
    "filterDay": "A day of work",
    "documentsTitle": "Documents",
    "documentsBody": "Document checks (a lease against the law, a supplier's PDF) will be here as interactive replays you can step through. They are not built yet, so nothing is shown in their place; the real recordings of these checks are in A day of work.",
    "documentsLink": "Follow the interactive replays",
    "galleryTitle": "The demo: what Orazaka makes here",
    "galleryLead": "Seventeen images, four art directions. Each one shows what the data records: the prompt that reached the model, the Studio, the model, the seed, the size and the time it took on one Mac. Nothing else is claimed.",
    "filterLabel": "Filter by style",
    "filterAll": "All styles",
    "count": "{count} images",
    "studio": "Studio",
    "model": "Model",
    "size": "Size",
    "time": "Time",
    "seedValue": "Seed",
    "copy": "Copy prompt",
    "copied": "Prompt copied",
    "copyFailed": "Copy is not available in this browser",
    "reproduce": "Reproduce it",
    "reproduceLead": "The same prompt, size, model and seed give the same image on your own Orazaka install. Run it from the CLI:",
    "copyCommand": "Copy command",
    "commandCopied": "Command copied",
    "promptHeading": "Prompt",
    "home": "Back to the home page",
    "creditsTitle": "Credits",
    "creditsLead": "Every image of this gallery was generated by Orazaka on one Mac (MacBook Pro M1 Max, 64 GB), locally — nothing left the machine.",
    "credits": [
      "Model: FLUX.2 [klein] 4B (Black Forest Labs), Q8 GGUF — Apache-2.0.",
      "Text encoder: Qwen3-4B (Alibaba Qwen) — Apache-2.0. VAE: FLUX.2 VAE — Apache-2.0.",
      "Runtime: stable-diffusion.cpp (MIT) on Metal, through Orazaka's image capability (the art-direction Studios of orazaka-media).",
      "Account: Eric, the demo persona. No real person, brand, logo or third-party product is depicted."
    ],
    "meta": "Orazaka — Made here",
    "metaDescription": "Images generated on one Mac by Orazaka, each with its exact prompt, seed and model — and the command that reproduces it.",
    "engine": "FLUX.2 [klein] 4B (Apache-2.0) · stable-diffusion.cpp on Metal · 4 steps · 1024 px",
    "promptLabel": "Prompt",
    "seedLabel": "seed",
    "local": "Generated locally in {seconds} s on a Mac — nothing left the machine.",
    "videoBadge": "Video · {seconds} s",
    "videoPlay": "Play the video",
    "videoPause": "Pause the video",
    "videoMute": "Mute the video",
    "videoUnmute": "Turn the sound on",
    "videoEnlarge": "Open the video larger",
    "videoClose": "Close the video",
    "filterImages": "Images",
    "filterVideos": "Videos",
    "videosTitle": "Videos",
    "videosLead": "Every video is an Orazaka run — the video Studio of orazaka-media — made by Wan 2.2 A14B on DigitalOcean's serverless inference and routed by Orazaka. Each shows its exact prompt and what the run recorded, and the command that makes it again.",
    "countVideos": "{count} videos",
    "runHeading": "The run",
    "videoDownload": "Download the clip",
    "compareTitle": "Compare models",
    "compareLead": "One prompt per inspiration, the same for every model: each image is an Orazaka run of the image-generation Studio. The local models ran on one Mac (Metal) and nothing left the machine; Stable Diffusion 3.5 Large is hosted by DigitalOcean's serverless inference and routed by Orazaka, at $0.08 an image.",
    "filterCompare": "Compare models",
    "compareTitles": {
      "montreal-winter": "A winter night in Montréal",
      "moroccan-riad": "A Moroccan riad",
      "alps-dawn": "The Alps at dawn",
      "neon-arcade": "A neon arcade",
      "server-room": "A sovereign server room",
      "notary-desk": "A Québec notary's desk"
    },
    "compareAlt": "{title}, by {model}",
    "compareWhere": "Ran on",
    "compareOnMac": "One Mac (Metal) — nothing left the machine",
    "compareOnDo": "DigitalOcean serverless inference",
    "compareNoCost": "None — your own machine",
    "compareImageCost": "${cost} an image",
    "compareSeedIgnored": "not honoured by the provider",
    "compareMeasured": "Time, price and every parameter of these runs: Measured runs (docs)",
    "compareMissing": "{model}: its run did not finish on this prompt (the image client gave up waiting for the Mac), so there is no image to show.",
    "stepsLabel": "What to show: the video or the image",
    "stepPrompt": "Prompt",
    "stepImage": "Image",
    "stepVideo": "Video",
    "imageChip": "SD 3.5 Large · DigitalOcean · {seconds} s · ${cost}",
    "videoChip": "{model} · {where} · {seconds} s · ${cost}",
    "videoChipNoTime": "{model} · {where} · ${cost}",
    "details": "Details",
    "more": "More",
    "less": "Less",
    "fromImage": "The video starts from this image (cut to 16:9) and moves from it; the clip is then upscaled to 1080p and graded.",
    "imageStep": "Image",
    "videoStep": "Video",
    "imagePromptHeading": "Image prompt",
    "videoPromptHeading": "Video prompt",
    "videoModel": "Video model",
    "videoProvider": "Made by",
    "runBy": "Run by",
    "runId": "Orazaka run",
    "frame": "Frame",
    "clipLength": "Length",
    "clipCost": "Provider price",
    "videoTime": "{seconds} s, from the command to the file",
    "fps": "{fps} frames per second",
    "seconds": "{seconds} seconds",
    "cost": "${cost} a clip",
    "gpuCost": "${cost} of GPU time",
    "gpuCostLabel": "GPU cost of the run",
    "upscaleLabel": "Upscale",
    "upscaleFact": "{model} ({licence}) · {from} → {to} · about {seconds} s alone on an H100 · ${cost}",
    "imageCost": "${cost} an image",
    "imageFrame": "{width}×{height}, cut to 16:9 for the video",
    "imageFrameLabel": "Size",
    "routedBy": "routed by Orazaka",
    "videoReproduceLead": "The same prompt, model and seed give the same shot again from the CLI of your own Orazaka (it needs a provider key for serverless inference):",
    "videoSection": "Videos",
    "videoNote": "Each video is an Orazaka run — the video Studio of orazaka-media — made by Wan 2.2 — A14B on DigitalOcean's serverless inference for a clip from a prompt alone, A14B on an H100 GPU for a clip made from an image, then SeedVR2 3B for 1080p — and routed by Orazaka. The images of the gallery are generated on one Mac.",
    "clips": {
      "tea-pour": "Slow-motion video: mint tea pours from a silver teapot into an engraved glass in a Berber tent, steam curling through a shaft of golden light",
      "assistant": "A night workshop: an orange-gold holographic blueprint built above a steel bench under a machine head, sparks and light falling on the metal, a slow push-in",
      "montreal": "A snowy night on a street of the Plateau: the spiral staircase and the street lamp, fat snowflakes in the warm light",
      "old-port": "The Old Port of Montréal as the light falls: the Clock Tower and the tall ship at the quay, the sky deepening to blue hour, lamps coming up in the water",
      "maroc": "Golden hour over the blue alleys of Chefchaouen, then into a riad courtyard with a zellige fountain — a cross-dissolve joins the two shots",
      "grenoble": "Dawn over Grenoble: a slow crane-up beside an orange cable-car cabin, the city lights below, the Alps and the mist revealed behind",
      "chefchaouen": "Golden hour on the blue stairs of Chefchaouen: a slow forward move past the flowers, light shifting on the walls, the Rif mountains appearing through an arch",
      "arcade": "A 1990s arcade at night: hands on a joystick and buttons, neon magenta and cyan, coloured smoke",
      "yasakia-montreal-dawn": "Old Montréal from above at first light: a slow glide past a green-copper dome, low fog drifting between the roofs, birds crossing",
      "yororis-microphone": "A vintage ribbon microphone in a quiet sand-coloured room, sage-green curtains moving in the breeze, light particles drifting",
      "orochia-studio-night": "A creator's studio at night seen from behind a cinema camera, violet and magenta light, haze and ring-light bokeh",
      "yomizaka-contracts": "Contracts on a walnut desk at blue hour, a line of warm light sweeping the pages, a coffee steaming, snow falling outside"
    },
    "stills": {
      "grenoble": "Dawn over Grenoble: orange cable-car cabins above the city, the snow-capped Alps behind, mist in the valley",
      "assistant": "A night workshop: an orange holographic blueprint of a machine hovers above a steel workbench, a welding arm behind it",
      "chefchaouen": "Golden hour over the blue-washed stairs and alleys of Chefchaouen, terracotta pots and the Rif mountains behind",
      "old-port": "The Old Port of Montréal at blue hour: the Clock Tower lit warm, the quay wet with reflections, a tall ship at its mooring",
      "montreal": "A snowy night on a street of the Plateau: spiral staircase, street lamp glowing, snowflakes in the light",
      "montreal-dawn": "Old Montréal rooftops seen from above at first light, a green-copper dome, low fog and the river behind"
    },
    "styles": {
      "golden": "Golden-hour editorial",
      "miniature": "Tilt-shift miniature",
      "stillLife": "Artisanal still life",
      "montreal": "Montreal at night"
    },
    "items": {
      "tea-pour": "A man in a white djellaba pours mint tea from high above a glass in a desert tent, mint and almonds on a weathered table",
      "mini-ironing": "Miniature diorama: two grandmother figurines in embroidered kaftans on a Berber rug, one pressing a white linen cloth, the other sipping tea",
      "mtl-ruelle": "A Montreal back alley at night after rain, spiral staircases and neon reflected in wet cobblestones",
      "still-tea": "Still life: a hammered copper teapot, engraved tea glasses, figs and dates on linen in window light",
      "mini-souk": "Miniature souk alley with pyramids of spices, brass lanterns and a cat asleep on a blue doorstep",
      "mtl-mont-royal": "Montreal seen from a lookout on Mount Royal in autumn, maples in crimson and gold",
      "tea-hands": "An elderly woman's hands add fresh mint to a silver teapot on a brass tray, dunes glowing through the tent",
      "mini-bagels": "Miniature Montreal bagel bakery: baker figurines pulling sesame bagels from a wood-fired oven",
      "mtl-terrasse": "A Montreal café terrace at dusk under string lights, greystone facades and wrought-iron balconies",
      "desert-camp": "A Berber tent at dusk with carpets on the sand, a copper kettle on embers and two camels resting",
      "mini-picnic": "Miniature picnic in an olive grove: a grandfather figurine telling a story to children on a patterned rug",
      "mtl-snow": "A Montreal residential street during the first snowfall at night, staircases dusted with snow",
      "tea-glass": "A glass of mint tea catching the low sun on a wooden table, dates and almonds beside it",
      "still-table": "Still life: ceramic bowls of olives and preserved lemons, bread and an olive branch on an oak table",
      "mini-skating": "Miniature winter park in Montreal: figurines skating on a frozen pond under string lights",
      "mtl-jean-talon": "A covered farmers' market in late summer: crates of tomatoes, corn, blueberries and wildflowers",
      "tea-friends": "Three friends laughing on cushions in a desert tent while tea is poured"
    }
  },
  fr: {
    "eyebrow": "Fait ici",
    "featuredTitle": "Une consigne, une image, une vidéo : trois vraies exécutions.",
    "featuredLead": "Chaque exemple est deux exécutions Orazaka à la suite : la consigne produit l'image (Stable Diffusion 3.5 Large sur l'inférence serverless de DigitalOcean), puis cette image lance la vidéo (Wan 2.2 A14B sur un GPU H100 loué à l'heure), portée en 1080p par SeedVR2 3B, étalonnée et sonorisée. Chaque étape montre sa consigne exacte et ce que l'exécution a enregistré — modèle, fournisseur, durée, coût, identifiant ; reproduisez-la vous-même.",
    "prev": "Image précédente",
    "next": "Image suivante",
    "counter": "Image {n} sur {total}",
    "carousel": "Galerie consigne, image, vidéo",
    "pause": "Mettre la galerie en pause",
    "play": "Relancer la galerie",
    "goTo": "Aller à l'image {n}",
    "slide": "{n} sur {total}",
    "all": "Voir toute la galerie",
    "seeDemo": "Voir la démo",
    "filterDocuments": "Documents",
    "filterDay": "Une journée de travail",
    "documentsTitle": "Documents",
    "documentsBody": "Les contrôles de documents (un bail face à la loi, le PDF d'un fournisseur) seront ici en rediffusions interactives où l'on avance pas à pas. Elles ne sont pas encore construites : rien n'est montré à leur place ; les vrais enregistrements de ces contrôles sont dans Une journée de travail.",
    "documentsLink": "Suivre les rediffusions interactives",
    "galleryTitle": "La démo : ce qu'Orazaka fait ici",
    "galleryLead": "Dix-sept images, quatre directions artistiques. Chacune montre ce que les données enregistrent : la consigne reçue par le modèle, le Studio, le modèle, la graine, le format et le temps pris sur un Mac. Rien d'autre n'est affirmé.",
    "filterLabel": "Filtrer par style",
    "filterAll": "Tous les styles",
    "count": "{count} images",
    "studio": "Studio",
    "model": "Modèle",
    "size": "Format",
    "time": "Durée",
    "seedValue": "Graine",
    "copy": "Copier la consigne",
    "copied": "Consigne copiée",
    "copyFailed": "La copie n'est pas disponible dans ce navigateur",
    "reproduce": "La refaire",
    "reproduceLead": "La même consigne, le même format, le même modèle et la même graine redonnent la même image sur votre propre installation d'Orazaka. Lancez-la depuis la CLI :",
    "copyCommand": "Copier la commande",
    "commandCopied": "Commande copiée",
    "promptHeading": "Consigne",
    "home": "Retour à l'accueil",
    "creditsTitle": "Crédits",
    "creditsLead": "Chaque image de cette galerie a été générée par Orazaka sur un seul Mac (MacBook Pro M1 Max, 64 Go), en local — rien n'a quitté la machine.",
    "credits": [
      "Modèle : FLUX.2 [klein] 4B (Black Forest Labs), Q8 GGUF — Apache-2.0.",
      "Encodeur de texte : Qwen3-4B (Alibaba Qwen) — Apache-2.0. VAE : FLUX.2 VAE — Apache-2.0.",
      "Exécution : stable-diffusion.cpp (MIT) sur Metal, via la capacité image d'Orazaka (les Studios de direction artistique d'orazaka-media).",
      "Compte : Eric, la persona de démo. Aucune personne réelle, marque, logo ou produit tiers n'est représenté."
    ],
    "meta": "Orazaka — Fait ici",
    "metaDescription": "Des images générées sur un seul Mac par Orazaka, chacune avec sa consigne exacte, sa graine et son modèle — et la commande qui la refait.",
    "engine": "FLUX.2 [klein] 4B (Apache-2.0) · stable-diffusion.cpp sur Metal · 4 étapes · 1024 px",
    "promptLabel": "Consigne",
    "seedLabel": "graine",
    "local": "Générée localement en {seconds} s sur un Mac — rien n'a quitté la machine.",
    "videoBadge": "Vidéo · {seconds} s",
    "videoPlay": "Lancer la vidéo",
    "videoPause": "Mettre la vidéo en pause",
    "videoMute": "Couper le son",
    "videoUnmute": "Activer le son",
    "videoEnlarge": "Ouvrir la vidéo en grand",
    "videoClose": "Fermer la vidéo",
    "filterImages": "Images",
    "filterVideos": "Vidéos",
    "videosTitle": "Vidéos",
    "videosLead": "Chaque vidéo est une exécution Orazaka — le Studio vidéo d'orazaka-media — réalisée par Wan 2.2 A14B sur l'inférence serverless de DigitalOcean et routée par Orazaka. Chacune montre sa consigne exacte, ce que l'exécution a enregistré, et la commande qui la refait.",
    "countVideos": "{count} vidéos",
    "runHeading": "L'exécution",
    "videoDownload": "Télécharger la vidéo",
    "compareTitle": "Comparer les modèles",
    "compareLead": "Une consigne par inspiration, la même pour chaque modèle : chaque image est une exécution Orazaka du Studio de génération d'images. Les modèles locaux ont tourné sur un seul Mac (Metal) et rien n'a quitté la machine ; Stable Diffusion 3.5 Large est hébergé par l'inférence serverless de DigitalOcean et routé par Orazaka, à 0,08 $ l'image.",
    "filterCompare": "Comparer les modèles",
    "compareTitles": {
      "montreal-winter": "Une nuit d'hiver à Montréal",
      "moroccan-riad": "Un riad marocain",
      "alps-dawn": "Les Alpes à l'aube",
      "neon-arcade": "Une salle d'arcade au néon",
      "server-room": "Une salle de serveurs souveraine",
      "notary-desk": "Le bureau d'un notaire québécois"
    },
    "compareAlt": "{title}, par {model}",
    "compareWhere": "Exécuté sur",
    "compareOnMac": "Un seul Mac (Metal) — rien n'a quitté la machine",
    "compareOnDo": "Inférence serverless de DigitalOcean",
    "compareNoCost": "Aucun — votre propre machine",
    "compareImageCost": "{cost} $ l'image",
    "compareSeedIgnored": "ignorée par le fournisseur",
    "compareMeasured": "Temps, prix et chaque paramètre de ces exécutions : Measured runs (docs, en anglais)",
    "compareMissing": "{model} : son exécution n'a pas abouti sur cette consigne (le client d'images a renoncé à attendre le Mac), il n'y a donc pas d'image à montrer.",
    "stepsLabel": "Quoi montrer : la vidéo ou l'image",
    "stepPrompt": "Consigne",
    "stepImage": "Image",
    "stepVideo": "Vidéo",
    "imageChip": "SD 3.5 Large · DigitalOcean · {seconds} s · {cost} $",
    "videoChip": "{model} · {where} · {seconds} s · {cost} $",
    "videoChipNoTime": "{model} · {where} · {cost} $",
    "details": "Détails",
    "more": "Plus",
    "less": "Moins",
    "fromImage": "La vidéo part de cette image (recadrée en 16:9) et s'anime à partir d'elle ; le plan est ensuite porté en 1080p et étalonné.",
    "imageStep": "Image",
    "videoStep": "Vidéo",
    "imagePromptHeading": "Consigne de l'image",
    "videoPromptHeading": "Consigne de la vidéo",
    "videoModel": "Modèle vidéo",
    "videoProvider": "Réalisé par",
    "runBy": "Exécuté par",
    "runId": "Exécution Orazaka",
    "frame": "Format",
    "clipLength": "Durée",
    "clipCost": "Prix du fournisseur",
    "videoTime": "{seconds} s, de la commande au fichier",
    "fps": "{fps} images par seconde",
    "seconds": "{seconds} secondes",
    "cost": "{cost} $ US le plan",
    "gpuCost": "{cost} $ de temps GPU",
    "gpuCostLabel": "Coût GPU de l'exécution",
    "upscaleLabel": "Montée en résolution",
    "upscaleFact": "{model} ({licence}) · {from} → {to} · environ {seconds} s seul sur un H100 · {cost} $",
    "imageCost": "{cost} $ US l'image",
    "imageFrame": "{width}×{height}, recadrée en 16:9 pour la vidéo",
    "imageFrameLabel": "Taille",
    "routedBy": "routé par Orazaka",
    "videoReproduceLead": "La même consigne, le même modèle et la même graine redonnent le même plan depuis le CLI de votre propre Orazaka (il faut une clé de fournisseur d'inférence serverless) :",
    "videoSection": "Vidéos",
    "videoNote": "Chaque vidéo est une exécution Orazaka — le Studio vidéo d'orazaka-media — réalisée par Wan 2.2 — A14B sur l'inférence serverless de DigitalOcean pour un plan fait de la seule consigne, A14B sur un GPU H100 pour un plan fait à partir d'une image, puis SeedVR2 3B pour le 1080p — et routée par Orazaka. Les images de la galerie sont générées sur un seul Mac.",
    "clips": {
      "tea-pour": "Vidéo au ralenti : du thé à la menthe coule d'une théière en argent dans un verre gravé, sous une tente berbère, la vapeur dans un rayon de lumière dorée",
      "assistant": "Un atelier de nuit : un plan holographique or-orange construit au-dessus d'un établi en acier, sous une tête de machine, des étincelles et de la lumière sur le métal, un lent travelling avant",
      "montreal": "Une nuit de neige dans une rue du Plateau : l'escalier en colimaçon et le lampadaire, de gros flocons dans la lumière chaude",
      "old-port": "Le Vieux-Port de Montréal quand la lumière tombe : la tour de l'Horloge et le grand voilier à quai, le ciel qui vire à l'heure bleue, les lampes qui s'allument dans l'eau",
      "maroc": "Heure dorée sur les ruelles bleues de Chefchaouen, puis dans la cour d'un riad avec sa fontaine en zellige — un fondu enchaîné relie les deux plans",
      "grenoble": "Aube sur Grenoble : une lente montée de grue le long d'une cabine orange du téléphérique, les lumières de la ville en dessous, les Alpes et la brume qui se révèlent derrière",
      "chefchaouen": "Heure dorée sur les escaliers bleus de Chefchaouen : un lent mouvement en avant devant les fleurs, la lumière qui glisse sur les murs, les montagnes du Rif qui apparaissent sous une arche",
      "arcade": "Une salle d'arcade des années 90 la nuit : des mains sur un joystick et des boutons, néons magenta et cyan, fumée colorée",
      "yasakia-montreal-dawn": "Le Vieux-Montréal vu d'en haut aux premières lueurs : un lent vol plané près d'un dôme vert-de-gris, une brume basse entre les toits, des oiseaux qui traversent",
      "yororis-microphone": "Un micro à ruban d'époque dans une pièce calme couleur sable, des rideaux vert sauge qui bougent dans la brise, des particules de lumière",
      "orochia-studio-night": "Un studio de créateur la nuit, vu de derrière une caméra de cinéma, lumière violette et magenta, brume et bokeh d'anneau lumineux",
      "yomizaka-contracts": "Des contrats sur un bureau en noyer à l'heure bleue, un trait de lumière chaude balaie les pages, un café fume, la neige tombe dehors"
    },
    "stills": {
      "grenoble": "Aube sur Grenoble : des cabines orange du téléphérique au-dessus de la ville, les Alpes enneigées derrière, de la brume dans la vallée",
      "assistant": "Un atelier de nuit : un plan holographique orange d'une machine flotte au-dessus d'un établi en acier, un bras de soudure derrière",
      "chefchaouen": "Heure dorée sur les escaliers et ruelles bleus de Chefchaouen, des pots en terre cuite et les montagnes du Rif derrière",
      "old-port": "Le Vieux-Port de Montréal à l'heure bleue : la tour de l'Horloge éclairée, le quai mouillé de reflets, un grand voilier à quai",
      "montreal": "Une nuit de neige dans une rue du Plateau : escalier en colimaçon, lampadaire allumé, flocons dans la lumière",
      "montreal-dawn": "Les toits du Vieux-Montréal à l'aube vus d'en haut, un dôme vert-de-gris, une brume basse et le fleuve derrière"
    },
    "styles": {
      "golden": "Éditorial lumière dorée",
      "miniature": "Diorama miniature tilt-shift",
      "stillLife": "Nature morte artisanale",
      "montreal": "Montréal la nuit"
    },
    "items": {
      "tea-pour": "Un homme en djellaba blanche verse le thé à la menthe de haut dans un verre sous une tente du désert, menthe et amandes sur une table patinée",
      "mini-ironing": "Diorama miniature : deux grand-mères en caftans brodés sur un tapis berbère, l'une repasse une nappe de lin blanc, l'autre sirote un thé",
      "mtl-ruelle": "Une ruelle de Montréal la nuit après la pluie, escaliers en colimaçon et néons reflétés dans les pavés mouillés",
      "still-tea": "Nature morte : théière en cuivre martelé, verres ciselés, figues et dattes sur du lin dans la lumière d'une fenêtre",
      "mini-souk": "Ruelle de souk miniature, pyramides d'épices, lanternes de laiton et un chat endormi sur un seuil bleu",
      "mtl-mont-royal": "Montréal depuis un belvédère du mont Royal à l'automne, érables pourpres et dorés",
      "tea-hands": "Les mains d'une femme âgée ajoutent de la menthe fraîche dans une théière en argent sur un plateau de laiton, les dunes dorées derrière la tente",
      "mini-bagels": "Boulangerie de bagels montréalaise en miniature : des boulangers sortent des bagels au sésame du four à bois",
      "mtl-terrasse": "Une terrasse de café à Montréal au crépuscule sous les guirlandes, façades en pierre grise et balcons en fer forgé",
      "desert-camp": "Une tente berbère au crépuscule, tapis sur le sable, bouilloire en cuivre sur les braises et deux chameaux au repos",
      "mini-picnic": "Pique-nique miniature dans une oliveraie : un grand-père raconte une histoire aux enfants sur un tapis à motifs",
      "mtl-snow": "Une rue résidentielle de Montréal à la première neige, la nuit, escaliers poudrés de neige",
      "tea-glass": "Un verre de thé à la menthe dans le soleil rasant sur une table en bois, dattes et amandes à côté",
      "still-table": "Nature morte : bols en céramique d'olives et de citrons confits, pain et branche d'olivier sur une table en chêne",
      "mini-skating": "Parc d'hiver montréalais en miniature : des figurines patinent sur un étang gelé sous les guirlandes",
      "mtl-jean-talon": "Un marché public couvert à la fin de l'été : cageots de tomates, maïs, bleuets et fleurs des champs",
      "tea-friends": "Trois amis rient sur des coussins sous une tente du désert pendant qu'on sert le thé"
    }
  },
};
