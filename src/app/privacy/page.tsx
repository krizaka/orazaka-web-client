/* eslint-disable */
"use client";

import { LegalPage, type LegalContent } from "@/features/legal/LegalPage";
import type { Locale } from "@/core/context/translations.types";

const CONTENT: Record<Locale, LegalContent> = {
  en: {
    title: "Privacy Policy",
    subtitle: "Your data stays on your machine. Always.",
    lastUpdated: "Last updated: June 2026",
    intro:
      "Orazaka is designed with a strict local-first architecture. We believe that your private intelligence should remain completely yours. This Privacy Policy details how data is managed within the Orazaka client interface.",
    sections: [
      {
        title: "1. Local Data Storage Invariant",
        text: "All database tables, chat history, system settings, model configuration states, and credentials are saved locally on your hardware. We do not collect, monitor, or sync your private data to any remote cloud servers.",
      },
      {
        title: "2. Zero Telemetry & Tracking",
        text: "There are no trackers, telemetry trackers, or third-party usage analytics built into Orazaka. All application code runs sandboxed, and we do not track which models you execute, what code you compile, or what prompts you write.",
      },
      {
        title: "3. Commercial Cloud Bridges",
        text: "If you explicitly configure and enable commercial cloud providers (such as OpenAI, Anthropic, or Gemini) in your local system settings, queries are sent directly to their endpoints. This usage is governed by their respective privacy terms. Orazaka does not intercept or log these requests.",
      },
      {
        title: "4. Local Filesystem Access",
        text: "Orazaka may read or write workspace files when executing coding tasks or tool workflows. All operations are performed locally using your terminal permissions and remain restricted to the paths you authorize.",
      },
    ],
    backToLogin: "Back to login",
  },
  fr: {
    title: "Politique de Confidentialité",
    subtitle: "Vos données restent sur votre machine. Toujours.",
    lastUpdated: "Dernière mise à jour : Juin 2026",
    intro:
      "Orazaka est conçu avec une architecture locale stricte. Nous croyons que votre intelligence privée doit rester entièrement vôtre. Cette politique détaille comment les données sont gérées dans l'interface client d'Orazaka.",
    sections: [
      {
        title: "1. Invariant de Stockage Local",
        text: "Toutes les tables de base de données, l'historique des discussions, les paramètres système, les configurations de modèle et vos clés d'API sont enregistrés localement sur votre matériel. Nous ne collectons ni ne synchronisons vos données privées sur aucun serveur distant.",
      },
      {
        title: "2. Zéro Télémétrie et Suivi",
        text: "Il n'y a aucun tracker, outil de télémétrie ou analyse d'utilisation tiers dans Orazaka. Tout le code de l'application s'exécute dans un bac à sable local, et nous ne suivons pas les modèles que vous utilisez, le code que vous compilez ou les invites que vous saisissez.",
      },
      {
        title: "3. Passerelles Cloud Commerciales",
        text: "Si vous configurez et activez explicitement des fournisseurs de cloud commerciaux (tels qu'OpenAI, Anthropic ou Gemini), les requêtes sont envoyées directement à leurs serveurs. Cet usage est régi par leurs conditions de confidentialité respectives. Orazaka n'intercepte ni n'enregistre ces requêtes.",
      },
      {
        title: "4. Accès au Système de Fichiers Local",
        text: "Orazaka peut lire ou écrire des fichiers dans votre espace de travail pour exécuter des tâches de code ou des flux de travail. Toutes les opérations s'effectuent localement en utilisant vos autorisations de terminal.",
      },
    ],
    backToLogin: "Retour à la connexion",
  },
};

export default function PrivacyPage() {
  return <LegalPage content={CONTENT} />;
}
