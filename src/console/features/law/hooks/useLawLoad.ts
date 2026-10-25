"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminRefusal } from "@/console/services/platform.admin.api";

/** What a law read left: its data, whether it is on its way, the refusal it met (status and Problem code), a reload. */
export interface LawLoad<T> {
  data: T;
  isLoading: boolean;
  refusal: AdminRefusal | null;
  reload: () => void;
}

/** A refusal as the screen words it: an `AdminRefusal`, or a network failure read as a 503 without a code. */
export const asRefusal = (error: unknown) => (error instanceof AdminRefusal ? error : new AdminRefusal(503, null));

/**
 * One read of the law surface, reloaded when `load` changes (it is memoised on what it reads: a status, a kind), when
 * `refresh` changes (a decision elsewhere on the screen) or on demand — the queue changes only when someone acts.
 */
export function useLawLoad<T>(load: (() => Promise<T>) | null, initial: T, refresh = 0): LawLoad<T> {
  const [state, setState] = useState<{ data: T; isLoading: boolean; refusal: AdminRefusal | null }>({ data: initial, isLoading: load !== null, refusal: null });
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!load) return;
    let live = true;
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, isLoading: true }));
      load().then(
        (data) => live && setState({ data, isLoading: false, refusal: null }),
        (error: unknown) => live && setState((s) => ({ ...s, isLoading: false, refusal: asRefusal(error) })),
      );
    }, 0);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [load, round, refresh]);

  const reload = useCallback(() => setRound((r) => r + 1), []);
  return { ...state, reload };
}
