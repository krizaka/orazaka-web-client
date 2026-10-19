/**
 * @file translations.landing.types.ts
 * @description Shape of the public pages copy — the home page (`t.landing`) and the feature pages
 * (`t.features`). No import, so the dictionary type and the copy can both depend on it without a cycle.
 */

/** One titled paragraph (a benefit, a step, a proof). */
export interface LandingItem {
  title: string;
  body: string;
}

/** The scripted conversation of the sovereign chat (ChatShowcase). */
export interface ChatDemoCopy {
  labels: { agent: string; status: string; model: string; routed: string; privacy: string; placeholder: string; send?: string };
  question: string;
  answer: string;
  pipeline: string[];
}

/** One answer of the comparison: a key phrase in bold, then its detail. */
export interface CompareAnswer {
  key: string;
  detail: string;
}

/** Copy of the public home page. */
export interface LandingDictionary {
  nav: {
    how: string;
    studios: string;
    signIn: string;
    getStarted: string;
    docs: string;
    demo: string;
    packs: string;
    mobile: string;
    product: string;
    platforms: string;
    models: string;
    web: string;
    desktop: string;
    selfHost: string;
    /** One short line (≤ 45 characters: the menu shows one line) under each entry of the Product and Platforms menus. */
    menu: Record<"how" | "studios" | "packs" | "models" | "demo" | "web" | "mobile" | "desktop" | "selfHost", string>;
    langLabel: string;
    preferences: string;
    openMenu: string;
    closeMenu: string;
    home: string;
    talk: string;
    repo: string;
  };
  hero: {
    kicker: string;
    titleLead: string;
    titleAccent: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string[];
    demoLabel: string;
  };
  chat: ChatDemoCopy;
  proof: { value: string; label: string }[];
  what: { eyebrow: string; title: string; lead: string; demo: string; packs: string; packsLine: string; packsCta: string };
  runs: {
    eyebrow: string;
    title: string;
    lead: string;
    tabs: Record<"web" | "mobile" | "mac", string>;
    label: string;
    play: string;
    pause: string;
    step: string;
    web: Record<"workspace" | "studio" | "results", { title: string; description: string; alt: string }>;
    mac: { title: string; body: string; alt: string; cta: string };
    mobileMore: string;
    recorded: string;
  };
  trust: { eyebrow: string; title: string; items: (LandingItem & { cta: string })[] };
  compare: {
    eyebrow: string;
    title: string;
    lead: string;
    topic: string;
    cloud: string;
    orazaka: string;
    /** The key phrase is bold, the detail follows; claims must be true of the product today. */
    rows: { id: "where" | "pay" | "decide" | "agents"; topic: string; cloud: CompareAnswer; orazaka: CompareAnswer }[];
  };
  studios: { eyebrow: string; title: string; lead: string; items: LandingItem[]; ctas: string[]; cta: string };
  cta: { eyebrow: string; title: string; lead: string; primary: string; secondary: string };
  demo: { eyebrow: string; title: string; lead: string; frame: string; notice: string; origin: string };
  closed: { title: string; body: string; docs: string; contact: string; home: string; heroPrimary: string; heroSecondary: string; signInBanner: string };
  footer: { devNotice: string; privacy: string; terms: string; contact: string; license: string; by: string; product: string; docs: string; api: string; cli: string; legal: string };
}

/** One feature page (/features/<id>). */
export interface FeaturePageCopy {
  /** Its name in menus and cross-links. */
  name: string;
  kicker: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  points: LandingItem[];
  flowTitle: string;
  flow: LandingItem[];
  demoLabel: string;
  chat: ChatDemoCopy;
}

/** Copy of the three feature pages and what they share. */
export interface FeaturesDictionary {
  eyebrow: string;
  pointsTitle: string;
  others: string;
  ctaTitle: string;
  ctaLead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  pages: Record<"absolute-privacy" | "unified-engine" | "infinite-reach", FeaturePageCopy>;
}
