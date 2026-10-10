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
  labels: { agent: string; status: string; model: string; routed: string; privacy: string; placeholder: string };
  question: string;
  answer: string;
  pipeline: string[];
}

/** Copy of the public home page. */
export interface LandingDictionary {
  nav: {
    sovereignty: string;
    platform: string;
    how: string;
    studios: string;
    signIn: string;
    getStarted: string;
    langLabel: string;
    openMenu: string;
    closeMenu: string;
    home: string;
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
  sovereignty: { eyebrow: string; title: string; lead: string; pillars: LandingItem[]; more: string };
  platform: { eyebrow: string; title: string; lead: string; items: LandingItem[]; captureAlt: string };
  compare: {
    eyebrow: string;
    title: string;
    lead: string;
    topic: string;
    cloud: string;
    orazaka: string;
    rows: { topic: string; cloud: string; orazaka: string }[];
  };
  how: { eyebrow: string; title: string; lead: string; terminal: string; steps: (LandingItem & { command: string })[] };
  studios: { eyebrow: string; title: string; lead: string; items: LandingItem[]; cta: string };
  cta: { eyebrow: string; title: string; lead: string; primary: string; secondary: string };
  footer: { privacy: string; terms: string; contact: string; license: string; by: string; product: string; legal: string; tagline: string };
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
