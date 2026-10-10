/**
 * @file translations.landing.ts
 * @description Copy of the public home page (visitors without a session). Kept beside
 * `translations.ts` so the sales copy can be reviewed in one place; merged into the dictionary under
 * `landing`. Every claim here is true of an install today — nothing is promised that the product does not do.
 */

import type { Locale } from "./translations.types";
import type { LandingDictionary } from "./translations.landing.types";

export const landing: Record<Locale, LandingDictionary> = {
  en: {
    nav: {
      sovereignty: "Why Orazaka",
      platform: "Platform",
      how: "How it works",
      studios: "Studios",
      signIn: "Sign in",
      getStarted: "Get started",
      langLabel: "Language",
      openMenu: "Open the menu",
      closeMenu: "Close the menu",
      home: "Orazaka home",
    },
    hero: {
      kicker: "Sovereign AI platform",
      titleLead: "The AI that",
      titleAccent: "never leaves home.",
      lead:
        "Chat, documents, images, video and agents — on your own machines. Your team gets a modern AI workspace; your prompts, files and customer data never cross your walls.",
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
    sovereignty: {
      eyebrow: "Why Orazaka",
      title: "Your data stays home. Your AI comes to it.",
      lead: "Cloud assistants ask you to send your work to them. Orazaka runs where your work already is — and keeps every answer, every file and every bill under your roof.",
      pillars: [
        {
          title: "Nothing leaves your infrastructure",
          body: "Models run on your machines. No third party sees a prompt, a document or a customer record — unless you connect a provider yourself.",
        },
        {
          title: "A cost you decide",
          body: "No per-token bill from someone else's price list. Credits you set, and every Studio shows its price before it runs.",
        },
        {
          title: "Agents that ask first",
          body: "Agents act on your machines only with your approval, over an outbound-only link: no port to open, nothing runs silently.",
        },
      ],
      more: "See how",
    },
    platform: {
      eyebrow: "Platform",
      title: "Everything your team expects from AI. In one place you own.",
      lead: "One workspace, one identity, one bill — for every way your team works with AI.",
      items: [
        { title: "Sovereign chat", body: "Answers streamed from your own models, with your context and your rules." },
        { title: "Agents", body: "Plans you approve, actions on your machines, results you can audit." },
        { title: "Knowledge", body: "Your documents indexed on your server, cited in every answer." },
        { title: "Studios", body: "Ready-made workflows: fill a form, see the price, get the result." },
        { title: "Automation", body: "Connect your business tools and let approved jobs run on their own." },
        { title: "Packs", body: "Add a trade's Studios in one click — installed, priced and governed." },
      ],
      captureAlt: "The Studios catalogue of the Orazaka workspace",
    },
    compare: {
      eyebrow: "Cost & control",
      title: "The same AI. Different ownership.",
      lead: "What changes when the AI runs at home.",
      topic: "Question",
      cloud: "A cloud assistant",
      orazaka: "Orazaka",
      rows: [
        {
          topic: "Where do your prompts go?",
          cloud: "To a provider's servers, under their terms.",
          orazaka: "To models on your machines. A cloud model only if you connect one.",
        },
        {
          topic: "What do you pay?",
          cloud: "Per seat and per token, on a price list you don't control.",
          orazaka: "Your hardware and credits you set. Every Studio shows its price first.",
        },
        {
          topic: "Who decides?",
          cloud: "The vendor changes models, limits and policies.",
          orazaka: "You choose the models, the roles, and what each team can run.",
        },
        {
          topic: "What can agents touch?",
          cloud: "Whatever the integration was granted.",
          orazaka: "Only what you approve — each action asks first.",
        },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "From install to first answer in three commands.",
      lead: "The CLI checks your machine, starts the services and pulls the models. Nothing to configure in a cloud console.",
      terminal: "Your terminal",
      steps: [
        { title: "Install", body: "The CLI checks your machine and prepares the local runtime.", command: "npx orazaka install" },
        { title: "Start", body: "Database, queue and services come up on your hardware.", command: "orazaka start && orazaka dev" },
        { title: "Ask", body: "Open the workspace: answers stream from your own models.", command: "open http://localhost:3000" },
      ],
    },
    studios: {
      eyebrow: "Studios",
      title: "Ready-made AI workflows your team runs in one click.",
      lead: "A Studio turns a business process into a guided run with a clear price before you start. Install one, fill a form, get the result.",
      items: [
        { title: "Document validation", body: "Check contracts and forms against your rules, clause by clause." },
        { title: "Media production", body: "Generate visuals and short videos for your brand, locally." },
        { title: "Prospecting", body: "Research accounts and draft outreach from your own data." },
        { title: "Trades showcase", body: "Turn job-site photos into a portfolio that sells." },
      ],
      cta: "Explore the Studios",
    },
    cta: {
      eyebrow: "Your AI, your rules",
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
      product: "Product",
      legal: "Legal",
      tagline: "Sovereign AI for teams that keep their data at home.",
    },
  },
  fr: {
    nav: {
      sovereignty: "Pourquoi Orazaka",
      platform: "Plateforme",
      how: "Fonctionnement",
      studios: "Studios",
      signIn: "Se connecter",
      getStarted: "Commencer",
      langLabel: "Langue",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      home: "Accueil Orazaka",
    },
    hero: {
      kicker: "Plateforme d'IA souveraine",
      titleLead: "L'IA qui ne quitte",
      titleAccent: "jamais la maison.",
      lead:
        "Conversation, documents, images, vidéo et agents — sur vos propres machines. Votre équipe a un espace d'IA moderne ; vos prompts, fichiers et données clients ne franchissent jamais vos murs.",
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
    sovereignty: {
      eyebrow: "Pourquoi Orazaka",
      title: "Vos données restent chez vous. L'IA vient à elles.",
      lead: "Les assistants cloud vous demandent d'envoyer votre travail chez eux. Orazaka tourne là où votre travail se trouve déjà — et garde chaque réponse, chaque fichier et chaque facture sous votre toit.",
      pillars: [
        {
          title: "Rien ne quitte votre infrastructure",
          body: "Les modèles tournent sur vos machines. Aucun tiers ne voit un prompt, un document ou un dossier client — sauf si vous branchez vous-même un fournisseur.",
        },
        {
          title: "Un coût que vous décidez",
          body: "Pas de facture au token sur la grille d'un autre. Des crédits que vous fixez, et chaque Studio affiche son prix avant de démarrer.",
        },
        {
          title: "Des agents qui demandent d'abord",
          body: "Les agents agissent sur vos machines uniquement avec votre accord, par une liaison sortante : aucun port à ouvrir, rien ne s'exécute en silence.",
        },
      ],
      more: "Voir comment",
    },
    platform: {
      eyebrow: "Plateforme",
      title: "Tout ce que votre équipe attend de l'IA. Dans un espace qui vous appartient.",
      lead: "Un espace, une identité, une facture — pour toutes les façons dont votre équipe travaille avec l'IA.",
      items: [
        { title: "Conversation souveraine", body: "Des réponses de vos propres modèles, avec votre contexte et vos règles." },
        { title: "Agents", body: "Des plans que vous approuvez, des actions sur vos machines, des résultats auditables." },
        { title: "Connaissances", body: "Vos documents indexés sur votre serveur, cités dans chaque réponse." },
        { title: "Studios", body: "Des parcours prêts à l'emploi : un formulaire, un prix, un résultat." },
        { title: "Automatisation", body: "Branchez vos outils métier et laissez tourner les tâches approuvées." },
        { title: "Packs", body: "Ajoutez les Studios d'un métier en un clic — installés, tarifés et gouvernés." },
      ],
      captureAlt: "Le catalogue des Studios de l’espace Orazaka",
    },
    compare: {
      eyebrow: "Coût et contrôle",
      title: "La même IA. Un autre propriétaire.",
      lead: "Ce qui change quand l'IA tourne à la maison.",
      topic: "Question",
      cloud: "Un assistant cloud",
      orazaka: "Orazaka",
      rows: [
        {
          topic: "Où vont vos prompts ?",
          cloud: "Sur les serveurs d'un fournisseur, à ses conditions.",
          orazaka: "Vers des modèles sur vos machines. Un modèle cloud seulement si vous en branchez un.",
        },
        {
          topic: "Que payez-vous ?",
          cloud: "Par siège et par token, sur une grille que vous ne maîtrisez pas.",
          orazaka: "Votre matériel et des crédits que vous fixez. Chaque Studio affiche son prix d'abord.",
        },
        {
          topic: "Qui décide ?",
          cloud: "Le fournisseur change modèles, limites et règles.",
          orazaka: "Vous choisissez les modèles, les rôles et ce que chaque équipe peut lancer.",
        },
        {
          topic: "Que peuvent toucher les agents ?",
          cloud: "Tout ce que l'intégration a reçu.",
          orazaka: "Seulement ce que vous approuvez — chaque action demande d'abord.",
        },
      ],
    },
    how: {
      eyebrow: "Fonctionnement",
      title: "De l'installation à la première réponse en trois commandes.",
      lead: "La CLI vérifie votre machine, démarre les services et télécharge les modèles. Aucune console cloud à configurer.",
      terminal: "Votre terminal",
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
      cta: "Découvrir les Studios",
    },
    cta: {
      eyebrow: "Votre IA, vos règles",
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
      product: "Produit",
      legal: "Légal",
      tagline: "L'IA souveraine des équipes qui gardent leurs données chez elles.",
    },
  },
};
