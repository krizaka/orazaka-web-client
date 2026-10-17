/**
 * @file translations.changelog.ts
 * @description The words of /changelog, en and fr. The releases themselves are never written here: they are read from
 * the GitHub Releases of krizaka/orazaka (features/landing/utils/changelog.ts).
 */
export interface ChangelogDictionary {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  /** `{version}` is the version this site runs. */
  runs: string;
  feed: string;
  logLabel: string;
  empty: string;
  emptyLink: string;
  back: string;
  /** `{number}` is the pull request's number. */
  pull: string;
  kinds: Record<"added" | "changed" | "fixed" | "removed" | "security" | "breaking", string>;
  tags: Record<"feature" | "fix" | "security" | "breaking" | "change", string>;
  feedTitle: string;
  feedDescription: string;
  /** The footer's link: `{version}`. */
  footerVersion: string;
  langTag: string;
}

export const changelog: Record<"en" | "fr", ChangelogDictionary> = {
  en: {
    meta: { title: "Changelog", description: "What changed in Orazaka, release by release: new, fixed, security and breaking, with the pull request behind each line." },
    eyebrow: "Changelog",
    title: "What shipped",
    lead: "The highlights of every Orazaka release, newest first — read from the releases themselves.",
    runs: "This site runs v{version}.",
    feed: "Subscribe (RSS)",
    logLabel: "Releases",
    empty: "The releases could not be read right now.",
    emptyLink: "All releases on GitHub",
    back: "Orazaka",
    pull: "Pull request #{number}",
    kinds: { added: "New", changed: "Changed", fixed: "Fixed", removed: "Removed", security: "Security", breaking: "Breaking" },
    tags: { feature: "New", fix: "Fixed", security: "Security", breaking: "Breaking", change: "Changed" },
    feedTitle: "Orazaka — changelog",
    feedDescription: "What shipped in Orazaka, release by release.",
    footerVersion: "v{version}",
    langTag: "en",
  },
  fr: {
    meta: { title: "Journal des changements", description: "Ce qui a changé dans Orazaka, version par version : nouveautés, corrections, sécurité et ruptures, avec la pull request derrière chaque ligne." },
    eyebrow: "Journal des changements",
    title: "Ce qui a été livré",
    lead: "L'essentiel de chaque version d'Orazaka, la plus récente d'abord — lu dans les versions elles-mêmes.",
    runs: "Ce site tourne en v{version}.",
    feed: "S'abonner (RSS)",
    logLabel: "Versions",
    empty: "Les versions n'ont pas pu être lues pour l'instant.",
    emptyLink: "Toutes les versions sur GitHub",
    back: "Orazaka",
    pull: "Pull request n° {number}",
    kinds: { added: "Nouveau", changed: "Modifié", fixed: "Corrigé", removed: "Retiré", security: "Sécurité", breaking: "Rupture" },
    tags: { feature: "Nouveau", fix: "Corrigé", security: "Sécurité", breaking: "Rupture", change: "Modifié" },
    feedTitle: "Orazaka — journal des changements",
    feedDescription: "Ce qu'Orazaka a livré, version par version.",
    footerVersion: "v{version}",
    langTag: "fr-CA",
  },
};
