"use client";

import { useCallback, useEffect, useState } from "react";
import { RuntimeConfigApi, RuntimeConfigRefusal, type RuntimeAuditEntry, type RuntimeSetting, type SettingValue } from "@/console/services/runtime-config.admin.api";
import { withSetting } from "@/console/features/engine/utils/engine";

export interface Engine {
  settings: RuntimeSetting[];
  isLoading: boolean;
  hasError: boolean;
  reload: () => void;
  /** Saves one value; resolves to the server's refusal message, or `null` when it was accepted. */
  save: (key: string, value: SettingValue) => Promise<string | null>;
}

/** The runtime settings, read once, and the one-key save that keeps the list at the server's answer. */
export function useEngine(): Engine {
  const [state, setState] = useState({ settings: [] as RuntimeSetting[], isLoading: true, hasError: false });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      setState({ settings: await RuntimeConfigApi.list(), isLoading: false, hasError: false });
    } catch {
      setState({ settings: [], isLoading: false, hasError: true });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const save = useCallback(async (key: string, value: SettingValue) => {
    try {
      const saved = await RuntimeConfigApi.update(key, value);
      setState((s) => ({ ...s, settings: withSetting(s.settings, saved) }));
      return null;
    } catch (error) {
      return error instanceof RuntimeConfigRefusal ? error.message : "";
    }
  }, []);

  return { ...state, reload: () => void load(), save };
}

/** The change history of one key, read when its panel opens. */
export function useAudit(key: string, version: unknown): { entries: RuntimeAuditEntry[]; isLoading: boolean; hasError: boolean } {
  const [state, setState] = useState({ entries: [] as RuntimeAuditEntry[], isLoading: true, hasError: false });
  useEffect(() => {
    let live = true;
    RuntimeConfigApi.audit(key)
      .then((entries) => live && setState({ entries, isLoading: false, hasError: false }))
      .catch(() => live && setState({ entries: [], isLoading: false, hasError: true }));
    return () => {
      live = false;
    };
  }, [key, version]);
  return state;
}
