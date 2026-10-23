"use client";

import * as React from "react";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { Field, Input, Textarea } from "@krizaka/ui/field";
import { Switch } from "@krizaka/ui/switch";
import type { EngineWords } from "@/console/core/copy/engine";
import type { RuntimeSetting, SettingValue } from "@/console/services/runtime-config.admin.api";
import { boundsText, display, draftOf, parseDraft } from "@/console/features/engine/utils/engine";
import { SettingHistory } from "./SettingHistory";

/** One setting: its description, current value, default and bounds, edited in place with validation, and its history. */
export function SettingCard({ setting, words, onSave }: Readonly<{ setting: RuntimeSetting; words: EngineWords; onSave: (key: string, value: SettingValue) => Promise<string | null> }>) {
  const [draft, setDraft] = React.useState(draftOf(setting.value));
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const [showHistory, setShowHistory] = React.useState(false);
  const id = `setting-${setting.key}`;
  const dirty = draft !== draftOf(setting.value);
  const bounds = boundsText(setting, words);

  const change = (next: string) => {
    setDraft(next);
    setError(null);
    setStatus("idle");
  };

  const submit = async () => {
    const parsed = parseDraft(setting, draft, words);
    if (!parsed.ok) return setError(parsed.error);
    setStatus("saving");
    const refusal = await onSave(setting.key, parsed.value);
    setError(refusal === null ? null : refusal || words.failed);
    setStatus(refusal === null ? "saved" : "idle");
  };

  return (
    <Card.Root className="p-5">
      <div role="group" className="flex flex-col gap-3" onKeyDown={(e) => e.key === "Enter" && e.target instanceof HTMLInputElement && dirty && void submit()}>
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-mono text-sm font-semibold text-fg">{setting.key}</h3>
          <Badge tone="neutral">{setting.type}</Badge>
        </header>
        <p className="text-sm text-fg-secondary">{setting.description}</p>
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-fg-muted">
          <div><dt className="inline">{words.current}: </dt><dd className="inline text-fg">{display(setting.value, words)}</dd></div>
          <div><dt className="inline">{words.defaultValue}: </dt><dd className="inline text-fg">{display(setting.default, words)}</dd></div>
          {bounds && <div><dt className="inline">{words.bounds}: </dt><dd className="inline text-fg">{bounds}</dd></div>}
        </dl>
        <Field.Root>
          {setting.type === "boolean" ? (
            <Switch label={setting.key} checked={draft === "true"} onCheckedChange={(on) => change(String(on))} />
          ) : (
            <>
              <Field.Label htmlFor={id}>{setting.key}</Field.Label>
              {setting.type === "list" ? (
                <Textarea id={id} rows={4} value={draft} invalid={error !== null} aria-describedby={`${id}-msg`} onChange={(e) => change(e.target.value)} />
              ) : (
                <Input id={id} inputMode="numeric" value={draft} invalid={error !== null} aria-describedby={`${id}-msg`} onChange={(e) => change(e.target.value)} />
              )}
            </>
          )}
          {setting.type === "list" && <Field.Hint>{words.listHint}</Field.Hint>}
          <Field.Error id={`${id}-msg`} role={error ? "alert" : undefined}>{error}</Field.Error>
        </Field.Root>
        {status === "saved" && <p role="status" className="text-sm text-success">{words.saved}</p>}
        <footer className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void submit()} disabled={!dirty || status === "saving"}>{status === "saving" ? words.saving : words.save}</Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => change(draftOf(setting.default))}>{words.reset}</Button>
          <Button type="button" size="sm" variant="ghost" aria-expanded={showHistory} onClick={() => setShowHistory((v) => !v)}>{showHistory ? words.hideHistory : words.history}</Button>
        </footer>
        {showHistory && <SettingHistory setting={setting} words={words} version={setting.value} />}
      </div>
    </Card.Root>
  );
}
