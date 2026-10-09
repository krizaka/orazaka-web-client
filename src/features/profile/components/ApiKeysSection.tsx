"use client";

import * as React from "react";
import { Button, Dialog, Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import {
  MAX_API_KEYS,
  useApiKeys,
} from "@/features/profile/hooks/useApiKeys";
import {
  ApiKeyRow,
  ApiKeysEmptyState,
  CreateApiKeyForm,
  RevealKeyPanel,
} from "./ApiKeysParts";

import { Card } from "@krizaka/ui/card";

interface ApiKeysSectionProps {
  fetchHeaders: () => Promise<Record<string, string>>;
}

/**
 * Inbound API keys manager — lists the user's Personal Access Tokens with create
 * and revoke actions. Creating opens a modal ({@link Dialog}); the fresh secret is
 * then surfaced once through a reveal dialog. All data + lifecycle live in
 * {@link useApiKeys}.
 */
export function ApiKeysSection({
  fetchHeaders,
}: Readonly<ApiKeysSectionProps>) {
  const { t } = useTranslation();
  const {
    isLoading,
    keys,
    canCreate,
    isCreateOpen,
    draftName,
    isSaving,
    error,
    generated,
    openCreate,
    closeCreate,
    setDraftName,
    submit,
    dismissGenerated,
    remove,
  } = useApiKeys(fetchHeaders);

  return (
    <Card.Root className="bg-surface-1 shadow-sm">
      <Card.Body padding="lg" className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <Card.Title className="line-clamp-none tracking-tight group-hover:text-fg flex items-center gap-2 text-base font-semibold text-fg">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon name="key" size={16} />
            </span>
            {t.apiKeys.title}
          </Card.Title>
          <Card.Description className="line-clamp-none text-sm text-fg-secondary">
            {t.apiKeys.subtitle}
          </Card.Description>
        </div>
        {keys.length > 0 && (
          <Button
            type="button"
            size="sm"
            onClick={openCreate}
            disabled={!canCreate}
            className="shrink-0 gap-1.5"
          >
            <Icon name="plus" size={15} />
            {t.apiKeys.create}
          </Button>
        )}
      </Card.Body>

      <Card.Body padding="lg" className="block pt-0">
        {(() => {
          if (isLoading) {
            return (
              <p className="text-xs text-fg-muted">
                {t.apiKeys.loading}
              </p>
            );
          }
          if (keys.length === 0) {
            return <ApiKeysEmptyState onCreate={openCreate} />;
          }
          return (
            <>
              <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle">
                {keys.map((apiKey) => (
                  <ApiKeyRow
                    key={apiKey.id}
                    apiKey={apiKey}
                    onDelete={() => remove(apiKey.id)}
                    disabled={isSaving}
                  />
                ))}
              </ul>
              <p className="mt-3 text-center text-xs text-fg-muted">
                {keys.length} / {MAX_API_KEYS} {t.apiKeys.limitCaption}
              </p>
            </>
          );
        })()}
      </Card.Body>

      <Dialog
        open={isCreateOpen}
        onClose={closeCreate}
        closeLabel={t.apiKeys.cancel}
        title={t.apiKeys.create}
        description={t.apiKeys.subtitle}
      >
        <CreateApiKeyForm
          draftName={draftName}
          onNameChange={setDraftName}
          isSaving={isSaving}
          error={error}
          onCancel={closeCreate}
          onSubmit={submit}
        />
      </Dialog>

      <Dialog
        open={generated !== null}
        onClose={dismissGenerated}
        closeLabel={t.apiKeys.done}
        title={t.apiKeys.revealTitle}
        description={generated?.name}
      >
        {generated && (
          <RevealKeyPanel generated={generated} onDone={dismissGenerated} />
        )}
      </Dialog>
    </Card.Root>
  );
}
