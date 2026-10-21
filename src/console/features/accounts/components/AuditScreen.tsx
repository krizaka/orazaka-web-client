"use client";

import * as React from "react";
import { Alert } from "@krizaka/ui/alert";
import { Button } from "@krizaka/ui/button";
import { DataTable, DataTableExport, DataTableFilters, type DataTableColumn } from "@krizaka/ui/data-table";
import { consoleCopy } from "@/console/core/copy/console";
import { PlatformAdminApi } from "@/console/services/platform.admin.api";
import { mergeAudit, type AuditRow } from "@/console/features/accounts/utils/audit";

const t = consoleCopy.audit;

const columns: DataTableColumn<AuditRow>[] = [
  { id: "at", header: t.when, sortable: true, value: (e) => e.at, cell: (e) => (e.at ? e.at.replace("T", " ").slice(0, 19) : "—") },
  { id: "source", header: t.source, filter: "facet", value: (e) => e.source },
  { id: "outcome", header: t.outcome, filter: "facet", value: (e) => e.outcome },
  { id: "actor", header: t.actor, filter: "text", value: (e) => e.actor },
  { id: "action", header: t.action, filter: "facet", card: "title", cell: (e) => <span className="font-mono text-xs">{e.action}</span> },
  { id: "targetId", header: t.target, value: (e) => e.targetId, cell: (e) => <span className="font-mono text-[11px]">{e.targetId || "—"}</span> },
  { id: "detail", header: t.detail, value: (e) => e.detail },
  // The request the action was made in (the edge's X-Request-Id): filter by it to see everything one request did.
  { id: "requestId", header: t.request, filter: "text", value: (e) => e.requestId, cell: (e) => <span className="font-mono text-[11px]">{e.requestId || "—"}</span> },
];

/** A call that reports its outcome instead of throwing: one service down must not hide the others' lines. */
const attempt = <T,>(p: Promise<T>) => p.then((value) => ({ ok: true as const, value }), (error: unknown) => ({ ok: false as const, error }));

/** Every service's operator audit trail of account administration, newest first, filterable and exportable. */
export function AuditScreen() {
  const [rows, setRows] = React.useState<AuditRow[]>([]);
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading");
  const load = React.useCallback(async () => {
    setState("loading");
    try {
      // Every service's operator audit in one list; one that does not answer leaves the others (and says so).
      const [identity, billing, studio, engine] = await Promise.all([
        attempt(PlatformAdminApi.audit()),
        attempt(PlatformAdminApi.serviceAudit("billing")),
        attempt(PlatformAdminApi.serviceAudit("studio")),
        attempt(PlatformAdminApi.serviceAudit("engine")),
      ]);
      const all = [identity, billing, studio, engine];
      if (all.every((r) => !r.ok)) throw new Error("no service answered");
      const lines = (r: typeof billing) => (r.ok ? r.value : null);
      setRows(mergeAudit(identity.ok ? identity.value : null, { billing: lines(billing), studio: lines(studio), engine: lines(engine) }));
      setState(all.every((r) => r.ok) ? "ready" : "error");
    } catch {
      setState("error");
    }
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold tracking-tight text-fg">{t.title}</h1>
        <p className="max-w-3xl text-sm text-fg-secondary">{t.lead}</p>
      </header>
      {state === "error" && <Alert tone="warning" action={<Button variant="secondary" size="sm" onClick={() => void load()}>{t.retry}</Button>}>{t.error}</Alert>}
      <DataTable
        caption={t.title}
        rows={rows}
        columns={columns}
        getRowId={(e) => e.key}
        loading={state === "loading"}
        defaultPageSize={25}
        defaultSort={{ column: "at", direction: "descending" }}
        toolbar={
          <div className="flex flex-col gap-3">
            <DataTableFilters />
            <div className="flex justify-end">
              <DataTableExport filename="orazaka-audit.csv" />
            </div>
          </div>
        }
      />
    </article>
  );
}
