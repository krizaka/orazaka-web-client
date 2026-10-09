"use client";

import { Button, Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { ProviderGlyph, type ProviderConfig } from "./AiProviderLogos";

const MASK = "••••••••••••";

/* ─── Configured provider row (list item) ─────────────────────────────────── */
export function ProviderRow({
  provider,
  onEdit,
  onDelete,
  disabled,
}: Readonly<{
  provider: ProviderConfig;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}>) {
  const { t } = useTranslation();
  return (
    <li className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2">
      <ProviderGlyph provider={provider} />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-fg">
          {provider.name}
        </h4>
        <p className="flex items-center gap-1.5 text-xs text-fg-secondary">
          <Icon
            name="checkCircle"
            size={13}
            className="text-success"
          />
          <span className="text-success">
            {t.providers.connected}
          </span>
          <span className="font-mono text-fg-muted">{MASK}</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          aria-label={`${t.providers.editConnection} — ${provider.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg disabled:opacity-50"
        >
          <Icon name="edit" size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label={`${t.providers.deleteProvider} — ${provider.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-danger/12 hover:text-danger disabled:opacity-50"
        >
          <Icon name="trash" size={16} />
        </button>
      </div>
    </li>
  );
}

/* ─── Empty state (no provider configured) ────────────────────────────────── */
export function ProviderEmptyState({ onAdd }: Readonly<{ onAdd: () => void }>) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-default px-6 py-10 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon name="key" size={22} />
      </span>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-fg">
          {t.providers.emptyTitle}
        </h4>
        <p className="mx-auto max-w-xs text-xs text-fg-secondary">
          {t.providers.emptyDesc}
        </p>
      </div>
      <Button type="button" size="sm" onClick={onAdd} className="mt-1 gap-1.5">
        <Icon name="plus" size={15} />
        {t.providers.emptyCta}
      </Button>
    </div>
  );
}
