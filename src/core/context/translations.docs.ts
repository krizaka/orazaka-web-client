/**
 * @file translations.docs.ts
 * @description The words around the documentation (hub, sidebar, article chrome, the text version of the schemas), en and
 * fr. The pages' own text is the source docs of the Orazaka repository (English): it is synced, never translated here.
 */
type Locale = "en" | "fr";

export interface DocsJourneyCopy {
  title: string;
  blurb: string;
  /** What the card's first link says. */
  start: string;
}

export interface DocsDiagramLabels {
  sequence: string;
  pipeline: string;
  states: string;
  architecture: string;
  coreChain: string;
  configuredChain: string;
  participants: string;
  reply: string;
  step: string;
  usedBy: string;
  uses: string;
  calls: string;
  calledBy: string;
  none: string;
  notBuilt: string;
  initial: string;
  final: string;
  terminal: string;
  repository: string;
  role: string;
  owner: string;
  moduleMap: string;
}

export interface DocsDictionary {
  meta: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchHint: string;
  journeysTitle: string;
  journeys: Record<"start" | "use" | "run" | "build" | "mobile", DocsJourneyCopy>;
  groups: { integrate: string; internals: string };
  quickstartTitle: string;
  popularTitle: string;
  modelsTitle: string;
  modelsLine: string;
  updateLink: string;
  promiseLabel: string;
  promise: string;
  home: string;
  sidebarLabel: string;
  breadcrumbLabel: string;
  onThisPage: string;
  previous: string;
  next: string;
  editOnGitHub: string;
  viewSource: string;
  generated: string;
  englishOnly: string;
  audience: Record<string, string>;
  copy: string;
  copied: string;
  diagrams: DocsDiagramLabels;
}

export const docs: Record<Locale, DocsDictionary> = {
  en: {
    meta: "Documentation — Orazaka",
    metaDescription: "Orazaka's documentation by what you want to do: get started, use it, run it, build on it, and the mobile app. Generated from the code.",
    eyebrow: "Documentation",
    title: "Find your way: start, use, run, build.",
    lead: "Orazaka's documentation follows what you came to do. The reference pages are generated from the code of the Orazaka repositories, so they cannot drift from what runs.",
    searchLabel: "Search the documentation",
    searchPlaceholder: "Search: install, packs, API, backup…",
    searchEmpty: "Nothing matches. Try a shorter word, or pick a journey below.",
    searchHint: "Pages and their headings",
    journeysTitle: "Where do you want to go?",
    journeys: {
      start: { title: "Get started", blurb: "What Orazaka is, and a running install on a Mac, a server or from source.", start: "Start here" },
      use: { title: "Use it", blurb: "Work with what is installed: Studios and packs, jobs and schedules, the models it runs.", start: "Open Packs & Studios" },
      run: { title: "Run it", blurb: "Operate it: administration, sign-in, security, updates and backups, licensing.", start: "Open Administration" },
      build: { title: "Build on it", blurb: "Integrate and extend: the API, the CLI, tools and MCP, workers — then the architecture under it.", start: "Open the API reference" },
      mobile: { title: "Mobile", blurb: "The iOS and Android app, in four steps and screen by screen.", start: "Follow the four steps" },
    },
    groups: { integrate: "Integrate", internals: "Under the hood" },
    quickstartTitle: "From zero to a running stack",
    popularTitle: "Most read",
    modelsTitle: "Supported models",
    modelsLine: "Every model Orazaka supports: what it does, where it runs, its licence and context window.",
    updateLink: "Update & back up",
    promiseLabel: "Our promise",
    promise: "Every reference page is generated from the code. If a page is wrong, the code is, or the generator is — and we fix it at the source, never in the page.",
    home: "Docs",
    sidebarLabel: "Pages of the documentation",
    breadcrumbLabel: "Breadcrumb",
    onThisPage: "On this page",
    previous: "Previous",
    next: "Next",
    editOnGitHub: "Edit this page on GitHub",
    viewSource: "View the source on GitHub",
    generated: "Generated from the code",
    englishOnly: "Page text is in English, as in the Orazaka repositories.",
    audience: { everyone: "For everyone", operator: "For operators", developer: "For developers", "decision-maker": "For decision-makers" },
    copy: "Copy",
    copied: "Copied",
    diagrams: {
      sequence: "Sequence — text version",
      pipeline: "Interceptor pipeline — text version",
      states: "States — text version",
      architecture: "Architecture",
      coreChain: "Core chain: always, in the order of the code",
      configuredChain: "Configured chain: in the database order",
      participants: "Participants",
      reply: "replies to",
      step: "Step",
      usedBy: "Used by",
      uses: "Uses",
      calls: "Calls",
      calledBy: "Called by",
      none: "None",
      notBuilt: "not built yet",
      initial: "start",
      final: "end",
      terminal: "Terminal",
      repository: "Repository",
      role: "Role",
      owner: "Owner",
      moduleMap: "The module map is listed in the tables of this page.",
    },
  },
  fr: {
    meta: "Documentation — Orazaka",
    metaDescription: "La documentation d'Orazaka selon ce que vous voulez faire : démarrer, l'utiliser, l'exploiter, construire dessus, et l'app mobile. Générée depuis le code.",
    eyebrow: "Documentation",
    title: "Trouvez votre chemin : démarrer, utiliser, exploiter, construire.",
    lead: "La documentation d'Orazaka suit ce que vous venez faire. Les pages de référence sont générées depuis le code des dépôts Orazaka : elles ne peuvent pas s'éloigner de ce qui tourne.",
    searchLabel: "Rechercher dans la documentation",
    searchPlaceholder: "Rechercher : installer, packs, API, sauvegarde…",
    searchEmpty: "Aucun résultat. Essayez un mot plus court, ou choisissez un parcours ci-dessous.",
    searchHint: "Pages et leurs titres",
    journeysTitle: "Où voulez-vous aller ?",
    journeys: {
      start: { title: "Démarrer", blurb: "Ce qu'est Orazaka, et une installation qui tourne sur un Mac, un serveur ou depuis les sources.", start: "Commencer ici" },
      use: { title: "L'utiliser", blurb: "Travailler avec ce qui est installé : Studios et packs, tâches et planifications, les modèles.", start: "Ouvrir Packs et Studios" },
      run: { title: "L'exploiter", blurb: "Le faire tourner : administration, connexion, sécurité, mises à jour et sauvegardes, licence.", start: "Ouvrir l'administration" },
      build: { title: "Construire dessus", blurb: "Intégrer et étendre : l'API, la CLI, les outils et MCP, les workers — puis l'architecture dessous.", start: "Ouvrir la référence API" },
      mobile: { title: "Mobile", blurb: "L'app iOS et Android, en quatre étapes et écran par écran.", start: "Suivre les quatre étapes" },
    },
    groups: { integrate: "Intégrer", internals: "Sous le capot" },
    quickstartTitle: "De zéro à une pile qui tourne",
    popularTitle: "Les plus lues",
    modelsTitle: "Modèles pris en charge",
    modelsLine: "Chaque modèle qu'Orazaka prend en charge : ce qu'il fait, où il tourne, sa licence et sa fenêtre de contexte.",
    updateLink: "Mettre à jour et sauvegarder",
    promiseLabel: "Notre promesse",
    promise: "Chaque page de référence est générée depuis le code. Si une page est fausse, le code l'est, ou le générateur — et on corrige à la source, jamais dans la page.",
    home: "Docs",
    sidebarLabel: "Pages de la documentation",
    breadcrumbLabel: "Fil d'Ariane",
    onThisPage: "Sur cette page",
    previous: "Précédent",
    next: "Suivant",
    editOnGitHub: "Modifier cette page sur GitHub",
    viewSource: "Voir la source sur GitHub",
    generated: "Générée depuis le code",
    englishOnly: "Texte des pages en anglais, comme dans les dépôts Orazaka.",
    audience: { everyone: "Pour tous", operator: "Pour les exploitants", developer: "Pour les développeurs", "decision-maker": "Pour les décideurs" },
    copy: "Copier",
    copied: "Copié",
    diagrams: {
      sequence: "Séquence — version texte",
      pipeline: "Pipeline d'intercepteurs — version texte",
      states: "États — version texte",
      architecture: "Architecture",
      coreChain: "Chaîne du cœur : toujours, dans l'ordre du code",
      configuredChain: "Chaîne configurée : dans l'ordre de la base",
      participants: "Participants",
      reply: "répond à",
      step: "Étape",
      usedBy: "Utilisé par",
      uses: "Utilise",
      calls: "Appelle",
      calledBy: "Appelé par",
      none: "Aucun",
      notBuilt: "pas encore construit",
      initial: "début",
      final: "fin",
      terminal: "Terminal",
      repository: "Dépôt",
      role: "Rôle",
      owner: "Propriétaire",
      moduleMap: "La carte des modules est listée dans les tableaux de cette page.",
    },
  },
};
