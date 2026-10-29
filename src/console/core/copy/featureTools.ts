/**
 * @file featureTools.ts
 * @description The words of the « Tool rounds per feature » screen, in English and French.
 */
import { localise, w, type Localised } from "@/core/context/words";

const WORDS = {
  title: w("Tool rounds per feature", "Tours d'outils par fonction"),
  lead: w(
    "How many times the model may call a tool in one turn, per feature. The default row applies to every feature without its own. A change takes effect on the next turn.",
    "Combien de fois le modèle peut appeler un outil dans un tour, par fonction. La ligne par défaut vaut pour toute fonction sans ligne propre. Un changement prend effet au tour suivant.",
  ),
  back: w("Engine settings", "Réglages du moteur"),
  link: w("Tool rounds per feature", "Tours d'outils par fonction"),
  error: w(
    "The bounds could not be read: the conversation service may be starting.",
    "Les bornes n'ont pas pu être lues : le service de conversation démarre peut-être.",
  ),
  retry: w("Retry", "Réessayer"),
  loading: w("Reading the bounds", "Lecture des bornes"),
  boundsTitle: w("Bounds", "Bornes"),
  defaultRow: w("Default for every feature", "Défaut de toutes les fonctions"),
  rounds: w("Rounds", "Tours"),
  range: w("{min} to {max} rounds", "de {min} à {max} tours"),
  save: w("Save", "Enregistrer"),
  saving: w("Saving", "Enregistrement"),
  saved: w("Saved — applies on the next turn.", "Enregistré — pris en compte au tour suivant."),
  remove: w("Use the default", "Revenir au défaut"),
  addTitle: w("Bound a feature", "Borner une fonction"),
  featureKey: w("Feature key", "Clé de la fonction"),
  featureKeyHint: w("For example agent.code.issue-to-pr", "Par exemple agent.code.issue-to-pr"),
  add: w("Add the bound", "Ajouter la borne"),
  invalidRange: w("Enter a whole number from {min} to {max}.", "Saisissez un nombre entier de {min} à {max}."),
  invalidKey: w("Enter the feature key.", "Saisissez la clé de la fonction."),
  failed: w("The change was refused.", "Le changement a été refusé."),
  routesTitle: w("Feature routes", "Routes des fonctions"),
  routesLead: w(
    "The models each feature routes to, best first. Read only.",
    "Les modèles vers lesquels chaque fonction est routée, du meilleur au suivant. Lecture seule.",
  ),
  routesEmpty: w(
    "No feature has a route of its own: each follows its category default.",
    "Aucune fonction n'a de route propre : chacune suit le défaut de sa catégorie.",
  ),
  routesError: w("The routes could not be read.", "Les routes n'ont pas pu être lues."),
} as const;

export type FeatureToolsWords = Localised<typeof WORDS>;
export type FeatureToolsLocale = "en" | "fr";
export const featureToolsCopy: Record<FeatureToolsLocale, FeatureToolsWords> = {
  en: localise(WORDS, 0),
  fr: localise(WORDS, 1),
};
