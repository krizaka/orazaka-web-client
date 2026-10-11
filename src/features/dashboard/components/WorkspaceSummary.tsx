"use client";

import Link from "next/link";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { NumberTicker } from "@krizaka/ui/number-ticker";

/** Real figures of the signed-in workspace — each one read from the service that owns it. */
export interface WorkspaceFigures {
  /** Conversation threads of this user (conversation service). */
  conversations: number;
  /** Credits available to spend, or null while billing has not answered. */
  credits: number | null;
  /** Studios this user installed (studio service). */
  studios: number;
}

interface WorkspaceSummaryProps {
  figures: WorkspaceFigures;
  /** The locale the figures are written in (`fr-FR`: 48 219). */
  locale: string;
  labels: {
    conversations: string;
    conversationsDesc: string;
    credits: string;
    creditsDesc: string;
    studiosInstalled: string;
    studiosInstalledDesc: string;
  };
}

/**
 * Three figures of the user's own workspace, each a door to where it lives — they climb into view and roll to each new
 * value (the balance is pushed over SSE). It replaces a grid of
 * placeholder numbers: a home page that shows invented metrics is a demo, not a product.
 */
export function WorkspaceSummary({ figures, locale, labels }: Readonly<WorkspaceSummaryProps>) {
  const cards: { icon: IconName; href: string; label: string; desc: string; value: number | null }[] = [
    { icon: "chat", href: "/chat", label: labels.conversations, desc: labels.conversationsDesc, value: figures.conversations },
    { icon: "spark", href: "/billing", label: labels.credits, desc: labels.creditsDesc, value: figures.credits },
    { icon: "studio", href: "/studios", label: labels.studiosInstalled, desc: labels.studiosInstalledDesc, value: figures.studios },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="glass-card flex h-full flex-col gap-2 rounded-lg p-(--orazaka-space-card) transition-colors hover:border-border-default"
          >
            <span className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-muted">{card.label}</span>
              <Icon name={card.icon} size={14} className="text-fg-muted" />
            </span>
            <span className="font-mono text-3xl font-extrabold tracking-tight text-accent">
              {card.value === null ? "—" : <NumberTicker value={card.value} locale={locale} trigger="change" align="start" />}
            </span>
            <span className="text-[11px] text-fg-muted">{card.desc}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
