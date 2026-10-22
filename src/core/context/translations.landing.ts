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
      how: "How it works",
      signIn: "Sign in",
      docs: "Docs",
      product: "Product",
      download: "Download",
      menu: {
        how: "What it does, on real screens.",
        download: "Orazaka Desktop for Apple Silicon.",
      },
      langLabel: "Language",
      themeLabel: "Change the theme",
      preferences: "Preferences",
      openMenu: "Open the menu",
      closeMenu: "Close the menu",
      home: "Orazaka home",
      talk: "Talk to us",
      repo: "Orazaka web client on GitHub",
    },
    hero: {
      title: "AI that stays on your machines.",
      lead: "Chat, documents, images and video on hardware you own — every run priced up front and recorded.",
      secondary: "See it run",
      visualLabel: "dev.orazaka.com · chat",
    },
    figures: {
      runs: "runs measured on real hardware, each with its record",
      models: "models measured, on a Mac or hosted",
      telemetry: "telemetry calls — nothing phones home",
    },
    features: {
      eyebrow: "What it does",
      title: "Three things, done on your side.",
      lead: "Every screen below is the real app.",
      items: {
        studios: {
          title: "Studios, priced before they run",
          text: "A Studio turns a sentence or a file into an image, a video or a checked document. Its estimated cost shows before it starts.",
        },
        records: {
          title: "Every result keeps its run",
          text: "The output, its steps, its input and its run id stay together — so any result can be checked again.",
        },
        home: {
          title: "Chat and agents that ask first",
          text: "Models run on your machines; a hosted one only if you connect it. An agent shows its plan and acts once you approve it.",
        },
      },
    },
    records: {
      eyebrow: "Measured",
      title: "One prompt, three models, three run records.",
      lead: "Times, costs and run ids come from the platform's own records — they are not typed.",
      more: "See every measured run",
      measuredOn: "Measured on {day}: {ok} runs finished, {models} models.",
      runLabel: "Run",
      prompt: "A winter night in Montréal",
      alt: "{title}, by {model}",
      where: "Ran on",
      onMac: "One Mac (Metal) — nothing left the machine",
      onHosted: "DigitalOcean serverless inference",
      noCost: "None — your own machine",
      imageCost: "${cost} an image",
      time: "Time",
      timeValue: "{seconds} s, from the command to the file",
      cost: "Provider price",
    },
    phone: {
      eyebrow: "On your phone",
      title: "The same work, from your phone.",
      lead: "Sign in, describe what you need, follow the run, open the result. The phone app is the same Orazaka, recorded here on a real device.",
    },
    cta: {
      title: "Bring AI in-house — not your data out.",
      body: "On your Mac, your servers or your phone. Tell us what you want to run on your own machines; a person answers.",
      primary: "Create your workspace",
    },
    closed: {
      title: "Orazaka is in development — sign-in is closed on this site",
      body: "This is the public development site: you can read how Orazaka works, watch it run and browse the documentation. Accounts are not open yet.",
      docs: "Read the documentation",
      contact: "Talk to us",
      home: "Back to the home page",
      heroPrimary: "Read the documentation",
      signInBanner: "Sign-in opens when Orazaka's dev services run.",
    },
    footer: {
      devNotice: "Development environment — access by invitation",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
      license: "Open source · Apache-2.0",
      by: "A Krizaka product",
      product: "Product",
      docs: "Documentation",
      api: "API reference",
      cli: "CLI",
      legal: "Legal",
    },
  },
  fr: {
    nav: {
      how: "Fonctionnement",
      signIn: "Se connecter",
      docs: "Docs",
      product: "Produit",
      download: "Télécharger",
      menu: {
        how: "Ce qu'il fait, sur de vrais écrans.",
        download: "Orazaka Desktop pour Apple Silicon.",
      },
      langLabel: "Langue",
      themeLabel: "Changer le thème",
      preferences: "Préférences",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      home: "Accueil Orazaka",
      talk: "Nous écrire",
      repo: "Client web Orazaka sur GitHub",
    },
    hero: {
      title: "L'IA qui reste sur vos machines.",
      lead: "Conversation, documents, images et vidéo sur du matériel qui vous appartient — chaque run au prix annoncé, consigné.",
      secondary: "Le voir tourner",
      visualLabel: "dev.orazaka.com · chat",
    },
    figures: {
      runs: "runs mesurés sur du vrai matériel, chacun avec sa fiche",
      models: "modèles mesurés, sur un Mac ou hébergés",
      telemetry: "appels de télémétrie — rien ne sort",
    },
    features: {
      eyebrow: "Ce qu'il fait",
      title: "Trois choses, faites de votre côté.",
      lead: "Chaque écran ci-dessous est la vraie app.",
      items: {
        studios: {
          title: "Des Studios au prix connu d'avance",
          text: "Un Studio change une phrase ou un fichier en image, en vidéo ou en document vérifié. Son coût estimé s'affiche avant de lancer.",
        },
        records: {
          title: "Chaque résultat garde son run",
          text: "La sortie, ses étapes, son entrée et son identifiant de run restent ensemble — tout résultat peut être revérifié.",
        },
        home: {
          title: "Un chat et des agents qui demandent d'abord",
          text: "Les modèles tournent sur vos machines ; un modèle hébergé seulement si vous en branchez un. Un agent montre son plan et n'agit qu'une fois approuvé.",
        },
      },
    },
    records: {
      eyebrow: "Mesuré",
      title: "Un prompt, trois modèles, trois fiches de run.",
      lead: "Temps, coûts et identifiants de run viennent des relevés de la plateforme — ils ne sont pas saisis à la main.",
      more: "Voir tous les runs mesurés",
      measuredOn: "Mesuré le {day} : {ok} runs terminés, {models} modèles.",
      runLabel: "Run",
      prompt: "Une nuit d'hiver à Montréal",
      alt: "{title}, par {model}",
      where: "Exécuté sur",
      onMac: "Un seul Mac (Metal) — rien n'a quitté la machine",
      onHosted: "Inférence serverless de DigitalOcean",
      noCost: "Aucun — votre propre machine",
      imageCost: "{cost} $ l'image",
      time: "Durée",
      timeValue: "{seconds} s, de la commande au fichier",
      cost: "Prix du fournisseur",
    },
    phone: {
      eyebrow: "Sur votre téléphone",
      title: "Le même travail, depuis votre téléphone.",
      lead: "Connectez-vous, décrivez ce qu'il vous faut, suivez le run, ouvrez le résultat. L'app mobile est le même Orazaka, enregistrée ici sur un vrai appareil.",
    },
    cta: {
      title: "Faites entrer l'IA — sans faire sortir vos données.",
      body: "Sur votre Mac, vos serveurs ou votre téléphone. Dites-nous ce que vous voulez faire tourner sur vos propres machines ; une personne répond.",
      primary: "Créer mon espace",
    },
    closed: {
      title: "Orazaka est en développement — la connexion est fermée sur ce site",
      body: "Ceci est le site public de développement : vous pouvez lire comment Orazaka fonctionne, le voir tourner et parcourir la documentation. Les comptes ne sont pas encore ouverts.",
      docs: "Lire la documentation",
      contact: "Nous parler",
      home: "Retour à l'accueil",
      heroPrimary: "Lire la documentation",
      signInBanner: "La connexion s'ouvre quand les services de développement d'Orazaka tournent.",
    },
    footer: {
      devNotice: "Environnement de développement — accès sur invitation",
      privacy: "Confidentialité",
      terms: "Conditions",
      contact: "Contact",
      license: "Open source · Apache-2.0",
      by: "Un produit Krizaka",
      product: "Produit",
      docs: "Documentation",
      api: "Référence de l'API",
      cli: "CLI",
      legal: "Légal",
    },
  },
};
