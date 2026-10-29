"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@krizaka/query";
import {
  FeatureToolsApi,
  FeatureToolsRefusal,
  type FeatureRoute,
  type ToolBounds,
} from "@/console/services/feature-tools.admin.api";

const BOUNDS_KEY = ["engine", "feature-tool-bounds"] as const;
const ROUTES_KEY = ["engine", "feature-routes"] as const;

export interface FeatureTools {
  bounds: ToolBounds | undefined;
  routes: FeatureRoute[];
  isLoading: boolean;
  hasError: boolean;
  routesFailed: boolean;
  reload: () => void;
  /** Saves one bound; resolves to the server's refusal message, or `null` when it was accepted. */
  save: (featureKey: string, rounds: number) => Promise<string | null>;
  /** Removes a feature's own bound; same answer as `save`. */
  remove: (featureKey: string) => Promise<string | null>;
}

/** The refusal text of an admin write, `""` when the failure carried none (the screen then says its own words). */
const refusal = (error: unknown): string => (error instanceof FeatureToolsRefusal ? error.message : "");

/** The bounds and the routes, read once, and the writes that re-read the bounds so the list stays at the server's answer. */
export function useFeatureTools(): FeatureTools {
  const client = useQueryClient();
  const bounds = useQuery({ queryKey: BOUNDS_KEY, queryFn: () => FeatureToolsApi.bounds(), retry: false, gcTime: 0 });
  const routes = useQuery({ queryKey: ROUTES_KEY, queryFn: () => FeatureToolsApi.routes(), retry: false, gcTime: 0 });

  const write = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        await action();
        await client.invalidateQueries({ queryKey: BOUNDS_KEY });
        return null;
      } catch (error) {
        return refusal(error);
      }
    },
    [client],
  );

  return {
    bounds: bounds.data,
    routes: routes.data ?? [],
    isLoading: bounds.isPending,
    hasError: bounds.isError,
    routesFailed: routes.isError,
    reload: () => {
      void bounds.refetch();
      void routes.refetch();
    },
    save: (featureKey, rounds) => write(() => FeatureToolsApi.save(featureKey, rounds)),
    remove: (featureKey) => write(() => FeatureToolsApi.remove(featureKey)),
  };
}
