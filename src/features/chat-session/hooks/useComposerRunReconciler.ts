"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isTerminalRun, type Run, type RunArtefact } from "@krizaka/orazaka-shared";
import type { ChatMessage } from "@/core/types/chat.types";
import type { MediaKind } from "@/core/constants/capability.constants";
import { useTranslation } from "@/core/context/LocaleContext";
import { saveStoredMessages } from "@/features/chat-session/hooks/useMessageHistory";
import { StudioApi } from "@/services/studio.api";

/** How often a live run started from the composer is re-read. */
const POLL_MS = 4000;

interface PendingRun {
  conversationId: string;
  messageId: string;
}

/** How an artefact's declared type renders in a chat bubble. */
const KIND_OF: Record<RunArtefact["type"], MediaKind> = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  TEXT: "text",
};

/**
 * What a finished run puts in the bubble.
 *
 * Read from the artefact's **declared** type rather than sniffed off a URL, which is
 * what the job path had to do: a run's outputs carry the type the blueprint declared
 * for them, so an audio file whose URL has no extension still renders as audio.
 */
function contentOf(run: Run): { content: string; kind: MediaKind } {
  const first = run.outputs[0];
  if (!first) {
    return { content: "✅", kind: "text" };
  }
  return { content: first.value, kind: KIND_OF[first.type] ?? "text" };
}

/**
 * Bridges runs the composer started back into the chat thread.
 *
 * Replaces `useMediaJobReconciler`, which watched the global job stream for the job a
 * direct capability call had returned. The composer starts runs now (ADR-068 §4), so
 * what is followed is the run: it is the only thing that knows when the work is
 * finished, what it produced, and — on a Studio with more than one step — that there
 * was more than one job involved.
 *
 * A run outlives the component that started it: the first message of a conversation navigates into
 * the new thread, and a reload starts from the stored history. So the placeholders of the open
 * conversation are picked up from its history — any `run-pending` bubble still empty is followed
 * again, whoever started it.
 *
 * @param userId - whose history the rewritten message belongs to
 * @param conversationId - the open conversation, whose pending runs are resumed
 */
export function useComposerRunReconciler(userId: string, conversationId?: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const pendingRef = useRef<Map<string, PendingRun>>(new Map());
  const [tracked, setTracked] = useState(0);

  const trackRun = useCallback(
    (runId: string, conversationId: string, messageId: string) => {
      if (!runId || !conversationId) return;
      pendingRef.current.set(runId, { conversationId, messageId });
      setTracked(pendingRef.current.size);
    },
    [],
  );

  useEffect(() => {
    if (!conversationId) return;
    const queryKey = ["chatMessages", userId, conversationId];
    const resume = () => {
      const messages = queryClient.getQueryData<ChatMessage[]>(queryKey) ?? [];
      let added = false;
      for (const message of messages) {
        if (message.kind !== "run-pending" || message.content || pendingRef.current.has(message.runId)) continue;
        pendingRef.current.set(message.runId, { conversationId, messageId: message.id });
        added = true;
      }
      if (added) setTracked(pendingRef.current.size);
    };
    resume();
    const key = JSON.stringify(queryKey);
    return queryClient.getQueryCache().subscribe((event) => {
      if (JSON.stringify(event.query.queryKey) === key) resume();
    });
  }, [queryClient, userId, conversationId]);

  const rewrite = useCallback(
    (ref: PendingRun, patch: { content: string; kind: MediaKind }) => {
      const queryKey = ["chatMessages", userId, ref.conversationId] as const;
      queryClient.setQueryData<ChatMessage[]>(queryKey, (old = []) => {
        let changed = false;
        const updated = old.map((message) => {
          if (message.id !== ref.messageId) return message;
          changed = true;
          return { ...message, content: patch.content, kind: patch.kind } as ChatMessage;
        });
        if (changed) saveStoredMessages(userId, ref.conversationId, updated);
        return changed ? updated : old;
      });
    },
    [queryClient, userId],
  );

  useEffect(() => {
    if (pendingRef.current.size === 0) return;

    const settle = async () => {
      for (const [runId, ref] of [...pendingRef.current]) {
        let run: Run | null = null;
        try {
          run = await StudioApi.fetchRun(runId);
        } catch {
          // A missed read delays the bubble; the next tick tries again.
          continue;
        }
        if (!run) continue;

        if (run.status === "AWAITING_INPUT") {
          // A one-step Studio has no approval step and cannot reach this — but a state
          // the composer cannot render is worse than one it hands over, so the bubble
          // says so and keeps its link to the run screen, where the answer is given.
          rewrite(ref, { content: t.chat.awaitingInput, kind: "run-pending" });
          pendingRef.current.delete(runId);
          continue;
        }
        if (!isTerminalRun(run.status)) continue;

        rewrite(
          ref,
          run.status === "SUCCEEDED"
            ? contentOf(run)
            : {
                content: `⚠️ ${run.errorMessage || "Run failed."}`,
                kind: "text",
              },
        );
        pendingRef.current.delete(runId);
      }
      setTracked(pendingRef.current.size);
    };

    void settle();
    const timer = setInterval(() => void settle(), POLL_MS);
    return () => clearInterval(timer);
  }, [tracked, rewrite, t]);

  return { trackRun };
}
