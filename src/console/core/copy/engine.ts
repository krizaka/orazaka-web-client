/**
 * @file engine.ts
 * @description The words of the Engine screen, in English and French (one object of the same shape per language).
 */

const en = {
  title: "Engine",
  lead: "The engine's runtime settings. A change takes effect on the next read, with no restart.",
  nav: "Engine",
  error: "The settings could not be read: the studio service may be starting.",
  retry: "Retry",
  loading: "Reading the settings",
  groups: { run: "Runs, fan-out, cache and events", webhook: "Webhooks", retention: "Retention", marketplace: "Marketplace", other: "Other" },
  current: "Current value",
  defaultValue: "Default",
  bounds: "Bounds",
  min: "min {n}",
  max: "max {n}",
  maxItems: "up to {n} items",
  listHint: "One item per line.",
  save: "Save",
  saving: "Saving",
  saved: "Saved — applies on the next read.",
  reset: "Use the default",
  history: "History",
  hideHistory: "Hide history",
  historyEmpty: "No change recorded yet.",
  historyError: "The history could not be read.",
  at: "When",
  actor: "Actor",
  before: "Before",
  after: "After",
  empty: "—",
  on: "On",
  off: "Off",
  invalid: { type: "Enter a whole number.", range: "Must be between {min} and {max}.", min: "Must be at least {n}.", max: "Must be at most {n}.", items: "At most {n} items.", empty: "An item is empty.", duplicate: "An item appears twice." },
  failed: "The change was refused.",
} as const;

export type EngineWords = { -readonly [K in keyof typeof en]: (typeof en)[K] extends string ? string : { -readonly [P in keyof (typeof en)[K]]: string } };

const fr: EngineWords = {
  title: "Moteur",
  lead: "Les réglages d'exécution du moteur. Un changement prend effet à la lecture suivante, sans redémarrage.",
  nav: "Moteur",
  error: "Les réglages n'ont pas pu être lus : le service des studios démarre peut-être.",
  retry: "Réessayer",
  loading: "Lecture des réglages",
  groups: { run: "Exécutions, répartition, cache et événements", webhook: "Webhooks", retention: "Rétention", marketplace: "Marketplace", other: "Autres" },
  current: "Valeur actuelle",
  defaultValue: "Défaut",
  bounds: "Bornes",
  min: "min {n}",
  max: "max {n}",
  maxItems: "{n} éléments au plus",
  listHint: "Un élément par ligne.",
  save: "Enregistrer",
  saving: "Enregistrement",
  saved: "Enregistré — pris en compte à la lecture suivante.",
  reset: "Valeur par défaut",
  history: "Historique",
  hideHistory: "Masquer l'historique",
  historyEmpty: "Aucun changement enregistré.",
  historyError: "L'historique n'a pas pu être lu.",
  at: "Quand",
  actor: "Auteur",
  before: "Avant",
  after: "Après",
  empty: "—",
  on: "Activé",
  off: "Désactivé",
  invalid: { type: "Saisissez un nombre entier.", range: "Doit être compris entre {min} et {max}.", min: "Doit valoir au moins {n}.", max: "Doit valoir au plus {n}.", items: "{n} éléments au plus.", empty: "Un élément est vide.", duplicate: "Un élément apparaît deux fois." },
  failed: "Le changement a été refusé.",
};

export type EngineLocale = "en" | "fr";
export const engineCopy: Record<EngineLocale, EngineWords> = { en, fr };

/** The words of a language, with `{n}`-style placeholders filled in. */
export const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
