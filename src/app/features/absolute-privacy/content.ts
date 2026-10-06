import type { Locale } from "@/core/context/translations.types";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export const CONTENT = {
  en: {
    title: "Absolute Privacy",
    subtitle: "Your private intelligence stays on your machine, always.",
    backToLogin: "Back to login",
    intro:
      "Unlike conventional cloud AI platforms that log your conversations, train on your datasets, and track your telemetry, Orazaka works under a strict local-first invariant. We believe your cognitive data belongs exclusively to you.",
    columns: [
      {
        title: "100% Local Inference & Video Workers",
        desc: "All neural computations run on your local GPU/CPU (Apple Metal MPS or Vulkan) using Ollama. For heavy video generation, tasks are routed to a stateless local video-worker running on port 8188 with MPS/CUDA hardware acceleration. Your prompts and video outputs never leave your machine.",
      },
      {
        title: "Zero-Telemetry Architecture",
        desc: "Orazaka does not contain hidden tracking code, analytics trackers, or usage monitors. The application runs completely sandboxed within your local environment.",
      },
      {
        title: "Encrypted Local Storage",
        desc: "All session contexts, memory blocks, and database nodes are saved locally in standard PostgreSQL/SQLite instances. Sensitive API credentials are encrypted on-disk using AES-256 keys.",
      },
    ],
    schemaTitle: "Local Security Sandbox Boundary",
    schemaDesc: "Zero outbound network lines — data flows in a closed local loop.",
    demoLabel: "Live · your data never leaves the sandbox",
    chat: {
      labels: {
        agent: "Orazaka",
        status: "Online · local",
        model: "llama3 · Ollama",
        routed: "Processed locally",
        privacy: "0 data leaves your machine",
        placeholder: "Ask — it stays on-device…",
      },
      question: "Analyze this medical report and extract the key findings.",
      answer:
        "Extracted 4 findings and flagged 2 abnormal values. The document was processed entirely on your GPU — nothing was uploaded, logged, or used for training.",
      pipeline: ["Context", "Inference", "Validation"],
    },
  },
  fr: {
    title: "Confidentialité Absolue",
    subtitle: "Votre intelligence privée reste sur votre machine, toujours.",
    backToLogin: "Retour à la connexion",
    intro:
      "Contrairement aux plateformes d'IA cloud traditionnelles qui enregistrent vos conversations, s'entraînent sur vos données et suivent votre télémétrie, Orazaka fonctionne selon un invariant local strict. Votre propriété cognitive n'appartient qu'à vous.",
    columns: [
      {
        title: "Inférence & Workers Vidéo Locaux",
        desc: "Tous les calculs neuronaux s'exécutent sur votre GPU/CPU local (Apple Metal MPS ou Vulkan) via Ollama. Pour le rendu vidéo, les tâches sont déléguées à un worker vidéo local sans état (port 8188 avec accélération matérielle MPS/CUDA). Vos fichiers et requêtes ne quittent jamais votre machine.",
      },
      {
        title: "Zéro Télémétrie",
        desc: "Orazaka n'embarque aucun code de suivi, outil analytique ou mouchard. L'application tourne entièrement isolée dans votre environnement local.",
      },
      {
        title: "Stockage Local Chiffré",
        desc: "Tous les contextes, blocs de mémoire et bases vectorielles sont enregistrés dans vos instances PostgreSQL/SQLite locales. Vos clés d'API sont chiffrées avec AES-256.",
      },
    ],
    schemaTitle: "Frontière du Bac à Sable de Sécurité",
    schemaDesc: "Zéro transmission sortante — les données circulent dans une boucle locale fermée.",
    demoLabel: "En direct · tes données ne quittent jamais le sandbox",
    chat: {
      labels: {
        agent: "Orazaka",
        status: "En ligne · local",
        model: "llama3 · Ollama",
        routed: "Traité localement",
        privacy: "0 donnée ne quitte ta machine",
        placeholder: "Demande — ça reste sur l'appareil…",
      },
      question: "Analyse ce rapport médical et extrais les points clés.",
      answer:
        "4 points extraits et 2 valeurs anormales signalées. Le document a été traité entièrement sur ton GPU — rien n'a été téléversé, journalisé ni utilisé pour l'entraînement.",
      pipeline: ["Contexte", "Inférence", "Validation"],
    },
  },
};
