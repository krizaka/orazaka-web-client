"use client";

import * as React from "react";
import Link from "next/link";
import { Alert } from "@krizaka/ui/alert";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { Field, Input } from "@krizaka/ui/field";
import { fill } from "@/console/core/copy/engine";
import { featureToolsCopy, type FeatureToolsLocale, type FeatureToolsWords } from "@/console/core/copy/featureTools";
import { useFeatureTools } from "@/console/features/engine/hooks/useFeatureTools";
import { parseRounds } from "@/console/features/engine/utils/featureTools";
import type { ToolBound } from "@/console/services/feature-tools.admin.api";

type Range = { min: number; max: number };
type Save = (featureKey: string, rounds: number) => Promise<string | null>;

/** The page language (`<html lang>`), French or English. */
const pageLocale = (): FeatureToolsLocale => (typeof document !== "undefined" && document.documentElement.lang.toLowerCase().startsWith("fr") ? "fr" : "en");

/** One bound, edited in place: the rounds typed are checked against the server's range before they are sent. */
function BoundRow({ bound, range, words, onSave, onRemove }: Readonly<{ bound: ToolBound; range: Range; words: FeatureToolsWords; onSave: Save; onRemove: (featureKey: string) => Promise<string | null> }>) {
  const [draft, setDraft] = React.useState(String(bound.maxToolRounds));
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const id = `bound-${bound.featureKey}`;
  const dirty = draft !== String(bound.maxToolRounds);

  const submit = async () => {
    const parsed = parseRounds(draft, range, words);
    if (!parsed.ok) return setError(parsed.error);
    setStatus("saving");
    const refusal = await onSave(bound.featureKey, parsed.value);
    setError(refusal === null ? null : refusal || words.failed);
    setStatus(refusal === null ? "saved" : "idle");
  };

  const remove = async () => {
    setStatus("saving");
    const refusal = await onRemove(bound.featureKey);
    setError(refusal === null ? null : refusal || words.failed);
    setStatus("idle");
  };

  return (
    <Card.Root className="p-5">
      <div data-bound={bound.featureKey} className="flex flex-col gap-3">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-mono text-sm font-semibold text-fg">{bound.isDefault ? words.defaultRow : bound.featureKey}</h3>
          {bound.isDefault && <Badge tone="neutral">*</Badge>}
        </header>
        <Field.Root>
          <Field.Label htmlFor={id}>{words.rounds}</Field.Label>
          <Input id={id} inputMode="numeric" value={draft} invalid={error !== null} disabled={status === "saving"} aria-describedby={error !== null ? `${id}-msg` : undefined} onKeyDown={(e) => e.key === "Enter" && dirty && void submit()} onChange={(e) => { setDraft(e.target.value); setError(null); setStatus("idle"); }} />
          <Field.Hint>{fill(words.range, range)}</Field.Hint>
          {error !== null && <Field.Error id={`${id}-msg`}>{error}</Field.Error>}
        </Field.Root>
        {status === "saved" && <output className="text-sm text-success">{words.saved}</output>}
        <footer className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void submit()} disabled={!dirty || status === "saving"}>{status === "saving" ? words.saving : words.save}</Button>
          {!bound.isDefault && <Button type="button" size="sm" variant="secondary" onClick={() => void remove()} disabled={status === "saving"}>{words.remove}</Button>}
        </footer>
      </div>
    </Card.Root>
  );
}

/** Adds the bound of a feature that has none yet. */
function AddBound({ range, words, onSave }: Readonly<{ range: Range; words: FeatureToolsWords; onSave: Save }>) {
  const [key, setKey] = React.useState("");
  const [rounds, setRounds] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    const featureKey = key.trim();
    if (featureKey === "") return setError(words.invalidKey);
    const parsed = parseRounds(rounds, range, words);
    if (!parsed.ok) return setError(parsed.error);
    setBusy(true);
    const refusal = await onSave(featureKey, parsed.value);
    setBusy(false);
    setError(refusal === null ? null : refusal || words.failed);
    if (refusal === null) {
      setKey("");
      setRounds("");
    }
  };

  return (
    <Card.Root className="p-5">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-fg">{words.addTitle}</h3>
        <Field.Root>
          <Field.Label htmlFor="bound-new-key">{words.featureKey}</Field.Label>
          <Input id="bound-new-key" value={key} disabled={busy} onChange={(e) => { setKey(e.target.value); setError(null); }} />
          <Field.Hint>{words.featureKeyHint}</Field.Hint>
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="bound-new-rounds">{words.rounds}</Field.Label>
          <Input id="bound-new-rounds" inputMode="numeric" value={rounds} disabled={busy} invalid={error !== null} aria-describedby={error !== null ? "bound-new-msg" : undefined} onChange={(e) => { setRounds(e.target.value); setError(null); }} />
          {error !== null && <Field.Error id="bound-new-msg">{error}</Field.Error>}
        </Field.Root>
        <footer><Button type="button" size="sm" onClick={() => void submit()} disabled={busy}>{words.add}</Button></footer>
      </div>
    </Card.Root>
  );
}

/** The per-feature tool-round bounds, edited in place by the administrator, and the feature routes (read only). */
export function FeatureToolsScreen({ locale }: Readonly<{ locale?: FeatureToolsLocale }>) {
  const words = featureToolsCopy[locale ?? pageLocale()];
  const tools = useFeatureTools();
  const range = tools.bounds ? { min: tools.bounds.min, max: tools.bounds.max } : null;

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <Link href="/console/engine" className="text-sm text-fg-secondary underline-offset-4 hover:underline">{words.back}</Link>
        <h1 className="font-display text-3xl font-bold tracking-tight text-fg">{words.title}</h1>
        <p className="max-w-3xl text-sm text-fg-secondary">{words.lead}</p>
      </header>
      {tools.hasError && !tools.isLoading && (
        <Alert tone="warning" action={<Button variant="secondary" size="sm" onClick={tools.reload}>{words.retry}</Button>}>{words.error}</Alert>
      )}
      {tools.isLoading && <output className="text-sm text-fg-secondary">{words.loading}</output>}
      {range && tools.bounds && (
        <section aria-labelledby="tools-bounds" className="flex flex-col gap-3">
          <h2 id="tools-bounds" className="text-lg font-semibold text-fg">{words.boundsTitle}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {tools.bounds.bounds.map((bound) => (
              <BoundRow key={bound.featureKey} bound={bound} range={range} words={words} onSave={tools.save} onRemove={tools.remove} />
            ))}
            <AddBound range={range} words={words} onSave={tools.save} />
          </div>
        </section>
      )}
      <section aria-labelledby="tools-routes" className="flex flex-col gap-3">
        <h2 id="tools-routes" className="text-lg font-semibold text-fg">{words.routesTitle}</h2>
        <p className="text-sm text-fg-secondary">{words.routesLead}</p>
        {tools.routesFailed && <Alert tone="warning">{words.routesError}</Alert>}
        {!tools.routesFailed && tools.routes.length === 0 && !tools.isLoading && <p className="text-sm text-fg-muted">{words.routesEmpty}</p>}
        <ul className="grid gap-3 lg:grid-cols-2">
          {tools.routes.map((route) => (
            <li key={route.featureKey} data-route={route.featureKey}>
              <Card.Root className="flex flex-col gap-2 p-4">
                <span className="font-mono text-sm font-semibold text-fg">{route.featureKey}</span>
                <ol className="flex flex-wrap gap-2">
                  {route.models.map((model, i) => <li key={model}><Badge tone={i === 0 ? "accent" : "neutral"}>{model}</Badge></li>)}
                </ol>
              </Card.Root>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
