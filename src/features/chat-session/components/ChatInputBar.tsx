/* eslint-disable no-restricted-syntax */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Icon, IconButton } from "@krizaka/orazaka-design-system";
import { ChevronDownIcon, CloseIcon } from "@krizaka/icons";
import { cn } from "@krizaka/ui/cn";
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
        className={cn(
          "w-full bg-transparent flex flex-col items-center relative z-25",
          isCentered
            ? "px-6 py-0 flex-1 justify-center"
            : "px-4 pb-5 md:pb-7 pt-0"
        )}
        layout
        transition={{
          layout: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        }}
      >
        <motion.section
          layoutId="chat-input-card"
          className={cn(
            "glass-card w-full shadow-xl p-3 flex flex-col gap-2 transition-[border-color,box-shadow] duration-300 focus-within:border-accent focus-within:shadow-(--orazaka-accent-glow)",
            isCentered ? "max-w-2xl" : "max-w-3xl"
          )}
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
            <div className="mb-0.5 flex flex-shrink-0 items-center gap-0.5">
              <Button
                variant="outline"
                size="sm"
                shape="pill"
                onClick={onTogglePlusMenu}
                disabled={isAgentBusy}
                aria-label={t.chat.addCapability}
                aria-expanded={isPlusMenuOpen}
                className={cn("gap-1.5 pl-2.5 pr-2 font-medium", selectedStudio && "border-accent bg-accent-soft text-fg-accent")}
              >
                <Icon name="spark" size={15} />
                <span className="max-w-[120px] truncate">{selectedStudio ? selectedStudio.label : t.chat.modeChat}</span>
                <ChevronDownIcon size={14} className={cn("transition-transform duration-200", isPlusMenuOpen && "rotate-180")} />
              </Button>
              {selectedStudio && (
                <IconButton variant="ghost" size="sm" shape="pill" className="w-8 px-0" onClick={onClearStudio} disabled={isAgentBusy} label={t.chat.clear}>
                  <CloseIcon size={13} />
                </IconButton>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
            />

            <section className="flex-1 relative flex items-end">
              <IconButton
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAgentBusy}
                className="absolute bottom-1.5 left-1.5 z-10"
                label={t.a11y.attachFile}
              >
                <Icon name="attach" size={20} />
              </IconButton>
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
                className={cn(
                  "w-full pl-10 pr-24 py-3 bg-transparent border-0 text-fg placeholder:text-fg-muted focus:outline-none focus:ring-0 resize-none overflow-hidden text-sm leading-relaxed transition-opacity duration-200",
                  isAgentBusy ? "opacity-50 cursor-not-allowed" : ""
                )}
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
                <span className="text-[10px] text-fg-muted hidden sm:inline-block select-none">
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
