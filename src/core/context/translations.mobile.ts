/**
 * @file translations.mobile.ts
 * @description Copy of the Mobile section of the home page and of /mobile — four steps of the Orazaka app, en and fr.
 * Each step says the person's goal, what the screen does for them, and three things to notice; each of those is
 * readable in the app's code (orazaka-mobile-client) — nothing invented. Recorded on the iOS 27 simulator against the
 * local stack, signed in as Eric, the demo persona.
 */
type Locale = "en" | "fr";

export interface MobileStepCopy {
  /** The person's goal, as the step's title. */
  goal: string;
  /** One line, for the home page. */
  short: string;
  /** What the screen does and why it matters. */
  purpose: string;
  /** The text alternative of the recording. */
  alt: string;
  /** Three things to notice. */
  notice: [string, string, string];
}

export interface MobileDictionary {
  eyebrow: string;
  title: string;
  lead: string;
  /** The link from the home page to /mobile. */
  all: string;
  recordedOn: string;
  stepsTitle: string;
  step: string;
  notice: string;
  frameLabel: string;
  home: string;
  meta: string;
  metaDescription: string;
  steps: Record<"sign-in" | "studio-run" | "ask" | "jobs", MobileStepCopy>;
}

export const mobile: Record<Locale, MobileDictionary> = {
  en: {
    eyebrow: "On your phone",
    title: "Orazaka in your pocket: four steps",
    lead: "The mobile app is for running your work from anywhere — start a Studio, ask the model, and see where your jobs stand — against the same edge, services and interceptor pipeline as the web client. Four screens, in the order you use them. Press play; nothing starts by itself.",
    all: "Follow the four steps",
    recordedOn: "Recorded on the iOS 27 simulator (iPhone 17) against the local Orazaka stack, signed in as Eric, the demo persona.",
    stepsTitle: "The four steps",
    step: "Step",
    notice: "What to notice",
    frameLabel: "Orazaka mobile app",
    home: "Back to the home page",
    meta: "Orazaka — Mobile",
    metaDescription: "The Orazaka mobile app in four explained steps: sign in, run a Studio, ask and get a streamed answer, follow your jobs.",
    steps: {
      "sign-in": {
        goal: "Sign in to your workspace",
        short: "Eric signs in and lands on the Studios (12 s).",
        purpose: "One screen, one account: you sign in with the same credentials as on the web and go straight to your Studios, with nothing to configure on the phone.",
        alt: "Eric types his e-mail and password, taps Sign in and lands on the list of Studios.",
        notice: [
          "Sign in stays disabled until both the e-mail and the password are filled.",
          "No separate step after signing in: as soon as the session exists, the app swaps the sign-in screens for your Studios.",
          "Forgot password and Create an account sit on the same screen, one tap away.",
        ],
      },
      "studio-run": {
        goal: "Run a Studio from your phone",
        short: "Eric runs “Qualification de Prospects”: the form, the steps, the results (28 s).",
        purpose: "A Studio is a ready-made workflow. The catalogue shows what each one costs, you fill in what it needs, press Run, and follow it to its results without opening a laptop.",
        alt: "Eric picks the Studio “Qualification de Prospects”, fills in its form, presses Run, watches its steps go from running to done and reads the results.",
        notice: [
          "A Studio that is not in your plan stays in the catalogue, marked “locked” — you see what you would get — and its page has no install button.",
          "The form comes from the Studio itself: its own fields, required ones starred, so a run is not refused for a missing input.",
          "The run is followed step by step, refreshed every two seconds, until the results appear.",
        ],
      },
      ask: {
        goal: "Ask the model, and read the answer as it is written",
        short: "Eric asks for a note and the answer streams in (24 s).",
        purpose: "When you only need an answer, not a workflow, you just ask. The reply arrives word by word instead of after a long wait, and the request goes through Orazaka's own pipeline.",
        alt: "Eric types a request for a note; the model's answer appears word by word in the conversation.",
        notice: [
          "The answer streams in as it is produced, so you can start reading right away.",
          "The welcome text says each request runs through the local interceptor pipeline, on the stack you chose.",
          "Leaving the screen mid-answer closes the request; Send is disabled while an answer is being written.",
        ],
      },
      jobs: {
        goal: "Follow your jobs without opening the console",
        short: "Eric's jobs: per day, by kind, then each one (6 s).",
        purpose: "Images, videos, voice and text are produced in the background. This screen tells you what is done, what is running and what failed, so you know where things stand from your pocket.",
        alt: "Eric's jobs: a chart of the last seven days, a chart by kind of work, then the list of jobs with their state.",
        notice: [
          "Two charts above the list: the last seven days split into succeeded and failed, and the share of each kind of work.",
          "Each job shows its state, a progress bar while it runs, and the reason when it failed.",
          "It is read-only on purpose: approving or purging a job stays in the console, never one tap away in a pocket.",
        ],
      },
    },
  },
  fr: {
    eyebrow: "Sur votre téléphone",
    title: "Orazaka dans la poche : quatre étapes",
    lead: "L'app mobile sert à mener votre travail de n'importe où — lancer un Studio, interroger le modèle, voir où en sont vos jobs — face au même edge, aux mêmes services et à la même chaîne d'intercepteurs que le client web. Quatre écrans, dans l'ordre où on s'en sert. Appuyez sur lecture ; rien ne démarre seul.",
    all: "Suivre les quatre étapes",
    recordedOn: "Enregistré sur le simulateur iOS 27 (iPhone 17) face à la pile Orazaka locale, connecté en tant qu'Eric, la persona de démo.",
    stepsTitle: "Les quatre étapes",
    step: "Étape",
    notice: "À remarquer",
    frameLabel: "App mobile Orazaka",
    home: "Retour à l'accueil",
    meta: "Orazaka — Mobile",
    metaDescription: "L'app mobile Orazaka en quatre étapes expliquées : se connecter, lancer un Studio, demander et lire une réponse en flux, suivre ses jobs.",
    steps: {
      "sign-in": {
        goal: "Se connecter à son espace",
        short: "Eric se connecte et arrive sur les Studios (12 s).",
        purpose: "Un écran, un compte : vous vous connectez avec les mêmes identifiants que sur le web et vous arrivez directement sur vos Studios, sans rien à configurer sur le téléphone.",
        alt: "Eric saisit son e-mail et son mot de passe, appuie sur Sign in et arrive sur la liste des Studios.",
        notice: [
          "Le bouton de connexion reste désactivé tant que l'e-mail et le mot de passe ne sont pas remplis.",
          "Pas d'étape en plus : dès que la session existe, l'app remplace les écrans de connexion par vos Studios.",
          "Mot de passe oublié et Créer un compte sont sur le même écran, à un appui.",
        ],
      },
      "studio-run": {
        goal: "Lancer un Studio depuis son téléphone",
        short: "Eric lance « Qualification de Prospects » : le formulaire, les étapes, les résultats (28 s).",
        purpose: "Un Studio est un flux de travail prêt à l'emploi. Le catalogue montre ce que coûte chacun, vous remplissez ce qu'il demande, vous lancez, et vous le suivez jusqu'aux résultats sans ouvrir un ordinateur.",
        alt: "Eric choisit le Studio « Qualification de Prospects », remplit son formulaire, lance l'exécution, voit ses étapes passer de en cours à terminé et lit les résultats.",
        notice: [
          "Un Studio absent de votre offre reste au catalogue, marqué « Verrouillé » — vous voyez ce que vous obtiendriez — et sa page n'a pas de bouton d'installation.",
          "Le formulaire vient du Studio lui-même : ses propres champs, les obligatoires marqués d'une étoile, donc pas de lancement refusé pour une valeur manquante.",
          "L'exécution est suivie étape par étape, rafraîchie toutes les deux secondes, jusqu'à l'apparition des résultats.",
        ],
      },
      ask: {
        goal: "Poser une question au modèle et lire la réponse au fil de l'écriture",
        short: "Eric demande une note et la réponse arrive en flux (24 s).",
        purpose: "Quand il vous faut une réponse et non un flux de travail, vous demandez. La réponse arrive mot à mot plutôt qu'après une longue attente, et la requête passe par la chaîne propre à Orazaka.",
        alt: "Eric saisit une demande de note ; la réponse du modèle apparaît mot à mot dans la conversation.",
        notice: [
          "La réponse s'affiche au fur et à mesure qu'elle est produite : vous commencez à lire tout de suite.",
          "Le texte d'accueil indique que chaque requête passe par la chaîne d'intercepteurs locale, sur la pile que vous avez choisie.",
          "Quitter l'écran en pleine réponse ferme la requête ; Envoyer est désactivé pendant qu'une réponse s'écrit.",
        ],
      },
      jobs: {
        goal: "Suivre ses jobs sans ouvrir la console",
        short: "Les jobs d'Eric : par jour, par type, puis chacun (6 s).",
        purpose: "Images, vidéos, voix et texte sont produits en arrière-plan. Cet écran dit ce qui est terminé, ce qui tourne et ce qui a échoué : vous savez où ça en est depuis votre poche.",
        alt: "Les jobs d'Eric : un graphique des sept derniers jours, un graphique par type de travail, puis la liste des jobs avec leur état.",
        notice: [
          "Deux graphiques au-dessus de la liste : les sept derniers jours entre réussis et échecs, et la part de chaque type de travail.",
          "Chaque job affiche son état, une barre de progression tant qu'il tourne, et la raison s'il a échoué.",
          "C'est en lecture seule, volontairement : approuver ou purger un job reste dans la console, jamais à un appui dans une poche.",
        ],
      },
    },
  },
};
