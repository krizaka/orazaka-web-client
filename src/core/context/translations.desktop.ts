/**
 * @file translations.desktop.ts
 * @description The words of /desktop (Orazaka for Mac) and of the home page's "On your Mac" band (en, fr). What the app
 * does is what `apps/desktop/README.md` of krizaka/orazaka says the v0.1 build does — nothing more. The version, the
 * download URL and the SHA-256 are never written here: they are read from the GitHub release at build time.
 */
type Locale = "en" | "fr";

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
  does: { title: string; lead: string; items: { title: string; body: string }[]; captureAlt: string };
  access: { title: string; items: string[] };
  requirements: { title: string; items: string[] };
  notYet: { title: string; body: string };
}

export const desktop: Record<Locale, DesktopDictionary> = {
  en: {
    nav: "Mac app",
    navDesc: "Orazaka Desktop for Apple Silicon: a control panel and a menu-bar icon.",
    meta: {
      title: "Orazaka for Mac — Orazaka",
      description: "Orazaka Desktop: a test build for Apple Silicon Macs — a control panel for the local stack, a connection to a hosted Orazaka, and access to the folders you choose.",
    },
    hero: {
      eyebrow: "Orazaka for Mac",
      title: "Orazaka on your Mac, with a control panel.",
      lead: "Orazaka Desktop starts and stops the local stack, opens your workspace in its own window, and shares only the folders you choose. It is a test build today.",
    },
    band: {
      eyebrow: "On your Mac",
      title: "A control panel for Orazaka, on your Mac.",
      lead: "Start and stop the stack, run the checks, read the logs, open the workspace — from one window and a menu-bar icon. Apple Silicon, test build.",
      cta: "Orazaka for Mac",
      alt: "The Orazaka Desktop control panel: the local stack's status with Start, Stop and Run doctor, the services with their ports, and the logs.",
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
    does: {
      title: "What it does today",
      lead: "Version 0.1 is a test build. This is what it does — and only this.",
      items: [
        { title: "Control panel", body: "The status of the local stack, Start and Stop, Run doctor, the services with their ports, live logs, and the version of the CLI it runs. Open workspace shows the web interface in an app window." },
        { title: "Connect to a hosted Orazaka", body: "Point the app at a hosted Orazaka (https only) and sign in on the Orazaka page itself — the app never sees or stores your password." },
        { title: "The folders you choose", body: "Pick folders with the native picker, browse and preview their files, drag files into the workspace, watch a folder for new files, and revoke any of it at any time." },
        { title: "Menu bar", body: "An icon showing whether the stack runs, with Open panel, Open workspace, Start, Stop and Quit. Closing the window keeps the app in the menu bar." },
      ],
      captureAlt: "The Orazaka Desktop control panel.",
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
    navDesc: "Orazaka Desktop pour Apple Silicon : un panneau de contrôle et une icône dans la barre des menus.",
    meta: {
      title: "Orazaka pour Mac — Orazaka",
      description: "Orazaka Desktop : une version de test pour les Mac Apple Silicon — un panneau de contrôle de la pile locale, la connexion à un Orazaka hébergé, et l'accès aux dossiers que vous choisissez.",
    },
    hero: {
      eyebrow: "Orazaka pour Mac",
      title: "Orazaka sur votre Mac, avec un panneau de contrôle.",
      lead: "Orazaka Desktop démarre et arrête la pile locale, ouvre votre espace de travail dans sa propre fenêtre et ne partage que les dossiers que vous choisissez. C'est aujourd'hui une version de test.",
    },
    band: {
      eyebrow: "Sur votre Mac",
      title: "Un panneau de contrôle d'Orazaka, sur votre Mac.",
      lead: "Démarrez et arrêtez la pile, lancez les vérifications, lisez les journaux, ouvrez l'espace de travail — depuis une fenêtre et une icône dans la barre des menus. Apple Silicon, version de test.",
      cta: "Orazaka pour Mac",
      alt: "Le panneau de contrôle d'Orazaka Desktop : l'état de la pile locale avec Démarrer, Arrêter et Lancer le diagnostic, les services avec leurs ports, et les journaux.",
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
    does: {
      title: "Ce qu'elle fait aujourd'hui",
      lead: "La version 0.1 est une version de test. Voici ce qu'elle fait — et rien de plus.",
      items: [
        { title: "Panneau de contrôle", body: "L'état de la pile locale, Démarrer et Arrêter, le diagnostic, les services avec leurs ports, les journaux en direct, et la version du CLI utilisé. Ouvrir l'espace de travail affiche l'interface web dans une fenêtre d'app." },
        { title: "Se connecter à un Orazaka hébergé", body: "Indiquez à l'app un Orazaka hébergé (https uniquement) et connectez-vous sur la page d'Orazaka elle-même — l'app ne voit ni ne conserve votre mot de passe." },
        { title: "Les dossiers que vous choisissez", body: "Choisissez des dossiers avec le sélecteur natif, parcourez et prévisualisez leurs fichiers, glissez des fichiers dans l'espace de travail, surveillez un dossier pour ses nouveaux fichiers, et révoquez tout à tout moment." },
        { title: "Barre des menus", body: "Une icône qui indique si la pile tourne, avec Ouvrir le panneau, Ouvrir l'espace de travail, Démarrer, Arrêter et Quitter. Fermer la fenêtre garde l'app dans la barre des menus." },
      ],
      captureAlt: "Le panneau de contrôle d'Orazaka Desktop.",
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
