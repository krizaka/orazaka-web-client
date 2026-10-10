/**
 * @file translations.features.ts
 * @description Copy of the three feature pages (/features/absolute-privacy, /unified-engine, /infinite-reach),
 * merged into the dictionary under `features`. Functional words, no internal class names: a visitor reads what the
 * product does for them; the docs say how it is built.
 */

import type { Locale } from "./translations.types";
import type { FeaturesDictionary } from "./translations.landing.types";

export const features: Record<Locale, FeaturesDictionary> = {
  en: {
    eyebrow: "Feature",
    pointsTitle: "What it means for your team",
    others: "Keep exploring",
    ctaTitle: "See it on your own machine.",
    ctaLead: "Create a workspace in a minute — the first answer comes from a model running next to you.",
    ctaPrimary: "Create your workspace",
    ctaSecondary: "Back to the home page",
    pages: {
      "absolute-privacy": {
        name: "Absolute privacy",
        kicker: "Local first, by design",
        titleLead: "Your data never",
        titleAccent: "leaves the building.",
        lead: "Every model, every file and every conversation stays on machines you control. Orazaka does not phone home — there is nothing to opt out of.",
        points: [
          { title: "Local inference", body: "Text, vision, image, video and speech run on your own GPU or CPU through Ollama and local workers. A cloud provider is used only if you connect one." },
          { title: "Zero telemetry", body: "No analytics, no usage tracking, no hidden calls. The platform runs inside your network and you can audit every outbound connection." },
          { title: "Your storage", body: "Conversations, knowledge and runs live in your PostgreSQL. Files the engine produces are stored encrypted on your disks." },
        ],
        flowTitle: "The path of a question",
        flow: [
          { title: "You ask", body: "In the browser, the CLI or the mobile app — always through your own server." },
          { title: "Governed", body: "Security, context and credit checks run before any model sees the request." },
          { title: "Answered locally", body: "The model next to your data answers; the reply streams back to you." },
          { title: "Kept at home", body: "History and files stay in your database. Nothing is copied elsewhere." },
        ],
        demoLabel: "Live · your data never leaves the machine",
        chat: {
          labels: { agent: "Orazaka", status: "Online · local", model: "llama3.2 · Ollama", routed: "Processed locally", privacy: "0 bytes left your network", placeholder: "Ask — it stays on your machine…" },
          question: "Read this medical report and list the key findings.",
          answer: "4 findings extracted, 2 values flagged as abnormal. The report was read on your own GPU — nothing was uploaded, logged elsewhere or used for training.",
          pipeline: ["Context", "Security", "Inference"],
        },
      },
      "unified-engine": {
        name: "One engine",
        kicker: "Every modality, one runtime",
        titleLead: "One engine for",
        titleAccent: "everything AI does.",
        lead: "Chat, documents, images, video, speech and agents share one runtime, one identity and one bill. One pipeline governs every request, whatever it asks for.",
        points: [
          { title: "One governed pipeline", body: "Every request crosses the same ordered checks — identity, context, credits, validation — before and after the model." },
          { title: "Your knowledge, cited", body: "Documents you add are indexed on your server and brought into answers when they are relevant." },
          { title: "One bill", body: "Credits measure what each run costs, whatever the modality. Studios show the price before they start." },
        ],
        flowTitle: "What happens to every request",
        flow: [
          { title: "Context", body: "Who is asking, in which workspace, with which rights and language." },
          { title: "Knowledge", body: "Relevant passages from your documents and tools are attached." },
          { title: "The right model", body: "The request goes to the model you configured for that capability." },
          { title: "Validated", body: "Structured answers are checked before they reach you." },
        ],
        demoLabel: "Live · one engine, every capability",
        chat: {
          labels: { agent: "Orazaka", status: "Online · local", model: "llama3.2 · Ollama", routed: "Routed locally", privacy: "One pipeline · one bill", placeholder: "Ask anything…" },
          question: "Draft a product sheet from this spec and suggest a cover image.",
          answer: "Product sheet drafted from your spec (3 sections, 240 words). The cover image is queued on your local image worker — you will see it in your runs.",
          pipeline: ["Context", "Knowledge", "Credits", "Validation"],
        },
      },
      "infinite-reach": {
        name: "Agents with consent",
        kicker: "Reach without exposure",
        titleLead: "Agents that act —",
        titleAccent: "only when you say so.",
        lead: "The Orazaka agent runs on your machine and connects out to your workspace. It does real work — files, scripts, your tools — and every action waits for a human approval.",
        points: [
          { title: "No open port", body: "The agent opens an outbound connection to your server. Nothing listens on your machine; nothing reaches in." },
          { title: "Approval first", body: "An action is proposed, then approved by a person in the workspace before it runs. Nothing executes silently." },
          { title: "Resilient by design", body: "Jobs are kept in a local store: if the link drops, results are synced when it comes back." },
        ],
        flowTitle: "From request to result",
        flow: [
          { title: "You ask", body: "Describe the task in the workspace, in plain words." },
          { title: "Plan", body: "The engine proposes the steps and the tools it needs." },
          { title: "You approve", body: "Nothing runs until a person accepts the plan." },
          { title: "It runs", body: "The agent executes on your machine and reports back." },
        ],
        demoLabel: "Live · the agent acting with your consent",
        chat: {
          labels: { agent: "Orazaka", status: "Online · local", model: "agent · MCP", routed: "Ran on your machine", privacy: "Outbound only · approved", placeholder: "Ask the agent to do something…" },
          question: "Rename the invoices in /exports by client and date.",
          answer: "Plan approved — 38 invoices renamed by client and date in /exports. The agent ran on your machine over its outbound link; no port was opened.",
          pipeline: ["Plan", "Approval", "Agent", "Report"],
        },
      },
    },
  },
  fr: {
    eyebrow: "Fonctionnalité",
    pointsTitle: "Ce que ça change pour votre équipe",
    others: "Continuer la visite",
    ctaTitle: "Voyez-le sur votre propre machine.",
    ctaLead: "Créez un espace en une minute — la première réponse vient d'un modèle qui tourne à côté de vous.",
    ctaPrimary: "Créer mon espace",
    ctaSecondary: "Retour à l'accueil",
    pages: {
      "absolute-privacy": {
        name: "Confidentialité absolue",
        kicker: "Local d'abord, par conception",
        titleLead: "Vos données ne quittent",
        titleAccent: "jamais vos murs.",
        lead: "Chaque modèle, chaque fichier et chaque conversation reste sur des machines que vous maîtrisez. Orazaka n'envoie rien à l'extérieur — il n'y a rien à désactiver.",
        points: [
          { title: "Inférence locale", body: "Texte, vision, image, vidéo et voix tournent sur votre GPU ou CPU via Ollama et des workers locaux. Un fournisseur cloud n'est utilisé que si vous en branchez un." },
          { title: "Zéro télémétrie", body: "Aucune analyse, aucun suivi d'usage, aucun appel caché. La plateforme tourne dans votre réseau et chaque connexion sortante est auditable." },
          { title: "Votre stockage", body: "Conversations, connaissances et exécutions vivent dans votre PostgreSQL. Les fichiers produits par le moteur sont chiffrés sur vos disques." },
        ],
        flowTitle: "Le trajet d'une question",
        flow: [
          { title: "Vous demandez", body: "Dans le navigateur, la CLI ou l'app mobile — toujours via votre propre serveur." },
          { title: "Gouvernée", body: "Sécurité, contexte et crédits sont vérifiés avant qu'un modèle ne voie la requête." },
          { title: "Répondue en local", body: "Le modèle à côté de vos données répond ; la réponse vous arrive en direct." },
          { title: "Gardée chez vous", body: "Historique et fichiers restent dans votre base. Rien n'est copié ailleurs." },
        ],
        demoLabel: "En direct · vos données ne quittent jamais la machine",
        chat: {
          labels: { agent: "Orazaka", status: "En ligne · local", model: "llama3.2 · Ollama", routed: "Traité localement", privacy: "0 octet n'a quitté votre réseau", placeholder: "Demandez — ça reste sur votre machine…" },
          question: "Lis ce compte rendu médical et liste les points clés.",
          answer: "4 points extraits, 2 valeurs signalées comme anormales. Le compte rendu a été lu sur votre propre GPU — rien n'a été envoyé, journalisé ailleurs ni utilisé pour l'entraînement.",
          pipeline: ["Contexte", "Sécurité", "Inférence"],
        },
      },
      "unified-engine": {
        name: "Un seul moteur",
        kicker: "Toutes les modalités, un moteur",
        titleLead: "Un seul moteur pour",
        titleAccent: "tout ce que fait l'IA.",
        lead: "Conversation, documents, images, vidéo, voix et agents partagent un moteur, une identité et une facture. Un même pipeline gouverne chaque requête, quoi qu'elle demande.",
        points: [
          { title: "Un pipeline gouverné", body: "Chaque requête traverse les mêmes contrôles ordonnés — identité, contexte, crédits, validation — avant et après le modèle." },
          { title: "Vos connaissances, citées", body: "Les documents ajoutés sont indexés sur votre serveur et intégrés aux réponses quand ils sont pertinents." },
          { title: "Une seule facture", body: "Les crédits mesurent le coût de chaque exécution, quelle que soit la modalité. Les Studios affichent leur prix avant de démarrer." },
        ],
        flowTitle: "Ce qui arrive à chaque requête",
        flow: [
          { title: "Contexte", body: "Qui demande, dans quel espace, avec quels droits et quelle langue." },
          { title: "Connaissances", body: "Les passages utiles de vos documents et outils sont joints." },
          { title: "Le bon modèle", body: "La requête part vers le modèle choisi pour cette capacité." },
          { title: "Validée", body: "Les réponses structurées sont vérifiées avant de vous parvenir." },
        ],
        demoLabel: "En direct · un moteur, toutes les capacités",
        chat: {
          labels: { agent: "Orazaka", status: "En ligne · local", model: "llama3.2 · Ollama", routed: "Routé localement", privacy: "Un pipeline · une facture", placeholder: "Demandez ce que vous voulez…" },
          question: "Rédige une fiche produit à partir de ce cahier des charges et propose une image de couverture.",
          answer: "Fiche produit rédigée à partir de votre cahier des charges (3 sections, 240 mots). L'image de couverture est en file sur votre worker image local — elle apparaîtra dans vos exécutions.",
          pipeline: ["Contexte", "Connaissances", "Crédits", "Validation"],
        },
      },
      "infinite-reach": {
        name: "Agents avec accord",
        kicker: "Agir sans s'exposer",
        titleLead: "Des agents qui agissent —",
        titleAccent: "seulement si vous le dites.",
        lead: "L'agent Orazaka tourne sur votre machine et se connecte à votre espace. Il fait du vrai travail — fichiers, scripts, vos outils — et chaque action attend l'accord d'une personne.",
        points: [
          { title: "Aucun port ouvert", body: "L'agent ouvre une connexion sortante vers votre serveur. Rien n'écoute sur votre machine ; rien n'y entre." },
          { title: "L'accord d'abord", body: "Une action est proposée, puis approuvée par une personne dans l'espace avant de s'exécuter. Rien ne tourne en silence." },
          { title: "Résilient par conception", body: "Les tâches sont gardées dans un stockage local : si la liaison tombe, les résultats sont synchronisés à son retour." },
        ],
        flowTitle: "De la demande au résultat",
        flow: [
          { title: "Vous demandez", body: "Décrivez la tâche dans l'espace, avec vos mots." },
          { title: "Plan", body: "Le moteur propose les étapes et les outils nécessaires." },
          { title: "Vous approuvez", body: "Rien ne s'exécute avant qu'une personne accepte le plan." },
          { title: "Exécution", body: "L'agent travaille sur votre machine et rend compte." },
        ],
        demoLabel: "En direct · l'agent agit avec votre accord",
        chat: {
          labels: { agent: "Orazaka", status: "En ligne · local", model: "agent · MCP", routed: "Exécuté sur votre machine", privacy: "Sortant uniquement · approuvé", placeholder: "Demandez une action à l'agent…" },
          question: "Renomme les factures de /exports par client et par date.",
          answer: "Plan approuvé — 38 factures renommées par client et par date dans /exports. L'agent a tourné sur votre machine par sa liaison sortante ; aucun port n'a été ouvert.",
          pipeline: ["Plan", "Accord", "Agent", "Rapport"],
        },
      },
    },
  },
};
