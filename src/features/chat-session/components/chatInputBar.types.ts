import type * as React from "react";
import type { ComposerStudio } from "@krizaka/orazaka-shared";
import type { ComposerRunOptions as Options } from "@/features/chat-session/utils/startComposerRun";
import type { TranslationDictionary } from "@/core/context/LocaleContext";

export interface ChatInputBarProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isSending: boolean;
  isGenerating: boolean;
  isUploadingAttachment: boolean;
  selectedStudio: ComposerStudio | null;
  selectedOptions: Options;
  onOptionsChange: (patch: Partial<Options>) => void;
  attachment: { assetId: string; name: string } | null;
  onClearStudio: () => void;
  onClearAttachment: () => void;
  isPlusMenuOpen: boolean;
  onTogglePlusMenu: () => void;
  onClosePlusMenu: () => void;
  onExecuteNode: (studio: ComposerStudio) => void;
  composerStudios: ComposerStudio[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: TranslationDictionary;
  /** Controls Framer Motion layout mode: true = centered, false = bottom-docked */
  isCentered?: boolean;
}
