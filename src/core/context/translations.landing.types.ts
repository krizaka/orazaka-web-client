/**
 * @file translations.landing.types.ts
 * @description Shape of the public pages copy — the home page (`t.landing`). No import, so the dictionary type and the copy can both depend on it without a cycle.
 */

/** One titled paragraph (a benefit, a step, a proof). */
export interface LandingItem {
  title: string;
  body: string;
}

/** The words around a phone clip (`PhoneSection`), shared by the home and the Download page. */
export interface PhoneWords {
  eyebrow: string;
  title: string;
  lead: string;
}

/** Copy of the public home page. */
export interface LandingDictionary {
  nav: {
    how: string;
    signIn: string;
    docs: string;
    product: string;
    download: string;
    /** One short line (≤ 45 characters: the menu shows one line) under each entry of the Product menu. */
    menu: Record<"how" | "download", string>;
    langLabel: string;
    themeLabel: string;
    preferences: string;
    openMenu: string;
    closeMenu: string;
    home: string;
    talk: string;
    repo: string;
  };
  /** The first screen: one statement, one line, the real product beside it. */
  hero: { title: string; lead: string; secondary: string; visualLabel: string };
  /** The figures under the hero, counted from the published measured runs. */
  figures: { runs: string; models: string; telemetry: string };
  features: { eyebrow: string; title: string; lead: string; items: Record<"studios" | "records" | "home", { title: string; text: string }> };
  records: { eyebrow: string; title: string; lead: string; more: string; measuredOn: string; runLabel: string; prompt: string; alt: string; where: string; onMac: string; onHosted: string; noCost: string; imageCost: string; time: string; timeValue: string; cost: string };
  phone: PhoneWords;
  cta: { title: string; body: string; primary: string };
  closed: { title: string; body: string; docs: string; contact: string; home: string; heroPrimary: string; signInBanner: string };
  footer: { devNotice: string; privacy: string; terms: string; contact: string; license: string; by: string; product: string; docs: string; api: string; cli: string; legal: string };
}
