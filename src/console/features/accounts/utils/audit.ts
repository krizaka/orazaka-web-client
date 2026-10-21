import type { AdminAuditEntry } from "@/console/services/platform.schemas";

/** One line of the console's Audit log, whatever service wrote it. */
export interface AuditRow {
  key: string;
  source: "identity" | "billing";
  at: string;
  actor: string;
  action: string;
  targetId: string;
  detail: string;
  requestId: string;
  outcome: "ok" | "refused" | "failed";
}

/** A line of billing's operator audit (`GET /api/v1/billing/admin/audit`). */
export interface BillingAuditLine {
  id: number;
  at: string;
  actor: string;
  action: string;
  targetId: string | null;
  requestId: string | null;
  outcome: "ok" | "refused" | "failed";
}

export const identityLine = (e: AdminAuditEntry): AuditRow => ({
  key: `identity:${e.id}`,
  source: "identity",
  at: e.at ?? "",
  actor: e.actor ?? "",
  action: e.action,
  targetId: e.targetId ?? "",
  detail: e.detail ?? "",
  requestId: e.requestId ?? "",
  outcome: e.outcome,
});

export const billingLine = (l: BillingAuditLine): AuditRow => ({
  key: `billing:${l.id}`,
  source: "billing",
  at: l.at,
  actor: l.actor,
  action: l.action,
  targetId: l.targetId ?? "",
  detail: "",
  requestId: l.requestId ?? "",
  outcome: l.outcome,
});

/** Every source in one list, newest first; a source that did not answer (`null`) leaves the others. */
export function mergeAudit(identity: readonly AdminAuditEntry[] | null, billing: readonly BillingAuditLine[] | null): AuditRow[] {
  return [...(identity ?? []).map(identityLine), ...(billing ?? []).map(billingLine)].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}
