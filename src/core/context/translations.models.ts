/**
 * @file translations.models.ts
 * @description The words of /models and of the home page's Models section (en, fr). The models themselves — names,
 * vendors, licences, context windows, where they run — are data (`models.generated.json`, from Orazaka's registry);
 * only the chrome around them is written here.
 */

import type { Locale } from "./translations.types";
import type { ModelsDictionary } from "./translations.models.types";

export const models: Record<Locale, ModelsDictionary> = {
  en: {
    nav: "Models",
    meta: {
      title: "Models — Orazaka",
      description: "Every model Orazaka supports: what it does, where it runs, its licence and context window — read from the registry the routing uses.",
    },
    hero: {
      eyebrow: "Models",
      title: "The models Orazaka runs.",
      lead: "Local first: the models marked Local run on your own hardware. Each line below is read from the registry Orazaka's routing uses, with the licence of the model's own card.",
    },
    sovereign: {
      title: "Local first, provider optional",
      local: "Models marked Local run on machines you control — Ollama, LocalAI, stable-diffusion.cpp on Metal or CUDA, the media worker. Your prompts and files stay there.",
      provider: "A provider-hosted model is optional and opt-in: it needs a provider and its API key, which an operator adds. A fresh install has none, and nothing leaves your machines until then.",
    },
    filters: { label: "Filters", capability: "What it does", where: "Runs where", all: "All" },
    capabilities: {
      chat: "Chat",
      reasoning: "Reasoning",
      vision: "Vision",
      code: "Code",
      embeddings: "Embeddings",
      image: "Image",
      video: "Video",
      "speech-to-text": "Speech to text",
      "text-to-speech": "Text to speech",
    },
    where: { local: "Local", provider: "Optional · provider", localLong: "On your hardware", providerLong: "Optional provider" },
    status: { default: "Default", available: "Available", planned: "Planned" },
    columns: { model: "Model", vendor: "Vendor", does: "Does", runs: "Runs", licence: "Licence", context: "Context", status: "Status", verified: "Last verified" },
    licence: { open: "Open weights", proprietary: "Proprietary", commercial: "commercial use", conditions: "commercial use under conditions", nonCommercial: "Non-commercial" },
    context: { tokens: "{count} tokens", none: "—" },
    verified: { never: "Not verified yet" },
    count: "{count} models",
    countOne: "1 model",
    empty: "No model matches these filters.",
    table: { caption: "Models Orazaka supports", filters: "Filter the models", clear: "Clear filters", sortBy: "Sort by {column}" },
    docs: {
      title: "Go deeper",
      lead: "The catalogue is generated from the code; the routing is data an administrator edits.",
      catalogue: "The model catalogue",
      catalogueLead: "Every row of the registry, the unfiltered models explained, the rows kept out of this list.",
      routing: "How Orazaka is built",
      routingLead: "The module map and the path of a request, drawn from the code.",
      cta: "Read the docs",
    },
    home: {
      eyebrow: "Models",
      title: "Your hardware, your models.",
      lead: "Six of the models Orazaka runs on your own machines, with their licences. The list is read from the registry, never typed.",
      more: "All models",
      providers: "Plus {count} optional models served by a provider — opt-in, never required.",
      cta: "See it in the catalogue",
    },
  },
  fr: {
    nav: "Modèles",
    meta: {
      title: "Modèles — Orazaka",
      description: "Tous les modèles qu'Orazaka prend en charge : ce qu'ils font, où ils tournent, leur licence et leur fenêtre de contexte — lus dans le registre que le routage utilise.",
    },
    hero: {
      eyebrow: "Modèles",
      title: "Les modèles qu'Orazaka fait tourner.",
      lead: "Local d'abord : les modèles marqués Local tournent sur votre propre matériel. Chaque ligne est lue dans le registre qu'utilise le routage d'Orazaka, avec la licence de la fiche du modèle.",
    },
    sovereign: {
      title: "Local d'abord, fournisseur en option",
      local: "Les modèles marqués Local tournent sur des machines que vous contrôlez — Ollama, LocalAI, stable-diffusion.cpp sur Metal ou CUDA, le worker média. Vos requêtes et vos fichiers y restent.",
      provider: "Un modèle hébergé par un fournisseur est optionnel et sur activation : il faut un fournisseur et sa clé d'API, qu'un opérateur ajoute. Une installation neuve n'en a aucun, et rien ne quitte vos machines d'ici là.",
    },
    filters: { label: "Filtres", capability: "Ce qu'il fait", where: "Où il tourne", all: "Tous" },
    capabilities: {
      chat: "Conversation",
      reasoning: "Raisonnement",
      vision: "Vision",
      code: "Code",
      embeddings: "Embeddings",
      image: "Image",
      video: "Vidéo",
      "speech-to-text": "Parole vers texte",
      "text-to-speech": "Texte vers parole",
    },
    where: { local: "Local", provider: "Option · fournisseur", localLong: "Sur votre matériel", providerLong: "Fournisseur optionnel" },
    status: { default: "Par défaut", available: "Disponible", planned: "Prévu" },
    columns: { model: "Modèle", vendor: "Éditeur", does: "Fait", runs: "Tourne", licence: "Licence", context: "Contexte", status: "Statut", verified: "Dernière vérification" },
    licence: { open: "Poids ouverts", proprietary: "Propriétaire", commercial: "usage commercial", conditions: "usage commercial sous conditions", nonCommercial: "Non commercial" },
    context: { tokens: "{count} jetons", none: "—" },
    verified: { never: "Pas encore vérifié" },
    count: "{count} modèles",
    countOne: "1 modèle",
    empty: "Aucun modèle ne correspond à ces filtres.",
    table: { caption: "Modèles pris en charge par Orazaka", filters: "Filtrer les modèles", clear: "Effacer les filtres", sortBy: "Trier par {column}" },
    docs: {
      title: "Aller plus loin",
      lead: "Le catalogue est généré depuis le code ; le routage est une donnée qu'un administrateur édite.",
      catalogue: "Le catalogue des modèles",
      catalogueLead: "Chaque ligne du registre, les modèles non filtrés expliqués, les lignes laissées hors de cette liste.",
      routing: "Comment Orazaka est construit",
      routingLead: "La carte des modules et le parcours d'une requête, dessinés depuis le code.",
      cta: "Lire la documentation",
    },
    home: {
      eyebrow: "Modèles",
      title: "Votre matériel, vos modèles.",
      lead: "Six des modèles qu'Orazaka fait tourner sur vos propres machines, avec leurs licences. La liste est lue dans le registre, jamais saisie.",
      more: "Tous les modèles",
      providers: "Et {count} modèles optionnels servis par un fournisseur — sur activation, jamais obligatoires.",
      cta: "Voir dans le catalogue",
    },
  },
};
