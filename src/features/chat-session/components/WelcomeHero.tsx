"use client";

import React from "react";
import { Icon, SentinelMini } from "@krizaka/orazaka-design-system";
import type { IconName } from "@krizaka/orazaka-design-system";
import { Greeting } from "@/core/components/Greeting";
import type { TranslationDictionary } from "@/core/context/LocaleContext";

interface WelcomeHeroProps {
  t: TranslationDictionary;
  /** Submit a starter prompt (creates the thread + sends). */
  onPrompt: (prompt: string) => void;
}

/**
 * WelcomeHero — branded, calm entry point for a new conversation.
 *
 * Replaces the old typewriter/emoji treatment with the Sentinel brand mark, a
 * time-of-day greeting from the dictionary, and three actionable prompt cards that submit on
 * click. No "AI" cliché, reduced-motion safe (entrance only).
 */
export function WelcomeHero({ t, onPrompt }: Readonly<WelcomeHeroProps>) {

  const cards: { label: string; icon: IconName }[] = [
    { label: t.chat.suggestionImage, icon: "image" },
    { label: t.chat.suggestionCode, icon: "code" },
    { label: t.chat.suggestionAsk, icon: "chat" },
  ];

  return (
    <div className="flex w-full max-w-2xl flex-col items-center px-6 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500">
      {/* Brand mark */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-surface-1 shadow-sm">
        <span className="absolute inset-0 rounded-2xl bg-accent opacity-[0.06] blur-xl" />
        <SentinelMini size={34} />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-fg">
        <Greeting suffix="." />
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        {t.chat.startConversationDesc}
      </p>

      {/* Sovereignty chip — threads the shared "on-prem, zero egress" motif */}
      <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-1.5 text-xs font-medium text-fg-secondary">
        <Icon name="shield" className="h-3.5 w-3.5 text-accent" />
        {t.chat.localBadge}
      </span>

      {/* Actionable prompt cards */}
      <div className="mt-8 grid w-full grid-cols-1 gap-3 stagger-children sm:grid-cols-3">
        {cards.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPrompt(label)}
            className="group flex flex-col items-start gap-3 rounded-xl border border-border-subtle bg-surface-1 p-4 text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:animate-in motion-safe:fade-in"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-200 group-hover:scale-105">
              <Icon name={icon} className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-fg">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
