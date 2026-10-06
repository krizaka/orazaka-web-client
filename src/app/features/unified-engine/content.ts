import type { Locale } from "@/core/context/translations.types";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export interface FeatureColumn {
  title: string;
  desc: string;
}

export interface ChatDemoCopy {
  labels: {
    agent: string;
    status: string;
    model: string;
    routed: string;
    privacy: string;
    placeholder: string;
  };
  question: string;
  answer: string;
  pipeline: string[];
}

export interface UnifiedEngineCopy {
  title: string;
  subtitle: string;
  backToLogin: string;
  intro: string;
  columns: FeatureColumn[];
  schemaTitle: string;
  schemaDesc: string;
  demoLabel: string;
  chat: ChatDemoCopy;
}

export const CONTENT: Record<"en" | "fr", UnifiedEngineCopy> = {
  en: {
    title: "Unified Engine",
    subtitle: "Orazaka cognitive pipeline resolving Interceptors, RAG & Tool chains.",
    backToLogin: "Back to login",
    intro:
      "Executing multi-modal AI requests requires more than raw model calls. Orazaka routes every prompt through a secure, structured Spring AI pipeline—resolving active interceptors, querying local PGVector stores, and attaching dynamic tools before routing to the optimal hardware engine.",
    columns: [
      {
        title: "Cognitive Interceptors",
        desc: "Prompts flow through a type-safe Spring AI chain: UserContextResolver, SystemContextInjector, LanguageAlignmentInterceptor, and MemoryInterceptor run sequentially to inject environment variables, resolve security policies, align language outputs, and restore conversation history.",
      },
      {
        title: "PGVector RAG Pipeline",
        desc: "The RagInterceptor automatically executes semantic search on the local PGVector database. It retrieves relevant text embeddings and appends private domain knowledge to the prompt context before routing.",
      },
      {
        title: "Dynamic MCP Tools",
        desc: "The ToolInterceptor attaches runtime schemas from the Model Context Protocol (MCP) registry on-demand. Matches active intents with Slack, Jira, database, or sandboxed filesystem tools.",
      },
    ],
    schemaTitle: "Orazaka Cognitive Pipeline & Modality Routing",
    schemaDesc:
      "Gateway requests passing through interceptors, RAG, and tool registries before execution.",
    demoLabel: "Live · the engine answering on your own infra",
    chat: {
      labels: {
        agent: "Orazaka",
        status: "Online · local",
        model: "llama3 · Ollama",
        routed: "Routed locally",
        privacy: "0 data leaves your network",
        placeholder: "Ask the engine…",
      },
      question:
        "Search our internal PGVector store: what's our data-retention policy for EU users?",
      answer:
        "Per your indexed policy docs: EU user data is retained 24 months, then purged. Retrieved via local PGVector RAG — the query never left your infrastructure.",
      pipeline: ["Context", "RAG", "Router", "Validation"],
    },
  },
  fr: {
    title: "Moteur Unifié",
    subtitle: "Orazaka orchestrateur de pipeline résolvant intercepteurs, RAG et outils.",
    backToLogin: "Retour à la connexion",
    intro:
      "L'exécution de requêtes IA multi-modales nécessite plus qu'un simple appel modèle. Orazaka structure ses flux via un pipeline Spring AI : il résout les intercepteurs, interroge les bases vectorielles PGVector locales et attache des outils dynamiques avant d'activer le bon moteur.",
    columns: [
      {
        title: "Intercepteurs Cognitifs",
        desc: "Les prompts traversent une chaîne d'intercepteurs typés (Spring AI) : UserContextResolver, SystemContextInjector, LanguageAlignmentInterceptor, et MemoryInterceptor s'exécutent en séquence pour injecter l'environnement, valider la sécurité, et charger la mémoire.",
      },
      {
        title: "Pipeline RAG PGVector",
        desc: "Le RagInterceptor exécute une recherche sémantique sur la base PGVector locale. Il récupère les correspondances vectorielles pertinentes pour enrichir le contexte du prompt avant l'envoi au modèle.",
      },
      {
        title: "Outils Dynamiques MCP",
        desc: "Le ToolInterceptor attache à la volée les schémas d'outils issus du registre Model Context Protocol (MCP). Il connecte l'agent aux API Slack, Jira, bases de données ou scripts locaux sécurisés.",
      },
    ],
    schemaTitle: "Pipeline Cognitif Orazaka & Routage Modalities",
    schemaDesc:
      "Flux gateway traversant les intercepteurs, le RAG et les outils avant dispatch multi-modal.",
    demoLabel: "En direct · le moteur qui répond sur ta propre infra",
    chat: {
      labels: {
        agent: "Orazaka",
        status: "En ligne · local",
        model: "llama3 · Ollama",
        routed: "Routé localement",
        privacy: "0 donnée ne quitte ton réseau",
        placeholder: "Interroge le moteur…",
      },
      question:
        "Cherche dans notre base PGVector : quelle est notre politique de rétention des données pour les utilisateurs UE ?",
      answer:
        "D'après tes documents indexés : les données des utilisateurs UE sont conservées 24 mois, puis purgées. Récupéré via le RAG PGVector local — la requête n'a jamais quitté ton infrastructure.",
      pipeline: ["Contexte", "RAG", "Routage", "Validation"],
    },
  },
};
