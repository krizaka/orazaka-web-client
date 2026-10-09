/**
 * @file translations.landing.ts
 * @description Copy of the public home page (visitors without a session). Kept beside
 * `translations.ts` so the sales copy can be reviewed in one place; merged into the dictionary under
 * `landing`.
 */

import type { Locale } from "./translations.types";
import type { LandingDictionary } from "./translations.landing.types";

export const landing: Record<Locale, LandingDictionary> = {
  en: {
    nav: {
      benefits: "Why Orazaka",
      how: "How it works",
      studios: "Studios",
      signIn: "Sign in",
      getStarted: "Get started",
      langLabel: "Language",
    },
    hero: {
      kicker: "Sovereign AI platform",
      title: "The AI that never leaves home.",
      lead:
        "Chat, documents, images, video and agents — on your own machines. Orazaka gives your team a modern AI workspace while prompts, files and customer data stay inside your walls.",
      primaryCta: "Create your workspace",
      secondaryCta: "Sign in",
      trust: ["Runs on your hardware", "No telemetry", "Open source · Apache-2.0"],
      demoLabel: "Answered on this machine",
    },
    chat: {
      labels: {
        agent: "Orazaka",
        status: "Online · local",
        model: "llama3.2 · Ollama",
        routed: "Routed locally",
        privacy: "0 bytes left your network",
        placeholder: "Ask your private AI…",
      },
      question: "Summarise our client contract and flag the renewal date.",
      answer:
        "Renewal on March 1st, 60-day notice required. Price is indexed at 3% a year and the data stays in Canada (clause 12). Read on your server — the contract never left it.",
      pipeline: ["Context", "Security", "Credits", "Validation"],
    },
    proof: [
      { value: "100%", label: "local inference by default — Ollama on Apple Silicon or Linux" },
      { value: "6", label: "AI capabilities in one runtime: text, vision, image, video, speech, agents" },
      { value: "1", label: "governed pipeline every request crosses before a model sees it" },
      { value: "0", label: "telemetry: nothing phones home, everything is auditable" },
    ],
    benefits: {
      eyebrow: "Why Orazaka",
      title: "Enterprise AI, without handing your data to anyone.",
      lead: "Everything a team expects from a cloud assistant — the speed, the polish, the integrations — with the control of software you run yourself.",
      items: [
        {
          title: "Absolute privacy",
          body: "Models run where your data lives. No third-party API sees a prompt, a file or a customer record unless you decide it should.",
        },
        {
          title: "One engine for every modality",
          body: "Conversation, document analysis, images, video and speech share one runtime, one identity and one bill — no patchwork of tools.",
        },
        {
          title: "Connected to your stack",
          body: "MCP tools, your knowledge base and your business apps plug into the same governed pipeline, with credits and approvals built in.",
        },
      ],
      more: "Learn more",
    },
    how: {
      eyebrow: "How it works",
      title: "From install to first answer in three commands.",
      steps: [
        { title: "Install", body: "The CLI checks your machine and prepares the local runtime.", command: "npx orazaka install" },
        { title: "Start", body: "Database, queue and services come up on your hardware.", command: "orazaka start && orazaka dev" },
        { title: "Ask", body: "Open the workspace: answers stream from your own models.", command: "open http://localhost:3000" },
      ],
    },
    studios: {
      eyebrow: "Studios",
      title: "Ready-made AI workflows your team runs in one click.",
      lead: "Studios turn a business process into a guided run with a clear price before you start. Install one, fill a form, get the result.",
      items: [
        { title: "Document validation", body: "Check contracts and forms against your rules, clause by clause." },
        { title: "Media production", body: "Generate visuals and short videos for your brand, locally." },
        { title: "Prospecting", body: "Research accounts and draft outreach from your own data." },
        { title: "Trades showcase", body: "Turn job-site photos into a portfolio that sells." },
      ],
    },
    cta: {
      title: "Bring AI in-house — not your data out.",
      lead: "Create a workspace in a minute. Your first answers stream from the models on this machine.",
      primary: "Create your workspace",
      secondary: "I already have an account",
    },
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
      license: "Open source · Apache-2.0",
      by: "A Krizaka product",
    },
  },
  fr: {
    nav: {
      benefits: "Pourquoi Orazaka",
      how: "Fonctionnement",
      studios: "Studios",
      signIn: "Se connecter",
      getStarted: "Commencer",
      langLabel: "Langue",
    },
    hero: {
      kicker: "Plateforme d'IA souveraine",
      title: "L'IA qui ne quitte jamais la maison.",
      lead:
        "Conversation, documents, images, vidéo et agents — sur vos propres machines. Orazaka offre à votre équipe un espace d'IA moderne pendant que prompts, fichiers et données clients restent chez vous.",
      primaryCta: "Créer mon espace",
      secondaryCta: "Se connecter",
      trust: ["Tourne sur votre matériel", "Aucune télémétrie", "Open source · Apache-2.0"],
      demoLabel: "Répondu sur cette machine",
    },
    chat: {
      labels: {
        agent: "Orazaka",
        status: "En ligne · local",
        model: "llama3.2 · Ollama",
        routed: "Routé localement",
        privacy: "0 octet n'a quitté votre réseau",
        placeholder: "Demandez à votre IA privée…",
      },
      question: "Résume notre contrat client et signale la date de renouvellement.",
      answer:
        "Renouvellement le 1er mars, préavis de 60 jours. Prix indexé de 3 % par an et données hébergées au Canada (clause 12). Lu sur votre serveur — le contrat ne l'a jamais quitté.",
      pipeline: ["Contexte", "Sécurité", "Crédits", "Validation"],
    },
    proof: [
      { value: "100 %", label: "d'inférence locale par défaut — Ollama sur Apple Silicon ou Linux" },
      { value: "6", label: "capacités d'IA dans un seul moteur : texte, vision, image, vidéo, voix, agents" },
      { value: "1", label: "pipeline gouverné que chaque requête traverse avant d'atteindre un modèle" },
      { value: "0", label: "télémétrie : rien ne sort, tout est auditable" },
    ],
    benefits: {
      eyebrow: "Pourquoi Orazaka",
      title: "L'IA d'entreprise, sans confier vos données à personne.",
      lead: "Tout ce qu'une équipe attend d'un assistant cloud — la vitesse, la finition, les intégrations — avec la maîtrise d'un logiciel que vous exploitez vous-même.",
      items: [
        {
          title: "Confidentialité absolue",
          body: "Les modèles tournent là où vivent vos données. Aucune API tierce ne voit un prompt, un fichier ou un dossier client, sauf si vous le décidez.",
        },
        {
          title: "Un moteur pour toutes les modalités",
          body: "Conversation, analyse de documents, images, vidéo et voix partagent un seul moteur, une seule identité et une seule facture — pas un assemblage d'outils.",
        },
        {
          title: "Branché sur vos outils",
          body: "Outils MCP, base de connaissances et applications métier passent par le même pipeline gouverné, crédits et approbations compris.",
        },
      ],
      more: "En savoir plus",
    },
    how: {
      eyebrow: "Fonctionnement",
      title: "De l'installation à la première réponse en trois commandes.",
      steps: [
        { title: "Installer", body: "La CLI vérifie votre machine et prépare le moteur local.", command: "npx orazaka install" },
        { title: "Démarrer", body: "Base de données, file de messages et services démarrent sur votre matériel.", command: "orazaka start && orazaka dev" },
        { title: "Demander", body: "Ouvrez l'espace : les réponses arrivent de vos propres modèles.", command: "open http://localhost:3000" },
      ],
    },
    studios: {
      eyebrow: "Studios",
      title: "Des parcours d'IA prêts à l'emploi, lancés en un clic.",
      lead: "Un Studio transforme un processus métier en parcours guidé, au prix connu avant de commencer. Installez, remplissez, recevez le résultat.",
      items: [
        { title: "Validation de documents", body: "Vérifiez contrats et formulaires selon vos règles, clause par clause." },
        { title: "Production média", body: "Générez visuels et vidéos courtes pour votre marque, en local." },
        { title: "Prospection", body: "Analysez des comptes et rédigez vos approches à partir de vos données." },
        { title: "Vitrine artisan", body: "Vos photos de chantier deviennent une vitrine qui vend." },
      ],
    },
    cta: {
      title: "Faites entrer l'IA — sans faire sortir vos données.",
      lead: "Créez un espace en une minute. Vos premières réponses viennent des modèles de cette machine.",
      primary: "Créer mon espace",
      secondary: "J'ai déjà un compte",
    },
    footer: {
      privacy: "Confidentialité",
      terms: "Conditions",
      contact: "Contact",
      license: "Open source · Apache-2.0",
      by: "Un produit Krizaka",
    },
  },
};
