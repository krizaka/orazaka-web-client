/**
 * @file translations.mobile.ts
 * @description Copy of the Mobile section of the home page and of /mobile — captions of the recordings of the
 * Orazaka iOS and Android app, en and fr. What is said is what the recording shows (recorded on the iOS 27 simulator
 * and the Android 16 emulator against the local stack, signed in as Eric, the demo persona).
 */
type Locale = "en" | "fr";

export interface MobileDictionary {
  eyebrow: string;
  title: string;
  lead: string;
  /** The link from the home page to /mobile. */
  all: string;
  recordedOn: string;
  clipsTitle: string;
  shotsTitle: string;
  platforms: { ios: string; android: string };
  frameLabel: string;
  home: string;
  meta: string;
  metaDescription: string;
  clips: Record<"sign-in" | "studio-run" | "ask" | "jobs", { label: string; caption: string }>;
  /** One caption per screenshot, by file id. */
  shots: Record<string, string>;
}

export const mobile: Record<Locale, MobileDictionary> = {
  en: {
    eyebrow: "On your phone",
    title: "The Orazaka app, recorded on a phone",
    lead: "The iOS and Android client talks to the same edge, services and interceptor pipeline as the web client. Every clip below is the real app against the local stack, signed in as Eric, the demo persona — press play, nothing starts by itself.",
    all: "Every clip and screenshot",
    recordedOn: "Recorded on the iOS 27 simulator (iPhone 17) and the Android 16 emulator (Pixel 8 image), against the local Orazaka stack.",
    clipsTitle: "Recordings",
    shotsTitle: "Screens",
    platforms: { ios: "iOS", android: "Android" },
    frameLabel: "Orazaka mobile app",
    home: "Back to the home page",
    meta: "Orazaka — Mobile",
    metaDescription: "The Orazaka iOS and Android app on video and in screenshots: sign in, Studios, a streamed answer, jobs.",
    clips: {
      "sign-in": { label: "Sign in", caption: "Eric signs in and lands on the Studios (12 s)." },
      "studio-run": { label: "Run a Studio", caption: "Eric runs “Qualification de Prospects” from the phone: the form, the steps running, the results (typing and the model’s wait cut, 28 s)." },
      ask: { label: "Ask", caption: "Eric asks for a note and the answer streams in, from a model on the local stack (24 s)." },
      jobs: { label: "Jobs", caption: "Eric's jobs: per day, by kind, then each one (6 s)." },
    },
    shots: {
      "01-sign-in": "Sign in.",
      "02-studios": "The Studio catalogue.",
      "03-studio-detail": "A Studio's page: price per run, install.",
      "09-chat-answer": "A streamed answer, on the local stack.",
      "05-jobs": "Jobs, per day and by kind.",
      "06-connectors": "Connectors: the account's connector credentials.",
      "07-system": "System — fixed values written in the app, not a measure of the stack.",
      "08-profile": "Profile: name, e-mail, roles.",
      "android-studios": "The Studios on Android.",
      "android-jobs": "Jobs on Android.",
    },
  },
  fr: {
    eyebrow: "Sur votre téléphone",
    title: "L'app Orazaka, enregistrée sur un téléphone",
    lead: "Le client iOS et Android parle au même edge, aux mêmes services et à la même chaîne d'intercepteurs que le client web. Chaque clip ci-dessous est la vraie app face à la pile locale, connectée en tant qu'Eric, la persona de démo — appuyez sur lecture, rien ne démarre seul.",
    all: "Tous les clips et captures",
    recordedOn: "Enregistré sur le simulateur iOS 27 (iPhone 17) et l'émulateur Android 16 (image Pixel 8), face à la pile Orazaka locale.",
    clipsTitle: "Enregistrements",
    shotsTitle: "Écrans",
    platforms: { ios: "iOS", android: "Android" },
    frameLabel: "App mobile Orazaka",
    home: "Retour à l'accueil",
    meta: "Orazaka — Mobile",
    metaDescription: "L'app Orazaka iOS et Android en vidéo et en captures : connexion, Studios, une réponse en flux, les jobs.",
    clips: {
      "sign-in": { label: "Connexion", caption: "Eric se connecte et arrive sur les Studios (12 s)." },
      "studio-run": { label: "Lancer un Studio", caption: "Eric lance « Qualification de Prospects » depuis le téléphone : le formulaire, les étapes en cours, les résultats (saisie et attente du modèle coupées, 28 s)." },
      ask: { label: "Demander", caption: "Eric demande une note et la réponse arrive en flux, d'un modèle de la pile locale (24 s)." },
      jobs: { label: "Jobs", caption: "Les jobs d'Eric : par jour, par type, puis chacun (6 s)." },
    },
    shots: {
      "01-sign-in": "Connexion.",
      "02-studios": "Le catalogue de Studios.",
      "03-studio-detail": "La page d'un Studio : prix par exécution, installation.",
      "09-chat-answer": "Une réponse en flux, sur la pile locale.",
      "05-jobs": "Les jobs, par jour et par type.",
      "06-connectors": "Connecteurs : les identifiants de connecteurs du compte.",
      "07-system": "Système — des valeurs fixes écrites dans l'app, pas une mesure de la pile.",
      "08-profile": "Profil : nom, e-mail, rôles.",
      "android-studios": "Les Studios sur Android.",
      "android-jobs": "Les jobs sur Android.",
    },
  },
};
