/**
 * @file translations.landing.types.ts
 * @description Shape of the public home page copy (`t.landing`) — no import, so the dictionary
 * type and the copy can both depend on it without a cycle.
 */

/** One titled paragraph (a benefit, a step, a proof). */
export interface LandingItem {
  title: string;
  body: string;
}

/** Copy of the public home page. */
export interface LandingDictionary {
  nav: { benefits: string; how: string; studios: string; signIn: string; getStarted: string; langLabel: string };
  hero: {
    kicker: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string[];
    demoLabel: string;
  };
  chat: {
    labels: { agent: string; status: string; model: string; routed: string; privacy: string; placeholder: string };
    question: string;
    answer: string;
    pipeline: string[];
  };
  proof: { value: string; label: string }[];
  benefits: { eyebrow: string; title: string; lead: string; items: LandingItem[]; more: string };
  how: { eyebrow: string; title: string; steps: (LandingItem & { command: string })[] };
  studios: { eyebrow: string; title: string; lead: string; items: LandingItem[] };
  cta: { title: string; lead: string; primary: string; secondary: string };
  footer: { privacy: string; terms: string; contact: string; license: string; by: string };
}
