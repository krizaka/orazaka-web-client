import type { Locale } from "@/core/context/translations.types";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export const CONTENT = {
  en: {
    title: "Infinite Reach",
    subtitle: "Outbound reverse tunnel, local SQLite job store & sandboxed automation.",
    backToLogin: "Back to login",
    intro:
      "To execute tasks on your local environment (like editing code files, compiling, running scripts, or querying DBs), Orazaka utilizes a secure reverse-tunneling protocol combined with transactional SQLite persistence on the local host. You get 100% security with no open inbound firewall ports.",
    columns: [
      {
        title: "Zero Inbound Firewall Ports",
        desc: "The CLI agent initiates an outbound Server-Sent Events (SSE) tunnel. Your local machine stays safely hidden behind NAT with zero open ports exposed to the network.",
      },
      {
        title: "SQLite Transactional Job Store",
        desc: "Every command is immediately saved to the CLI's embedded SQLite database (~/.orazaka-tasks.db) as 'PENDING'. If the tunnel drops, the state is persisted and reconciled automatically upon reconnecting.",
      },
      {
        title: "Sandboxed Local Consent",
        desc: "No script runs silently. The local agent prompts you with an interactive [Y/n] consent check. Once approved, the command runs inside a sandboxed directory timeout-bounded to 300 seconds.",
      },
    ],
    schemaTitle: "Orazaka Transactional Agent Topology",
    schemaDesc: "Outbound-only SSE tunnel writing to an embedded SQLite store before local sandbox execution.",
    demoLabel: "Live · the agent acting on your machine, with consent",
    chat: {
      labels: {
        agent: "Orazaka",
        status: "Online · local",
        model: "agent · MCP",
        routed: "Ran locally",
        privacy: "0 inbound ports · sandboxed",
        placeholder: "Ask the agent to do something…",
      },
      question: "Refactor utils.py and run the test suite.",
      answer:
        "Done — 3 functions refactored, 42/42 tests passing. Executed in a sandboxed dir via the outbound SSE tunnel after your [Y] consent. No inbound ports were opened.",
      pipeline: ["Intent", "MCP Tool", "Sandbox", "Consent"],
    },
    sduiTitle: "Server-Driven Dynamic UI (SDUI)",
    sduiSubtitle: "Deploy dynamic layouts and interactive approval screens instantly, no client rebuilds required.",
    sduiCard1Title: "Dynamic Template Registry",
    sduiCard1Desc: "The Gateway manages structural JSON-defined layouts. Templates are pushed down the SSE stream to dynamically render fields, status widgets, and output interfaces.",
    sduiCard2Title: "Interactive Consent Cards",
    sduiCard2Desc: "When the CLI agent dispatches file transfers, code reviews, or Slack posts, the frontend displays beautiful dynamic consent forms custom-built for that specific task.",
  },
  fr: {
    title: "Portée Infinie",
    subtitle: "Tunnel inverse sortant, stockage des tâches SQLite local et automatisation isolée.",
    backToLogin: "Retour à la connexion",
    intro:
      "Pour exécuter des tâches sur votre machine locale (comme modifier des fichiers, compiler du code ou interroger des bases de données), Orazaka utilise un protocole de tunnel inverse sécurisé couplé à une base SQLite transactionnelle. La sécurité est totale, sans aucun port réseau ouvert.",
    columns: [
      {
        title: "Zéro Port Ouvert (Pare-Feu)",
        desc: "L'agent CLI initie une connexion SSE sortante. Votre machine reste hermétique derrière son NAT/pare-feu, sans aucun point d'accès réseau exposé aux intrusions.",
      },
      {
        title: "Persistance SQLite Locale",
        desc: "Chaque commande reçue est enregistrée dans une base SQLite embarquée (~/.orazaka-tasks.db) à l'état 'PENDING'. En cas de coupure réseau, la tâche est conservée puis synchronisée à la reconnexion.",
      },
      {
        title: "Consentement & Sandbox Locale",
        desc: "Aucune commande ne tourne en cachette. L'agent local vous demande validation via [Y/n]. Après votre accord, le script s'exécute localement dans un environnement surveillé et limité à 300 secondes.",
      },
    ],
    schemaTitle: "Topologie Transactionnelle de l'Agent",
    schemaDesc: "Tunnel SSE sortant enregistrant les tâches dans SQLite avant exécution locale sécurisée.",
    demoLabel: "En direct · l'agent qui agit sur ta machine, avec ton consentement",
    chat: {
      labels: {
        agent: "Orazaka",
        status: "En ligne · local",
        model: "agent · MCP",
        routed: "Exécuté localement",
        privacy: "0 port entrant · sandboxé",
        placeholder: "Demande une action à l'agent…",
      },
      question: "Refactorise utils.py et lance la suite de tests.",
      answer:
        "Fait — 3 fonctions refactorisées, 42/42 tests passent. Exécuté dans un dossier sandboxé via le tunnel SSE sortant après ton consentement [O]. Aucun port entrant ouvert.",
      pipeline: ["Intention", "Outil MCP", "Sandbox", "Consentement"],
    },
    sduiTitle: "Server-Driven Dynamic UI (SDUI)",
    sduiSubtitle: "Déployez des interfaces dynamiques et des écrans d'approbation instantanément, sans recompilation.",
    sduiCard1Title: "Registre de Modèles Dynamiques",
    sduiCard1Desc: "La passerelle gère les structures de mise en page définies en JSON. Les modèles sont envoyés dans le flux SSE pour générer des formulaires et des widgets interactifs à la volée.",
    sduiCard2Title: "Cartes d'Approbation Interactives",
    sduiCard2Desc: "Lorsque l'agent local prépare une modification de fichier ou un dispatch Slack, l'interface affiche un formulaire d'approbation riche et dynamique, adapté sur mesure à la tâche.",
  },
};
