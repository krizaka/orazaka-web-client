/* eslint-disable no-restricted-syntax */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@krizaka/orazaka-design-system";
import { Icon } from "@krizaka/orazaka-design-system";
import { ContextPlusMenu } from "./ContextPlusMenu";
import { ChatIndicators } from "./ChatIndicators";
import { CapabilityOptions } from "./CapabilityOptions";
import { resolveModelCategory } from "@/core/constants/capability.constants";
import type { ChatInputBarProps } from "@/features/chat-session/components/chatInputBar.types";

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  input,
  onInputChange,
  onSubmit,
  isSending,
  isGenerating,
  isUploadingAttachment,
  selectedStudio,
  selectedOptions,
  onOptionsChange,
  attachment,
  onClearStudio,
  onClearAttachment,
  isPlusMenuOpen,
  onTogglePlusMenu,
  onClosePlusMenu,
  onExecuteNode,
  composerStudios,
  fileInputRef,
  onFileChange,
  t,
  isCentered = false,
}) => {
  /* ── Input Blocking Invariant ─────────────────────────────
   * When the agent is actively thinking/streaming, the entire
   * input surface is locked: textarea, attach, plus-menu,
   * and submit button. Matches Gemini's interaction model.
   * ───────────────────────────────────────────────────────── */
  const isAgentBusy = isSending || isGenerating;

  /** Analysis capabilities require a staged asset before they can run. */
  const needsAttachment =
    !!selectedStudio && selectedStudio.inputKind === "ASSET";
  const showOptions =
    !!selectedStudio && resolveModelCategory(selectedStudio.capabilityKey) !== null;

  const isSubmitDisabled =
    isAgentBusy ||
    isUploadingAttachment ||
    (needsAttachment && !attachment) ||
    (!input.trim() && !attachment && !selectedStudio);

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="chat-input-form"
        layoutId="chat-input-bar"
        onSubmit={onSubmit}
        className={`w-full bg-transparent flex flex-col items-center relative z-25 ${
          isCentered
            ? "px-6 py-0 flex-1 justify-center"
            : "px-4 pb-5 md:pb-7 pt-0"
        }`}
        layout
        transition={{
          layout: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        }}
      >
        <motion.section
          layoutId="chat-input-card"
          className={`glass-card w-full shadow-xl p-3 flex flex-col gap-2 transition-[border-color,box-shadow] duration-300 focus-within:border-[var(--accent)] focus-within:shadow-[var(--accent-glow)] ${
            isCentered ? "max-w-2xl" : "max-w-3xl"
          }`}
          layout
        >
          <ChatIndicators
            attachment={attachment}
            isUploadingAttachment={isUploadingAttachment}
            onClearAttachment={onClearAttachment}
            t={t}
          />

          {showOptions && selectedStudio && (
            <CapabilityOptions
              studio={selectedStudio}
              options={selectedOptions}
              onChange={onOptionsChange}
              attachment={attachment}
              onAttach={() => fileInputRef.current?.click()}
              t={t}
            />
          )}

          <section className="flex gap-3 items-end relative">
            <ContextPlusMenu
              isOpen={isPlusMenuOpen}
              onClose={onClosePlusMenu}
              onExecuteNode={onExecuteNode}
              studios={composerStudios}
              t={t}
            />
            {/* Visible capability/mode selector (Gemini-style): shows the active mode — Chat by
                default, or the staged generation capability — opens the capability menu, and
                clears back to Chat via the inline ✕. */}
            <div
              className={`flex items-center rounded-full border transition-all duration-150 flex-shrink-0 mb-0.5 ${
                selectedStudio
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
              } ${isAgentBusy ? "opacity-40 pointer-events-none" : ""}`}
            >
              <button
                type="button"
                onClick={onTogglePlusMenu}
                disabled={isAgentBusy}
                aria-label={t.chat.addCapability}
                aria-expanded={isPlusMenuOpen}
                className="flex items-center gap-1.5 rounded-full pl-2.5 pr-1.5 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <Icon name="spark" size={15} />
                <span className="max-w-[120px] truncate">
                  {selectedStudio ? selectedStudio.label : t.chat.modeChat}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isPlusMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {selectedStudio && (
                <button
                  type="button"
                  onClick={onClearStudio}
                  disabled={isAgentBusy}
                  aria-label={t.chat.clear}
                  className="pl-0.5 pr-2 py-2 transition-opacity hover:opacity-70 focus:outline-none"
                >
                  <Icon name="close" size={13} />
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
            />

            <section className="flex-1 relative flex items-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAgentBusy}
                className={`absolute left-3 bottom-3 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-150 z-10 ${
                  isAgentBusy ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
                }`}
                aria-label="Attach File"
              >
                <Icon name="attach" size={20} />
              </button>
              <textarea
                data-testid="chat-input"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    if (!isSubmitDisabled) {
                      const form = e.currentTarget.closest("form");
                      form?.requestSubmit();
                    }
                  }
                }}
                disabled={isAgentBusy}
                placeholder={isAgentBusy ? t.chat.typing : t.chat.typeMessage}
                rows={1}
                className={`w-full pl-10 pr-24 py-3 bg-transparent border-0 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-0 resize-none overflow-hidden text-sm leading-relaxed transition-opacity duration-200 ${
                  isAgentBusy ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  minHeight: "44px",
                  maxHeight: "140px",
                  height: "auto",
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
                    el.style.overflow = el.scrollHeight > 140 ? "auto" : "hidden";
                  }
                }}
                autoComplete="off"
              />
              <section className="absolute right-2 bottom-1.5 flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline-block select-none">
                  {t.chat.cmdEnterHint}
                </span>
                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  data-testid="chat-submit"
                  className="px-4 py-1.5 h-8 text-xs font-semibold group transition-transform duration-150 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  {(() => {
                    if (isSending) return t.chat.sending;
                    if (isGenerating) return t.chat.typing;
                    return (
                    <span className="flex items-center gap-1.5">
                      {t.chat.send}
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                    );
                  })()}
                </Button>
              </section>
            </section>
          </section>
        </motion.section>
      </motion.form>
    </AnimatePresence>
  );
};
