"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@krizaka/orazaka-design-system";
import { useChatStream } from "@/features/chat-session/hooks/useChatStream";
import { ChatTimeline } from "./ChatTimeline";
import { ThreadList } from "./ThreadList";
import { ChatHeader } from "./ChatHeader";
import { ChatDrawer } from "./ChatDrawer";
import { ChatInputBar } from "./ChatInputBar";
import { ChatEmptyState } from "./ChatEmptyState";
import { useTranslation } from "@/core/context/LocaleContext";
import type { ComposerStudio } from "@krizaka/orazaka-shared";
import { useJobStream } from "@/core/context/JobStreamContext";
import { useChatActions } from "@/features/chat-session/hooks/useChatActions";
import { useChatThreadActions } from "@/features/chat-session/hooks/useChatThreadActions";
import { useScrollFab } from "@/features/chat-session/hooks/useScrollFab";
import { useComposerStudios } from "@/features/chat-session/hooks/useComposerStudios";

export const ChatWindow: React.FC<{ initialConversationId: string }> = ({
  initialConversationId,
}) => {
  const router = useRouter();
  const {
    activeConversationId,
    setActiveConversationId,
    chatInput,
    setChatInput,
    startChatStream,
    chatPipeline,
    chatStageProgress,
  } = useJobStream();

  useEffect(() => {
    if (
      initialConversationId &&
      initialConversationId !== activeConversationId
    ) {
      setActiveConversationId(initialConversationId);
      router.push(`/chat?conversationId=${initialConversationId}`);
    }
  }, [
    initialConversationId,
    activeConversationId,
    setActiveConversationId,
    router,
  ]);

  const [isThreadDrawerOpen, setIsThreadDrawerOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const { t, locale } = useTranslation();
  const composerStudios = useComposerStudios(locale);

  const {
    userId,
    selectedStudio,
    selectedOptions,
    updateOptions,
    clearStudio,
    attachment,
    setAttachment,
    isUploadingAttachment,
    fileInputRef,
    nodeMutation,
    handleSelectThread,
    handleFileChange,
    handleSend,
    handleExecuteNode,
  } = useChatActions({ activeConversationId });

  const {
    threads,
    isLoadingThreads,
    messages,
    isLoadingMessages,
    sendMessage,
    isSending,
    isGenerating,
    error,
    createThread,
    renameThread,
    deleteThread,
  } = useChatStream(activeConversationId);

  const {
    handleNewChat,
    handleFirstSend,
    handleRenameThread,
    handleDeleteThread,
    threadTitle,
  } = useChatThreadActions({
    activeConversationId,
    setActiveConversationId,
    setChatInput,
    startChatStream,
    userId,
    threads: threads ?? [],
    createThread,
    renameThread,
    deleteThread,
  });

  const {
    messagesEndRef,
    scrollContainerRef,
    showScrollFab,
    handleScroll,
    scrollToBottom,
  } = useScrollFab([messages, isSending, isGenerating, nodeMutation.isPending]);

  const isImagePending =
    nodeMutation.isPending && nodeMutation.variables?.studio.iconKey === "image";
  const isSpeechPending =
    nodeMutation.isPending && nodeMutation.variables?.studio.iconKey === "speech";

  /** Whether the input bar should render in centered (search) mode */
  const isInputCentered = !activeConversationId;

  // Props shared by both composer renders (active thread vs. empty state) — only onSubmit/isCentered differ.
  const composerSharedProps = {
    input: chatInput,
    onInputChange: setChatInput,
    isSending,
    isGenerating,
    isUploadingAttachment,
    selectedStudio,
    selectedOptions,
    onOptionsChange: updateOptions,
    attachment,
    onClearStudio: clearStudio,
    onClearAttachment: () => setAttachment(null),
    isPlusMenuOpen,
    onTogglePlusMenu: () => setIsPlusMenuOpen(!isPlusMenuOpen),
    onClosePlusMenu: () => setIsPlusMenuOpen(false),
    onExecuteNode: (studio: ComposerStudio) =>
      handleExecuteNode(studio, isPlusMenuOpen, setIsPlusMenuOpen),
    composerStudios,
    fileInputRef,
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleFileChange(e, t),
    t,
  };

  return (
    <main className="flex h-full w-full bg-surface-0 overflow-hidden relative">
      <ChatDrawer
        isOpen={isThreadDrawerOpen}
        onClose={() => setIsThreadDrawerOpen(false)}
        threads={threads ?? []}
        activeConversationId={activeConversationId}
        onSelectThread={handleSelectThread}
        isLoadingThreads={isLoadingThreads}
        onCreateThread={handleNewChat}
        onDeleteThread={handleDeleteThread}
        t={t}
      />

      {/* Thread list — hidden in empty state for clean viewport */}
      {activeConversationId && (
        <aside className="w-72 flex-shrink-0 hidden md:block">
          <ThreadList
            threads={threads ?? []}
            activeId={activeConversationId}
            onSelectThread={handleSelectThread}
            isLoading={isLoadingThreads}
            onCreateThread={handleNewChat}
            onDeleteThread={handleDeleteThread}
          />
        </aside>
      )}

      <section className="flex-1 flex flex-col h-full min-w-0 bg-surface-0">
        {activeConversationId ? (
          <>
            <ChatHeader
              activeConversationId={activeConversationId}
              threadTitle={threadTitle}
              onOpenDrawer={() => setIsThreadDrawerOpen(true)}
              onRename={(title) =>
                handleRenameThread(activeConversationId, title)
              }
              t={t}
            />

            <article
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-6 space-y-5 relative scroll-smooth"
            >
              <ChatTimeline
                messages={messages ?? []}
                isLoadingMessages={isLoadingMessages}
                isGenerating={isGenerating}
                isImagePending={isImagePending}
                isSpeechPending={isSpeechPending}
                error={error}
                messagesEndRef={messagesEndRef}
                chatPipeline={chatPipeline}
                completedStageIds={chatStageProgress}
              />

              {/* Scroll to bottom FAB */}
              {showScrollFab && (
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="sticky bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-border-default text-fg-secondary hover:text-fg hover:bg-surface-3 shadow-lg transition-all duration-200 text-[11px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
                  aria-label="Scroll to bottom"
                >
                  <Icon name="arrowDown" size={14} />
                  {t.chat.newMessages}
                </button>
              )}
            </article>

            <ChatInputBar
              {...composerSharedProps}
              onSubmit={(e) =>
                handleSend(e, sendMessage, isSending, isGenerating)
              }
              isCentered={false}
            />
          </>
        ) : (
          <>
            {/* Empty state: centered input + WelcomeHero */}
            <ChatEmptyState
              t={t}
              onPrompt={(label) => {
                // Selecting a welcome card creates the thread and sends immediately.
                handleFirstSend(label);
              }}
            />

            <ChatInputBar
              {...composerSharedProps}
              onSubmit={(e) => {
                e.preventDefault();
                handleFirstSend(chatInput);
              }}
              isCentered={isInputCentered}
            />
          </>
        )}
      </section>
    </main>
  );
};
