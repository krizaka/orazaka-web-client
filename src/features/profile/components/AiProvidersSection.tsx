"use client";

import * as React from "react";
import { Button, Dialog, Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { useAiProviders } from "@/features/profile/hooks/useAiProviders";
import { findProvider, PROVIDERS } from "./AiProviderLogos";
import { ProviderConnectionForm } from "./AiProviderConnectionForm";
import { ProviderEmptyState, ProviderRow } from "./AiProvidersParts";

import { Card } from "@krizaka/ui/card";

interface AiProvidersSectionProps {
  fetchHeaders: () => Promise<Record<string, string>>;
}

/**
 * AI providers manager — a premium list of the user's configured provider
 * credentials with add / edit / delete actions. Adding or editing opens a modal
 * ({@link Dialog}); all data + lifecycle live in {@link useAiProviders}.
 */
export function AiProvidersSection({
  fetchHeaders,
}: Readonly<AiProvidersSectionProps>) {
  const { t } = useTranslation();
  const {
    isLoading,
    configuredIds,
    availableIds,
    modal,
    draftKey,
    isRevealed,
    isSaving,
    error,
    openAdd,
    openEdit,
    selectProvider,
    closeModal,
    setDraftKey,
    toggleReveal,
    submit,
    remove,
  } = useAiProviders(fetchHeaders);

  const canAdd = availableIds.length > 0;
  const selected = modal.providerId
    ? findProvider(modal.providerId)
    : undefined;
  const pickable =
    modal.mode === "edit"
      ? PROVIDERS.filter((p) => p.id === modal.providerId)
      : PROVIDERS.filter((p) => availableIds.includes(p.id));

  return (
    <Card.Root className="bg-surface-1 shadow-sm">
      <Card.Body padding="lg" className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <Card.Title className="line-clamp-none tracking-tight group-hover:text-fg flex items-center gap-2 text-base font-semibold text-fg">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon name="key" size={16} />
            </span>
            {t.providers.title}
          </Card.Title>
          <Card.Description className="line-clamp-none text-sm text-fg-secondary">
            {t.providers.subtitle}
          </Card.Description>
        </div>
        {canAdd && configuredIds.length > 0 && (
          <Button
            type="button"
            size="sm"
            onClick={openAdd}
            className="shrink-0 gap-1.5"
          >
            <Icon name="plus" size={15} />
            {t.providers.addConnection}
          </Button>
        )}
      </Card.Body>

      <Card.Body padding="lg" className="block pt-0">
        {(() => {
          if (isLoading) {
            return (
              <p className="text-xs text-fg-muted">
                {t.providers.loading}
              </p>
            );
          }
          if (configuredIds.length === 0) {
            return <ProviderEmptyState onAdd={openAdd} />;
          }
          return (
            <>
              <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle">
                {configuredIds.map((id) => {
                  const provider = findProvider(id);
                  if (!provider) return null;
                  return (
                    <ProviderRow
                      key={id}
                      provider={provider}
                      onEdit={() => openEdit(id)}
                      onDelete={() => remove(id)}
                      disabled={isSaving}
                    />
                  );
                })}
              </ul>
              {!canAdd && (
                <p className="mt-3 text-center text-xs text-fg-muted">
                  {t.providers.allConfigured}
                </p>
              )}
            </>
          );
        })()}
      </Card.Body>

      <Dialog
        open={modal.mode !== "closed"}
        onClose={closeModal}
        closeLabel={t.providers.cancel}
        title={
          modal.mode === "edit"
            ? t.providers.editConnection
            : t.providers.addConnection
        }
        description={t.providers.modalSubtitle}
      >
        {modal.mode !== "closed" && (
          <ProviderConnectionForm
            mode={modal.mode}
            pickable={pickable}
            selected={selected}
            onSelect={selectProvider}
            draftKey={draftKey}
            onKeyChange={setDraftKey}
            isRevealed={isRevealed}
            onToggleReveal={toggleReveal}
            isSaving={isSaving}
            error={error}
            onCancel={closeModal}
            onSubmit={submit}
          />
        )}
      </Dialog>
    </Card.Root>
  );
}
