// ADR-085, slice 3: the console's Audit log is one list over the services' operator audits (identity, billing, ...),
// newest first, each line saying which service wrote it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeAudit, billingLine } from "../features/accounts/utils/audit.ts";

const identity = [
  { id: 1, at: "2026-10-21T10:00:00Z", actor: "ada@example.test", action: "admin.user_suspended", targetId: "u1", detail: null, requestId: "r-1", outcome: "ok" as const },
  { id: 2, at: "2026-10-21T08:00:00Z", actor: "ada@example.test", action: "admin.user_restored", targetId: "u1", detail: null, requestId: null, outcome: "ok" as const },
];

test("billing lines read like identity lines and say where they come from", () => {
  const line = billingLine({ id: 7, at: "2026-10-21T09:00:00Z", actor: "ada@example.test", action: "PUT /api/v1/billing/plans/{id}", targetId: "pro", requestId: "r-2", outcome: "refused" });
  assert.deepEqual(line, { key: "billing:7", source: "billing", at: "2026-10-21T09:00:00Z", actor: "ada@example.test", action: "PUT /api/v1/billing/plans/{id}", targetId: "pro", detail: "", requestId: "r-2", outcome: "refused" });
});

test("one list, newest first, from every source; a source that did not answer leaves the others", () => {
  const rows = mergeAudit(identity, [{ id: 7, at: "2026-10-21T09:00:00Z", actor: "ada@example.test", action: "POST /api/v1/billing/packs", targetId: null, requestId: "r-2", outcome: "ok" }]);
  assert.deepEqual(rows.map((r) => r.key), ["identity:1", "billing:7", "identity:2"]);
  assert.deepEqual(rows.map((r) => r.source), ["identity", "billing", "identity"]);
  assert.deepEqual(mergeAudit(identity, null).map((r) => r.source), ["identity", "identity"]);
  assert.deepEqual(mergeAudit([], []), []);
});
