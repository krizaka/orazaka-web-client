"use client";

import { useId, type ReactNode } from "react";
import { CodeBlock } from "@krizaka/ui/code-block";
import { useTranslation } from "@/core/context/LocaleContext";
import type { DocsDiagramLabels } from "@/core/context/translations.docs";
import { PackIndexView, PackView } from "@/features/docs/components/PackCatalogue";
import type { DiagramData } from "@/features/docs/utils/diagram-data";

const mono = "font-mono text-[0.85em] text-fg";
const chip = "rounded-md border border-border-subtle bg-surface-2 px-2 py-0.5 font-mono text-xs text-fg";

/**
 * The text version of a schema block: tables and ordered lists, one column, read in order. It stands in until @krizaka/ui
 * has the generic diagram components — the content is the same, so nothing a doc draws is lost.
 */
export function DiagramView({ data }: Readonly<{ data: DiagramData }>) {
  const { t } = useTranslation();
  const l = t.docs.diagrams;
  switch (data.kind) {
    case "sequence":
      return <Sequence block={data.block} l={l} />;
    case "pipeline":
      return <Pipeline data={data} l={l} />;
    case "states":
      return <States block={data.block} l={l} />;
    case "architecture":
      return <Architecture data={data} l={l} />;
    case "cli-replay":
      return (
        <CodeBlock
          code={data.code}
          language="bash"
          file={l.terminal}
          copyLabel={t.docs.copy}
          copiedLabel={t.docs.copied}
          className="my-5"
        />
      );
    case "cli-journey":
      return <CliJourney data={data} l={l} />;
    case "pack-index":
      return <PackIndexView items={data.items} />;
    case "pack":
      return <PackView pack={data.pack} />;
    case "cli-commands":
      return <p className="my-4 text-sm text-fg-secondary">{data.text}</p>;
  }
}

function Figure({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  const id = useId();
  return (
    <figure aria-labelledby={id} className="my-6 rounded-2xl border border-border-default bg-surface-1/70 p-4 sm:p-5">
      <figcaption id={id} className="mb-3 font-mono text-xs font-semibold text-fg-accent">
        {title}
      </figcaption>
      {children}
    </figure>
  );
}

const rowGrid = "grid grid-cols-[2rem_1fr] gap-x-2 text-sm leading-relaxed text-fg-secondary";

function Sequence({
  block,
  l,
}: Readonly<{ block: Extract<DiagramData, { kind: "sequence" }>["block"]; l: DocsDiagramLabels }>) {
  const label = (key: string) => block.participants.find((p) => p.key === key)?.label ?? key;
  return (
    <Figure title={l.sequence}>
      <p className="m-0 font-mono text-xs text-fg-muted">{l.participants}</p>
      <ul className="mb-4 mt-2 flex list-none flex-wrap gap-2 p-0">
        {block.participants.map((p) => (
          <li key={p.key} className={chip}>
            {p.label}
          </li>
        ))}
      </ul>
      <ol className="m-0 list-none space-y-1.5 p-0">
        {block.items.map((it, i) =>
          it.type === "section" ? (
            <li key={i} className="pt-3 font-semibold text-fg">
              {it.title}
            </li>
          ) : (
            <li key={i} className={rowGrid}>
              <span className="pt-0.5 text-right font-mono text-xs text-fg-muted">
                <span className="sr-only">{l.step} </span>
                {it.n}
              </span>
              <span>
                {it.branch && (
                  <span className="mr-2 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.7rem] text-fg-muted">
                    {it.branch.kind} {it.branch.condition}
                  </span>
                )}
                <span className={mono}>{label(it.from)}</span> <span aria-hidden>{it.reply ? "⇠" : "→"}</span>
                <span className="sr-only"> {it.reply ? l.reply : "→"} </span>{" "}
                <span className={mono}>{label(it.to)}</span>
                <span className="text-fg-muted">: </span>
                {it.text}
              </span>
            </li>
          ),
        )}
      </ol>
    </Figure>
  );
}

function Pipeline({ data, l }: Readonly<{ data: Extract<DiagramData, { kind: "pipeline" }>; l: DocsDiagramLabels }>) {
  return (
    <Figure title={l.pipeline}>
      <h4 className="mb-2 mt-0 text-sm font-semibold text-fg">{l.coreChain}</h4>
      <ol className="m-0 mb-5 list-none space-y-2 p-0">
        {data.coreChain.map((c) => (
          <li key={c.interceptor} className={rowGrid}>
            <span className="pt-0.5 text-right font-mono text-xs text-fg-muted">{c.rank}</span>
            <span>
              <span className={mono}>{c.interceptor}</span> <span className="text-fg-muted">· {c.concern}</span>
              <br />
              {c.summary}
            </span>
          </li>
        ))}
      </ol>
      <h4 className="mb-2 mt-0 text-sm font-semibold text-fg">{l.configuredChain}</h4>
      <ol className="m-0 list-none space-y-2 p-0">
        {data.pipeline.map((p) => (
          <li key={p.interceptor} className={rowGrid}>
            <span className="pt-0.5 text-right font-mono text-xs text-fg-muted">{p.order}</span>
            <span>
              <span className={mono}>{p.interceptor}</span>{" "}
              <span className="text-fg-muted">
                · {p.concern} · {p.phase}
              </span>
              {!p.implemented && <span className="ml-2 text-xs text-fg-muted">({l.notBuilt})</span>}
              <br />
              {p.summary}
            </span>
          </li>
        ))}
      </ol>
    </Figure>
  );
}

function States({
  block,
  l,
}: Readonly<{ block: Extract<DiagramData, { kind: "states" }>["block"]; l: DocsDiagramLabels }>) {
  const name = (id: string) =>
    id === "start" ? l.initial : id === "end" ? l.final : (block.states.find((s) => s.id === id)?.label ?? id);
  return (
    <Figure title={l.states}>
      <ol className="m-0 list-none space-y-1.5 p-0">
        {block.transitions.map((tr, i) => (
          <li key={i} className="text-sm leading-relaxed text-fg-secondary">
            <span className={mono}>{name(tr.from)}</span> <span aria-hidden>→</span>
            <span className="sr-only"> → </span> <span className={mono}>{name(tr.to)}</span>
            <span className="text-fg-muted">: </span>
            {tr.label}
          </li>
        ))}
      </ol>
    </Figure>
  );
}

function Architecture({
  data,
  l,
}: Readonly<{ data: Extract<DiagramData, { kind: "architecture" }>; l: DocsDiagramLabels }>) {
  const { focus } = data;
  if (!focus) {
    return (
      <Figure title={l.architecture}>
        <p className="m-0 text-sm text-fg-secondary">{l.moduleMap}</p>
      </Figure>
    );
  }
  const list = (items: string[]) =>
    items.length ? (
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {items.map((m) => (
          <li key={m} className={chip}>
            {m}
          </li>
        ))}
      </ul>
    ) : (
      <p className="m-0 text-sm text-fg-muted">{l.none}</p>
    );
  return (
    <Figure title={`${l.architecture} · ${focus.id}`}>
      <p className="m-0 text-sm leading-relaxed text-fg-secondary">{focus.description}</p>
      <dl className="my-3 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-fg-muted">{l.repository}</dt>
        <dd className="m-0 font-mono text-xs text-fg">{focus.repository}</dd>
        <dt className="text-fg-muted">{l.role}</dt>
        <dd className="m-0 font-mono text-xs text-fg">{focus.role}</dd>
        <dt className="text-fg-muted">{l.owner}</dt>
        <dd className="m-0 font-mono text-xs text-fg">{focus.owner}</dd>
      </dl>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 mt-0 text-sm font-semibold text-fg">{data.runtime ? l.calls : l.uses}</h4>
          {list(data.runtime ? data.calls : data.uses)}
        </div>
        <div>
          <h4 className="mb-2 mt-0 text-sm font-semibold text-fg">{data.runtime ? l.calledBy : l.usedBy}</h4>
          {list(data.runtime ? data.calledBy : data.usedBy)}
        </div>
      </div>
    </Figure>
  );
}

function CliJourney({ data }: Readonly<{ data: Extract<DiagramData, { kind: "cli-journey" }>; l: DocsDiagramLabels }>) {
  const { t } = useTranslation();
  return (
    <Figure title={t.docs.diagrams.sequence}>
      <ol className="m-0 list-none space-y-4 p-0">
        {data.journey.map((c, i) => (
          <li key={c.command} className={rowGrid}>
            <span className="pt-0.5 text-right font-mono text-xs text-fg-muted">{i + 1}</span>
            <div>
              <p className="m-0">
                <span className={mono}>
                  {data.alias} {c.command}
                </span>
                {" — "}
                {c.description}
              </p>
              {(c.phases?.length ?? 0) > 0 && (
                <ul className="mb-0 mt-1.5 list-disc space-y-0.5 pl-5">
                  {c.phases!.map((p) => (
                    <li key={p.id}>
                      {p.title}
                      {p.detail && <span className="text-fg-muted"> ({p.detail})</span>}
                    </li>
                  ))}
                </ul>
              )}
              {(c.processes?.length ?? 0) > 0 && (
                <ul className="mb-0 mt-1.5 flex list-none flex-wrap gap-1.5 p-0">
                  {c.processes!.map((p) => (
                    <li key={p.key} className={chip}>
                      {p.label}
                      {p.port ? ` :${p.port}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
