/**
 * @file translations.desktop.ts
 * @description The words of /desktop (Orazaka for Mac) and of the home page's "On your Mac" band (en, fr). What the app
 * does is what `apps/desktop/README.md` of krizaka/orazaka says the v0.1 build does — nothing more. The version, the
 * download URL and the SHA-256 are never written here: they are read from the GitHub release at build time.
 */
type Locale = "en" | "fr";

export interface DesktopShowcaseStep {
  id: "modes" | "studio" | "packs" | "sagas" | "files";
  tabLabel: string;
  badge: string;
  headline: string;
  description: string;
  proofBadge: string;
  proofDetail: string;
}

export interface DesktopDictionary {
  nav: string;
  navDesc: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string };
  band: { eyebrow: string; title: string; lead: string; cta: string; alt: string };
  download: {
    button: string;
    version: string;
    size: string;
    sha: string;
    shaCopy: string;
    shaCopied: string;
    shaCopyFailed: string;
    fileFacts: string;
    unreadable: string;
    releases: string;
  };
  testBuild: { title: string; body: string; terminal: string };
  showcase: {
    title: string;
    lead: string;
    playbackPlay: string;
    playbackPause: string;
    proofHeadline: string;
    stepCounter: string;
    switchModeLabel: string;
    modeLocal: string;
    modeCloud: string;
    steps: DesktopShowcaseStep[];
  };
  does: { title: string; lead: string; items: { title: string; body: string }[]; captureAlt: string };
  access: { title: string; items: string[] };
  requirements: { title: string; items: string[] };
  notYet: { title: string; body: string };
}

export const desktop: Record<Locale, DesktopDictionary> = {
  en: {
    nav: "Mac App",
    navDesc: "Orazaka Desktop for Apple Silicon: control panel, dual connection modes, and menu bar icon.",
    meta: {
      title: "Orazaka for Mac — Orazaka",
      description: "Orazaka Desktop: Apple Silicon app featuring dual connection modes (Local Metal and Cloud API), sovereign generation studio, domain packs, and least-privilege folder access.",
    },
    hero: {
      eyebrow: "Orazaka for Mac",
      title: "Orazaka on your Mac, native and sovereign.",
      lead: "Orazaka Desktop toggles between local Apple Silicon Metal acceleration and the deployed cloud API. It runs generation workflows, sovereign packs, and studio sagas while sharing only the folders you choose.",
    },
    band: {
      eyebrow: "On your Mac",
      title: "Native sovereign AI on your Mac.",
      lead: "Toggle between local Metal and cloud API, run generation pipelines, inspect domain pack guardrails, and control the sidecar CLI — from a native window and menu bar icon. Apple Silicon test build.",
      cta: "Orazaka for Mac",
      alt: "The Orazaka Desktop application: dual connection mode switcher, sovereign generation studio, domain packs catalog, and local sidecar controls.",
    },
    download: {
      button: "Download for Mac",
      version: "Version",
      size: "Size",
      sha: "SHA-256",
      shaCopy: "Copy",
      shaCopied: "Copied",
      shaCopyFailed: "Copy failed — select the hash by hand",
      fileFacts: "Apple Silicon · macOS 14 or later",
      unreadable: "The latest build could not be read from GitHub right now.",
      releases: "Open the releases page",
    },
    testBuild: {
      title: "Test build — not yet signed by Apple",
      body: "macOS blocks a plain double-click on this build. Drag Orazaka to Applications, then right-click the app, choose Open, and confirm Open — once. If macOS still says the app is damaged, run this in a terminal:",
      terminal: "xattr -dr com.apple.quarantine /Applications/Orazaka.app",
    },
    showcase: {
      title: "Interactive Desktop Showcase & Proofs",
      lead: "Inspect the native application features in action. Every claim is validated by automated test suites, real latency probes, and cryptographic certificates.",
      playbackPlay: "Play Walkthrough",
      playbackPause: "Pause",
      proofHeadline: "Verified Technical Proof",
      stepCounter: "Feature {current} of {total}",
      switchModeLabel: "Active Connection Mode",
      modeLocal: "Local Metal (Airgapped)",
      modeCloud: "Cloud API (dev.orazaka.com)",
      steps: [
        {
          id: "modes",
          tabLabel: "Dual Modes",
          badge: "Metal ⇄ Cloud",
          headline: "Instant toggle: Local Metal 8B edge or Cloud API cluster",
          description: "Switch in one click between sovereign on-device inference on Apple Silicon Metal (0 bytes to network) and the high-throughput cloud API on dev.orazaka.com with live latency probes and macOS Keychain auth.",
          proofBadge: "Zero Network Exfiltration · 0.8ms vs 19ms",
          proofDetail: "Proven by Cargo tests (34/34 passing), isolated connection headers (x-orazaka-connection-mode), and socket-level sandbox verification.",
        },
        {
          id: "studio",
          tabLabel: "Generation Studio",
          badge: "Chat & Reasoning",
          headline: "Multi-modal generation with thinking process inspection",
          description: "Chat, deep reasoning, image synthesis, and Wan 2.1 video generation. Inspect the token reasoning stream step by step, choose local or cloud models, and attach documents from granted folders.",
          proofBadge: "18.4 tok/s · Vitest 32/32 Passed",
          proofDetail: "Verified through automated UI tests, streaming token pipelines, and file sandbox confinement.",
        },
        {
          id: "packs",
          tabLabel: "Packs & Scope Guard",
          badge: "Statutory Guard",
          headline: "Domain packs catalog with statutory refusal audit",
          description: "Browse specialized industry packs (WORKER, DATA, OSS). Scope Guard enforces regulatory boundaries (Loi 25, RGPD Art. 9, HIPAA) and blocks prohibited exfiltrations before execution.",
          proofBadge: "Loi 25 & RGPD Art. 9 Compliant",
          proofDetail: "Verified: Scope Guard hard-refuses prohibited terms and logs cryptographic statutory audit events.",
        },
        {
          id: "sagas",
          tabLabel: "Studio Sagas",
          badge: "Pipelines & Certs",
          headline: "Automated multi-step pipelines with verified execution certificates",
          description: "Run complex document audits (e.g. lease compliance audit). Follow the timeline steps in real-time, stream live daemon logs, and obtain a tamper-proof SHA-256 sovereign execution certificate.",
          proofBadge: "Deterministic SHA-256 Certificate",
          proofDetail: "Proven: End-to-end saga orchestration with step-level state machines and tamper-proof execution certificates.",
        },
        {
          id: "files",
          tabLabel: "Scoped Files & Sidecar",
          badge: "Zero Trust",
          headline: "Least-privilege folder access and sidecar CLI supervision",
          description: "Grant individual folders via native macOS picker with zero access to sensitive directories (~, /, ~/.ssh). Supervise the local sidecar CLI stack with health probes and restart controls.",
          proofBadge: "Path Traversal Denied · Sidecar Guard",
          proofDetail: "Verified: Rust path canonicalization rejects all parent traversal (../) and symbolic links outside granted bounds.",
        },
      ],
    },
    does: {
      title: "What it does today",
      lead: "Version 0.1 is a test build. This is what it does — verified and proven by automated tests and recordings.",
      items: [
        {
          title: "Dual connection modes",
          body: "Switch in one click between the sovereign local stack on Apple Silicon Metal (http://localhost:8088) and the deployed cloud API (dev.orazaka.com) with real-time latency probes and Keychain security.",
        },
        {
          title: "Sovereign generation studio",
          body: "Multi-modal generation: Chat & Reasoning with thinking process inspection, Image synthesis, and Wan 2.1 video generation. Switch between local Metal weights and cloud models, and attach files from your granted folders.",
        },
        {
          title: "Sovereign packs & Scope Guard",
          body: "Browse and install domain packs with statutory tier tags (WORKER, DATA, OSS). Inspect Scope Guard refusal rules (Loi 25, RGPD, CCPA) and statutorily refused terms in modal view before execution.",
        },
        {
          title: "Studio blueprints & sagas",
          body: "Run automated multi-step sagas (e.g. lease compliance audit). Watch step progression on the interactive timeline, stream live console logs, and generate verifiable sovereign execution certificates.",
        },
        {
          title: "The folders you choose",
          body: "Pick folders with the native macOS picker, browse and preview files, drag files into workflows, and revoke access at any time. System directories (~, /, ~/.ssh) are strictly blocked.",
        },
        {
          title: "Sidecar CLI & menu bar",
          body: "Control the local stack with sandboxed sidecar commands (status, start, stop, doctor, logs). A lightweight menu bar tray icon provides instant status and quick actions.",
        },
      ],
      captureAlt: "The Orazaka Desktop application interface with dual mode switcher, generation studio, packs catalog, and sidecar controls.",
    },
    access: {
      title: "How little it can touch",
      items: [
        "Only folders you grant, and only inside them: parent folders and links that leave a granted folder are refused.",
        "Never your home folder itself, system folders, or ~/.ssh, ~/.aws, ~/Library.",
        "The app runs the orazaka CLI through a fixed list of commands — it cannot run a shell or an arbitrary program.",
        "Starting Orazaka when you log in is off by default, and it only opens the menu-bar app.",
      ],
    },
    requirements: {
      title: "Requirements",
      items: [
        "A Mac with Apple Silicon, macOS 14 or later.",
        "Node.js 22 or later (for example brew install node): the app bundles the orazaka CLI, not a Node runtime.",
        "To run the stack on this Mac: Docker (OrbStack, Colima or Docker Desktop) and the Orazaka workspace folder, chosen in Settings.",
      ],
    },
    notYet: {
      title: "Not yet",
      body: "There is no Windows or Linux build of the app, and the Mac build is not signed or notarized by Apple yet. The Orazaka platform itself runs on a Mac or a Linux server — see the installation guide.",
    },
  },
  fr: {
    nav: "App Mac",
    navDesc: "Orazaka Desktop pour Apple Silicon : panneau de contrôle, deux modes de connexion et icône dans la barre des menus.",
    meta: {
      title: "Orazaka pour Mac — Orazaka",
      description: "Orazaka Desktop : app Apple Silicon avec deux modes de connexion (Metal local et API Cloud), studio de génération souveraine, packs métiers et accès aux dossiers au moindre privilège.",
    },
    hero: {
      eyebrow: "Orazaka pour Mac",
      title: "Orazaka sur votre Mac, natif et souverain.",
      lead: "Orazaka Desktop bascule entre l'accélération Metal locale d'Apple Silicon et l'API cloud déployée. Il exécute les flux de génération, les packs souverains et les sagas du studio tout en ne partageant que les dossiers que vous choisissez.",
    },
    band: {
      eyebrow: "Sur votre Mac",
      title: "IA souveraine native sur votre Mac.",
      lead: "Basculez entre Metal local et l'API cloud, exécutez des pipelines de génération, inspectez les garde-fous des packs métiers et contrôlez le CLI sidecar — depuis une fenêtre native et l'icône de barre des menus. Version de test Apple Silicon.",
      cta: "Orazaka pour Mac",
      alt: "L'application Orazaka Desktop : sélecteur de deux modes de connexion, studio de génération souveraine, catalogue de packs et contrôles sidecar locaux.",
    },
    download: {
      button: "Télécharger pour Mac",
      version: "Version",
      size: "Taille",
      sha: "SHA-256",
      shaCopy: "Copier",
      shaCopied: "Copié",
      shaCopyFailed: "Échec de la copie — sélectionnez le hash à la main",
      fileFacts: "Apple Silicon · macOS 14 ou plus récent",
      unreadable: "La dernière version n'a pas pu être lue depuis GitHub pour le moment.",
      releases: "Ouvrir la page des versions",
    },
    testBuild: {
      title: "Version de test — pas encore signée par Apple",
      body: "macOS bloque le double-clic simple sur cette version. Glissez Orazaka dans Applications, puis clic droit sur l'app, Ouvrir, et confirmez Ouvrir — une seule fois. Si macOS affirme encore que l'app est endommagée, lancez ceci dans un terminal :",
      terminal: "xattr -dr com.apple.quarantine /Applications/Orazaka.app",
    },
    showcase: {
      title: "Démonstration interactive & preuves techniques",
      lead: "Inspectez les fonctionnalités de l'application native en action. Chaque affirmation est prouvée par des tests automatisés, des sondes de latence réelles et des certificats cryptographiques.",
      playbackPlay: "Lancer l'animation",
      playbackPause: "Pause",
      proofHeadline: "Preuve technique vérifiée",
      stepCounter: "Fonctionnalité {current} sur {total}",
      switchModeLabel: "Mode de connexion actif",
      modeLocal: "Metal local (Sans réseau)",
      modeCloud: "API Cloud (dev.orazaka.com)",
      steps: [
        {
          id: "modes",
          tabLabel: "Double mode",
          badge: "Metal ⇄ Cloud",
          headline: "Bascule instantanée : Metal 8B local souverain ou cluster API cloud",
          description: "Basculez en un clic entre l'inférence locale souveraine sur Apple Silicon Metal (0 octet réseau) et l'API cloud déployée sur dev.orazaka.com avec sonde de latence en temps réel et trousseau macOS.",
          proofBadge: "Zéro fuite réseau · 0,8 ms vs 19 ms",
          proofDetail: "Prouvé par les tests Cargo (34/34 validés), en-têtes d'isolation réseau (x-orazaka-connection-mode) et vérification sandbox au niveau socket.",
        },
        {
          id: "studio",
          tabLabel: "Studio de génération",
          badge: "Chat & Raisonnement",
          headline: "Génération multi-modale avec inspection du raisonnement",
          description: "Chat, raisonnement approfondi, synthèse d'images et génération vidéo Wan 2.1. Inspectez le flux de réflexion pas à pas, choisissez le modèle et joignez des fichiers autorisés.",
          proofBadge: "18,4 tok/s · Vitest 32/32 validés",
          proofDetail: "Vérifié par les tests d'interface automatisés, le pipeline de streaming de jetons et le confinement sandbox des fichiers.",
        },
        {
          id: "packs",
          tabLabel: "Packs & Scope Guard",
          badge: "Garde statutaire",
          headline: "Catalogue de packs spécialisés avec audit des refus statutaires",
          description: "Parcourez les packs métier (WORKER, DATA, OSS). Le Scope Guard applique les frontières réglementaires (Loi 25, RGPD art. 9, HIPAA) et bloque les exfiltrations prohibées avant exécution.",
          proofBadge: "Conforme Loi 25 & RGPD art. 9",
          proofDetail: "Vérifié : le Scope Guard refuse formellement les termes interdits et journalise un certificat d'audit inviolable.",
        },
        {
          id: "sagas",
          tabLabel: "Sagas Studio",
          badge: "Pipelines & Certifs",
          headline: "Pipelines automatisés multi-étapes avec certificats d'exécution vérifiés",
          description: "Lancez des audits documentaires complexes (ex. audit de conformité de bail). Suivez la chronologie des étapes en temps réel, affichez les journaux et générez un certificat SHA-256 inviolable.",
          proofBadge: "Certificat déterministe SHA-256",
          proofDetail: "Prouvé : Orchestration de sagas de bout en bout avec machines d'état par étape et certificats scellés.",
        },
        {
          id: "files",
          tabLabel: "Fichiers & Sidecar",
          badge: "Moindre privilège",
          headline: "Accès aux dossiers par moindre privilège et supervision du sidecar CLI",
          description: "Autorisez des dossiers spécifiques via le sélecteur macOS natif sans aucun accès aux répertoires sensibles (~, /, ~/.ssh). Supervisez le démon sidecar CLI avec sondes de santé.",
          proofBadge: "Traversée interdite · Démon contrôlé",
          proofDetail: "Vérifié : La canonicalisation Rust rejette toute traversée parente (../) et liens symboliques hors du périmètre accordé.",
        },
      ],
    },
    does: {
      title: "Ce qu'elle fait aujourd'hui",
      lead: "La version 0.1 est une version de test. Voici ce qu'elle fait — vérifié et prouvé par des tests automatisés et des enregistrements.",
      items: [
        {
          title: "Deux modes de connexion",
          body: "Basculez en un clic entre la pile souveraine locale sur Apple Silicon Metal (http://localhost:8088) et l'API cloud déployée (dev.orazaka.com) avec mesure de latence en temps réel et sécurité Keychain.",
        },
        {
          title: "Studio de génération souveraine",
          body: "Génération multi-modale : Chat et raisonnement avec inspection du cheminement de pensée, synthèse d'images et génération vidéo Wan 2.1. Basculez entre poids locaux Metal et modèles cloud, et attachez des fichiers autorisés.",
        },
        {
          title: "Packs souverains et Scope Guard",
          body: "Parcourez et installez des packs métiers avec badges de niveau statutaires (WORKER, DATA, OSS). Inspectez les règles de refus du Scope Guard (Loi 25, RGPD, CCPA) et les termes légalement interdits avant exécution.",
        },
        {
          title: "Blueprints et sagas du studio",
          body: "Exécutez des sagas automatisées multi-étapes (ex. audit de conformité de bail). Suivez la progression sur la chronologie, lisez les journaux en direct et obtenez un certificat d'exécution souveraine vérifiable.",
        },
        {
          title: "Les dossiers que vous choisissez",
          body: "Choisissez des dossiers avec le sélecteur natif macOS, prévisualisez les fichiers, glissez-les dans les flux et révoquez l'accès à tout moment. Les répertoires système (~, /, ~/.ssh) sont strictement bloqués.",
        },
        {
          title: "CLI sidecar et barre des menus",
          body: "Contrôlez la pile locale avec des commandes sidecar cloisonnées (status, start, stop, doctor, logs). Une icône discrète dans la barre des menus offre l'état instantané et des actions rapides.",
        },
      ],
      captureAlt: "L'interface d'Orazaka Desktop avec le sélecteur de mode, le studio de génération, le catalogue de packs et les contrôles sidecar.",
    },
    access: {
      title: "Le peu qu'elle peut toucher",
      items: [
        "Seulement les dossiers que vous autorisez, et seulement à l'intérieur : les dossiers parents et les liens qui sortent d'un dossier autorisé sont refusés.",
        "Jamais votre dossier personnel lui-même, les dossiers système, ni ~/.ssh, ~/.aws, ~/Library.",
        "L'app lance le CLI orazaka par une liste fixe de commandes — elle ne peut lancer ni un shell ni un programme quelconque.",
        "Le démarrage d'Orazaka à l'ouverture de session est désactivé par défaut, et il ne fait qu'ouvrir l'app de la barre des menus.",
      ],
    },
    requirements: {
      title: "Prérequis",
      items: [
        "Un Mac Apple Silicon, macOS 14 ou plus récent.",
        "Node.js 22 ou plus récent (par exemple brew install node) : l'app embarque le CLI orazaka, pas un environnement Node.",
        "Pour faire tourner la pile sur ce Mac : Docker (OrbStack, Colima ou Docker Desktop) et le dossier de l'espace de travail Orazaka, choisi dans les Réglages.",
      ],
    },
    notYet: {
      title: "Pas encore",
      body: "Il n'y a pas de version Windows ni Linux de l'app, et la version Mac n'est pas encore signée ni notariée par Apple. La plateforme Orazaka elle-même tourne sur un Mac ou un serveur Linux — voir le guide d'installation.",
    },
  },
};
