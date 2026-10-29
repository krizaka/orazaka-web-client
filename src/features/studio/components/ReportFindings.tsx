"use client";

import { CheckIcon, InfoIcon, WarningIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { cn } from "@krizaka/ui/cn";

/** One finding of a rules report (document-validation's shape: rule, verdict, evidence, explanation, citation). */
interface Finding {
  ruleId: string;
  title: string;
  severity?: string;
  verdict: "PASS" | "FAIL" | "INSUFFICIENT_EVIDENCE" | string;
  evidenceSpan?: { quote?: string } | null;
  explanation?: string;
  citation?: string;
}

interface Report {
  findings: Finding[];
  source?: string;
  jurisdiction?: string;
  asOf?: string;
  summary?: { byVerdict?: Record<string, number> };
}

/** Reads a run artefact as a rules report when it is one (JSON with `findings`), else null. */
export function asReport(value: string): Report | null {
  try {
    const parsed = JSON.parse(value) as Partial<Report>;
    return Array.isArray(parsed.findings) && parsed.findings.every((f) => f && typeof f.verdict === "string")
      ? (parsed as Report)
      : null;
  } catch {
    return null;
  }
}

const TONE = { PASS: "success", FAIL: "danger" } as const;

/**
 * A rules report as findings a person can read: the failures first, each with its verdict, the rule it rests on,
 * the passage of the document it quotes and the law it cites. The words are the report's own (the pack writes
 * them); nothing is summarised or invented here.
 */
export function ReportFindings({ report }: Readonly<{ report: Report }>) {
  const order = (f: Finding) => (f.verdict === "FAIL" ? 0 : f.verdict === "PASS" ? 2 : 1);
  const findings = [...report.findings].sort((a, b) => order(a) - order(b));
  const counts = report.summary?.byVerdict ?? {};
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(counts).map(([verdict, count]) => (
          <Badge key={verdict} tone={TONE[verdict as keyof typeof TONE] ?? "warning"}>
            {verdict.replace(/_/g, " ")} · {count}
          </Badge>
        ))}
        {report.source && <span className="text-[11px] text-fg-muted">{report.source}</span>}
      </div>
      <ul className="flex flex-col divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-default">
        {findings.map((f) => {
          const Glyph = f.verdict === "PASS" ? CheckIcon : f.verdict === "FAIL" ? WarningIcon : InfoIcon;
          const tone =
            f.verdict === "PASS" ? "text-fg-success" : f.verdict === "FAIL" ? "text-fg-danger" : "text-fg-warning";
          return (
            <li key={f.ruleId} className="flex gap-3 px-4 py-3">
              <Glyph size={18} className={cn("mt-0.5 flex-shrink-0", tone)} />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-[13px] font-semibold text-fg">
                  {f.title} <span className="font-mono text-[11px] font-normal text-fg-muted">{f.ruleId}</span>
                </p>
                {f.explanation && <p className="text-[13px] text-fg-secondary">{f.explanation}</p>}
                {f.evidenceSpan?.quote && (
                  <blockquote className="border-l-2 border-accent/60 pl-3 text-[12px] italic text-fg-secondary">
                    « {f.evidenceSpan.quote} »
                  </blockquote>
                )}
                {f.citation && <p className="text-[11px] text-fg-muted">{f.citation}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
