"use client";

import React from "react";
import type { TranslationDictionary } from "@/core/context/LocaleContext";
import { WelcomeHero } from "./WelcomeHero";

interface ChatEmptyStateProps {
  t: TranslationDictionary;
  /** Submit a starter prompt selected from the welcome cards. */
  onPrompt: (prompt: string) => void;
}

/**
 * ChatEmptyState — centered welcome shown when no conversation is active.
 * The composer (rendered below by ChatWindow) and the welcome prompt cards are
 * the primary actions.
 */
export function ChatEmptyState({ t, onPrompt }: Readonly<ChatEmptyStateProps>) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <WelcomeHero t={t} onPrompt={onPrompt} />
    </div>
  );
}
