"use client";

import type * as React from "react";
import { Alert } from "@krizaka/ui/alert";
import { Badge } from "@krizaka/ui/badge";
import { DescriptionList } from "@krizaka/ui/description-list";
import { fill } from "@/core/context/fill";
import type { LawBlock, Rule, RuleProposal, VetReport } from "@/console/services/law.schemas";
import { useLawCopy } from "@/console/features/law/hooks/useLawCopy";

const short = (hash: string) => hash.slice(0, 12);

/** The cited article: its quote, the pinned version and the official text beside it (the reviewer reads both). */
function LawQuote({ block, rule }: Readonly<{ block: LawBlock; rule: Rule }>) {
  const { t } = useLawCopy();
  const d = t.detail;
  return (
    <figure className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-1 p-3">
      <figcaption className="text-xs font-semibold text-fg-secondary">
        {fill(d.article, { instrument: block.instrument, ref: block.ref, language: block.language })}
      </figcaption>
      <blockquote lang={block.language} className="border-l-2 border-accent pl-3 text-sm text-fg">
        {block.quote}
      </blockquote>
      <p className="font-mono text-xs text-fg-muted">{fill(d.pinned, { hash: short(block.contentHash) })}</p>
      <a href={rule.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-fg-accent underline">
        {fill(d.officialText, { citation: rule.citation })}
      </a>
    </figure>
  );
}

function Fixtures({ rule }: Readonly<{ rule: Rule }>) {
  const { t } = useLawCopy();
  const d = t.detail;
  if (!rule.fixtures || rule.fixtures.pass.length + rule.fixtures.fail.length === 0) return <p className="text-sm text-fg-muted">{d.noFixtures}</p>;
  const group = (title: string, items: readonly string[], tone: "success" | "danger") => (
    <section aria-label={title} className="flex flex-col gap-1">
      <Badge tone={tone} size="sm" className="self-start">{title}</Badge>
      <ul className="flex flex-col gap-1">
        {items.map((text) => (
          <li key={text} className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-fg">{text}</li>
        ))}
      </ul>
    </section>
  );
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {group(d.mustPass, rule.fixtures.pass, "success")}
      {group(d.mustFail, rule.fixtures.fail, "danger")}
    </section>
  );
}

function Vet({ report }: Readonly<{ report: VetReport | null | undefined }>) {
  const { t, date } = useLawCopy();
  const d = t.detail;
  if (!report) return <p className="text-sm text-fg-muted">{d.noVet}</p>;
  const words = { version: report.vetVersion, date: date(report.asOf) };
  const reasons = t.vetReasons as Record<string, string>;
  return (
    <Alert tone={report.passed ? "success" : "danger"} title={fill(report.passed ? d.vetPassed : d.vetFailed, words)}>
      {report.findings.length > 0 && (
        <ul className="flex flex-col gap-1">
          {report.findings.map((f) => (
            <li key={`${f.reason}-${f.detail ?? ""}`}>
              <span className="font-semibold">{reasons[f.reason] ?? fill(t.vetReasons.other, { reason: f.reason })}</span>
              {f.detail && <span className="block font-mono text-xs">{f.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </Alert>
  );
}

/** One proposal as the reviewer reads it: the law and the rule side by side, its fixtures, its vet report, its history. */
export function ProposalDetail({ proposal, children }: Readonly<{ proposal: RuleProposal; children?: React.ReactNode }>) {
  const { t, date } = useLawCopy();
  const d = t.detail;
  const { rule } = proposal;
  const items = [
    { id: "method", term: d.method, details: t.method[rule.method] },
    ...(rule.subject ? [{ id: "subject", term: d.subject, details: <code className="text-xs">{rule.subject}</code> }] : []),
    ...(rule.check ? [{ id: "check", term: d.check, details: <span>{t.checkType[rule.check.type]} <code className="text-xs">{rule.check.pattern}</code></span> }] : []),
    ...(rule.question ? [{ id: "question", term: d.question, details: rule.question }] : []),
    { id: "citation", term: d.citation, details: rule.citation },
    ...(rule.onPass ? [{ id: "onPass", term: d.onPass, details: rule.onPass }] : []),
    ...(rule.onFail ? [{ id: "onFail", term: d.onFail, details: rule.onFail }] : []),
  ];
  return (
    <article className="flex flex-col gap-4 p-3" aria-label={rule.ruleId}>
      <section className="grid gap-4 lg:grid-cols-2">
        <section aria-label={d.law} className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-fg">{d.law}</h3>
          {rule.law.length === 0 ? <Alert tone="warning">{d.noLaw}</Alert> : rule.law.map((block) => <LawQuote key={`${block.instrument}-${block.ref}-${block.language}`} block={block} rule={rule} />)}
        </section>
        <section aria-label={d.rule} className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-fg">{d.rule}</h3>
          <p className="text-sm font-semibold text-fg">{rule.title}</p>
          <DescriptionList items={items} layout="inline" />
        </section>
      </section>
      <section aria-label={d.fixtures} className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-fg">{d.fixtures}</h3>
        <Fixtures rule={rule} />
      </section>
      <section aria-label={d.vet} className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-fg">{d.vet}</h3>
        <Vet report={proposal.vetReport} />
      </section>
      <footer className="flex flex-col gap-1 text-xs text-fg-muted">
        {proposal.reviewedBy && proposal.reviewedAt && <p>{fill(d.reviewed, { actor: proposal.reviewedBy, date: date(proposal.reviewedAt, true) })}</p>}
        {proposal.decisionNote && <p>{fill(d.note, { note: proposal.decisionNote })}</p>}
        {proposal.derivationRunId && <p className="font-mono">{fill(d.run, { runId: proposal.derivationRunId })}</p>}
        {proposal.packsPrUrl && (
          <a href={proposal.packsPrUrl} target="_blank" rel="noreferrer" className="text-fg-accent underline">{d.inPacks}</a>
        )}
      </footer>
      {children}
    </article>
  );
}
