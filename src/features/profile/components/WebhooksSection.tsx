"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { z } from "zod";
import { EyeIcon, TrashIcon } from "@krizaka/icons";
import { Icon } from "@krizaka/orazaka-design-system";
import { Badge } from "@krizaka/ui/badge";
import { Button, IconButton } from "@krizaka/ui/button";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import { Dialog } from "@krizaka/ui/dialog";
import { createKrizakaForm } from "@krizaka/ui/form";
import { SettingsSection } from "@krizaka/ui/settings-layout";
import { fill } from "@/core/context/fill";
import { useTranslation } from "@/core/context/LocaleContext";
import {
  WEBHOOK_EVENTS,
  isHttpsUrl,
  useWebhooks,
  type WebhookDelivery,
  type WebhookEndpoint,
  type WebhookEvent,
} from "@/features/profile/hooks/useWebhooks";

/** The create form: one address, and the events to be told about. Defined once; its words are keys the section translates. */
const createWebhook = createKrizakaForm({
  schema: z.object({
    url: z.string().refine(isHttpsUrl, "webhooks.url.https"),
    completed: z.boolean(),
    failed: z.boolean(),
    cancelled: z.boolean(),
  }),
  defaultValues: { url: "", completed: true, failed: true, cancelled: false },
});

const EVENT_FIELDS = { "run.completed": "completed", "run.failed": "failed", "run.cancelled": "cancelled" } as const;

function eventsOf(values: { completed: boolean; failed: boolean; cancelled: boolean }): WebhookEvent[] {
  return WEBHOOK_EVENTS.filter((event) => values[EVENT_FIELDS[event]]);
}

interface WebhooksSectionProps {
  fetchHeaders: () => Promise<Record<string, string>>;
}

/**
 * Webhooks settings: the endpoints that are told when a run is over, on the kit's DataTable (cards on a phone), with a
 * form to add one. The signing secret is shown once in a dialog (create, rotate); each endpoint has its delivery log.
 */
export function WebhooksSection({ fetchHeaders }: Readonly<WebhooksSectionProps>) {
  const { t, locale } = useTranslation();
  const w = t.webhooks;
  const dateLocale = locale === "fr" ? fr : enUS;
  const hook = useWebhooks(fetchHeaders);
  const [isCreateOpen, setCreateOpen] = React.useState(false);

  const columns = React.useMemo<DataTableColumn<WebhookEndpoint>[]>(
    () => [
      { id: "url", header: w.columns.url, type: "title", filter: "text", sortable: true, value: (e) => e.url, cell: (e) => <code className="break-all font-mono text-xs">{e.url}</code> },
      {
        id: "events",
        header: w.columns.events,
        priority: 2,
        value: (e) => e.events.map((event) => w.events[event]).join(", "),
        cell: (e) => (
          <span className="inline-flex flex-wrap gap-1">
            {e.events.map((event) => (
              <Badge key={event} tone="neutral" size="sm">
                {w.events[event]}
              </Badge>
            ))}
          </span>
        ),
      },
      {
        id: "created",
        header: w.columns.created,
        priority: 3,
        type: "date",
        sortable: true,
        value: (e) => new Date(e.createdAt),
        cell: (e) => <time dateTime={e.createdAt}>{formatDistanceToNow(new Date(e.createdAt), { addSuffix: true, locale: dateLocale })}</time>,
      },
      {
        id: "actions",
        header: w.columns.actions,
        headerHidden: true,
        align: "end",
        hideable: false,
        card: "hidden",
        cell: (e) => (
          <span className="inline-flex items-center gap-0.5">
            <IconButton variant="ghost" size="sm" label={w.actions.log} onClick={() => void hook.openLog(e)}>
              <EyeIcon size={15} />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              label={w.actions.rotate}
              disabled={hook.isSaving}
              onClick={() => {
                if (window.confirm(w.rotateConfirm)) void hook.rotate(e);
              }}
            >
              <Icon name="key" size={15} />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              label={w.actions.delete}
              onClick={() => {
                if (window.confirm(w.deleteConfirm)) void hook.remove(e);
              }}
            >
              <TrashIcon size={15} />
            </IconButton>
          </span>
        ),
      },
    ],
    // hook.* are stable per render of this component; the table only needs the words and the locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [w, dateLocale, hook.isSaving],
  );

  const labels = {
    loading: w.loading,
    empty: w.emptyTitle,
    details: t.jobsTable.details,
    expandRow: (name: string) => fill(t.jobsTable.expandRow, { name }),
    showMore: (name: string) => fill(t.jobsTable.showMore, { name }),
    results: (n: number) => (n === 1 ? t.jobsTable.resultsOne : fill(t.jobsTable.results, { n })),
    filters: t.jobsTable.filters,
    clearFilters: t.jobsTable.clearFilters,
    removeFilter: (label: string) => fill(t.jobsTable.removeFilter, { label }),
    activeFilter: (header: string, value: string) => fill(t.jobsTable.activeFilter, { header, value }),
    search: (header: string) => fill(t.jobsTable.search, { header }),
  };

  return (
    <SettingsSection
      variant="flat"
      id="webhooks"
      title={w.title}
      description={w.subtitle}
      footer={
        <Button type="button" size="sm" variant="secondary" onClick={() => setCreateOpen(true)}>
          {w.create}
        </Button>
      }
    >
      <DataTable
        caption={w.caption}
        rows={hook.endpoints}
        columns={columns}
        getRowId={(e) => e.id}
        rowLabel={(e) => e.url}
        loading={hook.isLoading}
        empty={
          <div className="space-y-1 p-6 text-center">
            <p className="text-sm font-medium text-fg">{w.emptyTitle}</p>
            <p className="text-xs text-fg-muted">{w.emptyDesc}</p>
          </div>
        }
        labels={labels}
      />
      <p className="py-3 text-xs text-fg-muted">{w.verifyHint}</p>

      <Dialog.Root
        open={isCreateOpen}
        onOpenChange={(next) => {
          if (!next) {
            setCreateOpen(false);
            hook.clearError();
          }
        }}
      >
        <Dialog.Content closeLabel={w.cancel}>
          <Dialog.Header>
            <Dialog.Title>{w.create}</Dialog.Title>
            <Dialog.Description>{w.urlHelp}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <CreateWebhookForm
              error={hook.error}
              onSubmit={async (url, events) => {
                if (await hook.create(url, events)) setCreateOpen(false);
              }}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={hook.revealed !== null} onOpenChange={(next) => !next && hook.dismissRevealed()}>
        <Dialog.Content closeLabel={w.done}>
          <Dialog.Header>
            <Dialog.Title>{w.revealTitle}</Dialog.Title>
            <Dialog.Description>{hook.revealed?.url}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>{hook.revealed && <RevealSecret secret={hook.revealed.secret} onDone={hook.dismissRevealed} />}</Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={hook.log !== null} onOpenChange={(next) => !next && hook.closeLog()}>
        <Dialog.Content closeLabel={w.close}>
          <Dialog.Header>
            <Dialog.Title>{w.logTitle}</Dialog.Title>
            <Dialog.Description>{hook.log?.endpoint.url}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>{hook.log && <DeliveryLog deliveries={hook.log.deliveries} />}</Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </SettingsSection>
  );
}

/** The add-endpoint form, remounted at every opening so it starts clean. */
function CreateWebhookForm({
  error,
  onSubmit,
}: Readonly<{ error: "none" | "url" | "limit" | "generic"; onSubmit: (url: string, events: WebhookEvent[]) => Promise<void> }>) {
  const { t } = useTranslation();
  const w = t.webhooks;
  const words: Record<string, string> = { "webhooks.url.https": w.invalidUrl };
  const form = createWebhook.useForm({
    i18n: { t: (key) => words[key] },
    onSubmit: async (values) => {
      await onSubmit(values.url.trim(), eventsOf(values));
    },
  });
  const message = error === "limit" ? w.limitReached : error === "url" ? w.invalidUrl : error === "generic" ? w.createError : null;
  return (
    <form.Form aria-label={w.create}>
      <form.TextField name="url" label={w.urlLabel} type="url" placeholder={w.urlPlaceholder} autoComplete="off" />
      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-fg-secondary">{w.eventsLabel}</legend>
        <form.Checkbox name="completed" label={w.events["run.completed"]} />
        <form.Checkbox name="failed" label={w.events["run.failed"]} />
        <form.Checkbox name="cancelled" label={w.events["run.cancelled"]} />
      </fieldset>
      {message && (
        <p role="alert" className="text-xs text-danger">
          {message}
        </p>
      )}
      <form.FormError />
      <form.Submit>{w.createCta}</form.Submit>
    </form.Form>
  );
}

/** The signing secret, shown once, with copy. */
function RevealSecret({ secret, onDone }: Readonly<{ secret: string; onDone: () => void }>) {
  const { t } = useTranslation();
  const w = t.webhooks;
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
    } catch {
      // The secret stays selectable in the field.
    }
  };
  return (
    <div className="space-y-4">
      <p className="text-xs text-fg-muted">{w.revealDesc}</p>
      <div className="flex items-center gap-2">
        <code data-testid="webhook-secret" className="min-w-0 flex-1 truncate rounded-md border border-border-subtle bg-surface-2 px-3 py-2 font-mono text-xs text-fg">
          {secret}
        </code>
        <Button type="button" variant="secondary" size="sm" onClick={copy}>
          {copied ? w.copied : w.copy}
        </Button>
      </div>
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={onDone}>
          {w.done}
        </Button>
      </div>
    </div>
  );
}

const STATUS_TONE: Record<WebhookDelivery["status"], "neutral" | "success" | "danger"> = { PENDING: "neutral", DELIVERED: "success", DEAD: "danger" };

/** The delivery log of one endpoint, newest first. */
function DeliveryLog({ deliveries }: Readonly<{ deliveries: WebhookDelivery[] }>) {
  const { t, locale } = useTranslation();
  const w = t.webhooks;
  const dateLocale = locale === "fr" ? fr : enUS;
  if (deliveries.length === 0) return <p className="py-4 text-sm text-fg-secondary">{w.logEmpty}</p>;
  const columns: DataTableColumn<WebhookDelivery>[] = [
    { id: "event", header: w.logColumns.event, type: "title", value: (d) => w.events[d.event], cell: (d) => w.events[d.event] },
    {
      id: "status",
      header: w.logColumns.status,
      type: "status",
      value: (d) => w.status[d.status],
      cell: (d) => (
        <Badge tone={STATUS_TONE[d.status]} size="sm">
          {w.status[d.status]}
        </Badge>
      ),
    },
    { id: "attempts", header: w.logColumns.attempts, priority: 3, type: "number", align: "end", value: (d) => d.attempts },
    { id: "answer", header: w.logColumns.answer, priority: 2, value: (d) => (d.lastHttpStatus ? String(d.lastHttpStatus) : (d.lastError ?? "")), cell: (d) => d.lastHttpStatus ?? d.lastError ?? "—" },
    {
      id: "when",
      header: w.logColumns.when,
      priority: 3,
      type: "date",
      value: (d) => new Date(d.createdAt),
      cell: (d) => formatDistanceToNow(new Date(d.createdAt), { addSuffix: true, locale: dateLocale }),
    },
  ];
  return (
    <DataTable
      caption={w.logTitle}
      rows={deliveries}
      columns={columns}
      getRowId={(d) => d.id}
      rowLabel={(d) => w.events[d.event]}
      labels={{ loading: w.loading, empty: w.logEmpty }}
    />
  );
}
