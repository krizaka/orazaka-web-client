/**
 * @file translations.pricing.ts
 * @description The words of /pricing (the editions of Orazaka), en and fr (krizaka/orazaka#447). Prices are data
 * (ADR-009): they come from the price catalogue, never from here — and the catalogue holds no Orazaka plan yet, so no
 * edition carries a figure. Community is what runs today; Business is « soon »; anything custom is Krizaka's single
 * « Entreprise » offer, reached through the contact form. No customer name, no unproven claim (no certification, no
 * hosting or uptime promise).
 */
type Locale = "en" | "fr";

interface Edition {
  name: string;
  /** In the price slot: what the edition is, never an amount. */
  price: string;
  unit: string;
  features: string[];
}

export interface PricingDictionary {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  plansLabel: string;
  community: Edition & { download: string; source: string };
  business: Edition & { soon: string };
  enterprise: Edition & { cta: string };
  custom: { title: string; lead: string; items: string[]; cta: string };
  faq: { title: string; items: { question: string; answer: string }[] };
}

export const pricing: Record<Locale, PricingDictionary> = {
  en: {
    meta: {
      title: "Pricing and editions — Orazaka",
      description: "Orazaka's editions: Community, the open-source platform you run on your own machines; Business, coming soon; and Krizaka's Enterprise offer for anything custom.",
    },
    eyebrow: "Pricing and editions",
    title: "Start with Community. Talk to us for the rest.",
    lead: "Orazaka is open source: Community is the platform itself, and it runs today. No edition shows a price until it is published.",
    plansLabel: "Editions",
    community: {
      name: "Community",
      price: "Open source",
      unit: "Apache-2.0 · run it yourself",
      features: [
        "The platform: chat, documents, images, video and agents.",
        "Runs on your own machines, with local models.",
        "The source is public, and so is the documentation.",
        "Provider keys you add are billed by those providers, not by Orazaka.",
      ],
      download: "Orazaka for Mac",
      source: "See the source",
    },
    business: {
      name: "Business",
      price: "Soon",
      unit: "Not published yet",
      features: ["Planned for teams that run Orazaka together.", "No date and no price until it is published."],
      soon: "Soon",
    },
    enterprise: {
      name: "Enterprise",
      price: "On request",
      unit: "Custom, with Krizaka",
      features: ["Custom modules and integrations on Orazaka.", "Sovereign AI adoption, on your premises.", "Maintenance and support of what Krizaka delivers."],
      cta: "Talk about your project",
    },
    custom: {
      title: "Something custom?",
      lead: "Krizaka has one Enterprise offer, with three parts. Anything beyond Community goes through it.",
      items: ["Evolutions and custom modules for your business.", "Sovereign AI adoption on Orazaka.", "Maintenance and support of what we deliver."],
      cta: "Talk about your project",
    },
    faq: {
      title: "Questions",
      items: [
        { question: "Is Community limited?", answer: "No. It is the same platform as the repository, under its open-source licence. What you run is yours to run, change and host." },
        { question: "Where are the prices?", answer: "A price appears here when it is published, read from Krizaka's price catalogue. None is published for Orazaka, so none is shown." },
        { question: "When does Business arrive?", answer: "It is announced as soon, with no date. This page changes the day it is published." },
        { question: "How do I ask for something custom?", answer: "Through the contact form on krizaka.com: describe your project and we answer within business hours." },
      ],
    },
  },
  fr: {
    meta: {
      title: "Tarifs et éditions — Orazaka",
      description: "Les éditions d'Orazaka : Community, la plateforme libre que vous faites tourner sur vos machines ; Business, bientôt ; et l'offre Entreprise de Krizaka pour tout sur mesure.",
    },
    eyebrow: "Tarifs et éditions",
    title: "Commencez avec Community. Parlons-en pour le reste.",
    lead: "Orazaka est libre : Community est la plateforme elle-même, et elle fonctionne aujourd'hui. Aucune édition n'affiche de prix tant qu'il n'est pas publié.",
    plansLabel: "Éditions",
    community: {
      name: "Community",
      price: "Libre",
      unit: "Apache-2.0 · à héberger vous-même",
      features: [
        "La plateforme : clavardage, documents, images, vidéo et agents.",
        "Tourne sur vos propres machines, avec des modèles locaux.",
        "Le code source est public, la documentation aussi.",
        "Les clés de fournisseurs que vous ajoutez sont facturées par ces fournisseurs, pas par Orazaka.",
      ],
      download: "Orazaka pour Mac",
      source: "Voir le code source",
    },
    business: {
      name: "Business",
      price: "Bientôt",
      unit: "Pas encore publiée",
      features: ["Prévue pour les équipes qui utilisent Orazaka ensemble.", "Ni date ni prix tant qu'elle n'est pas publiée."],
      soon: "Bientôt",
    },
    enterprise: {
      name: "Entreprise",
      price: "Sur demande",
      unit: "Sur mesure, avec Krizaka",
      features: ["Modules et intégrations sur mesure sur Orazaka.", "Adoption d'une IA souveraine, chez vous.", "Maintenance et soutien de ce que Krizaka livre."],
      cta: "Parler de votre projet",
    },
    custom: {
      title: "Un besoin sur mesure ?",
      lead: "Krizaka a une seule offre Entreprise, en trois volets. Tout ce qui dépasse Community passe par elle.",
      items: ["Évolutions et modules sur mesure pour votre entreprise.", "Adoption d'une IA souveraine sur Orazaka.", "Maintenance et soutien de ce que nous livrons."],
      cta: "Parler de votre projet",
    },
    faq: {
      title: "Questions",
      items: [
        { question: "Community est-elle limitée ?", answer: "Non. C'est la même plateforme que le dépôt, sous sa licence libre. Ce que vous faites tourner, vous le gérez, le modifiez et l'hébergez." },
        { question: "Où sont les prix ?", answer: "Un prix apparaît ici lorsqu'il est publié, lu dans le catalogue de prix de Krizaka. Aucun n'est publié pour Orazaka, donc aucun n'est affiché." },
        { question: "Quand arrive Business ?", answer: "Elle est annoncée comme bientôt, sans date. Cette page change le jour de sa publication." },
        { question: "Comment demander du sur mesure ?", answer: "Par le formulaire de contact de krizaka.com : décrivez votre projet et nous répondons aux heures d'affaires." },
      ],
    },
  },
};
