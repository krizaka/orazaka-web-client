"use client";

import { useState } from "react";
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { useTranslation } from "@/core/context/LocaleContext";
import { useRegulated } from "@/features/studio/consent/useRegulated";
import { StudioApi } from "@/services/studio.api";
import type { Installation } from "@krizaka/orazaka-shared";

interface ConsentNoticeProps {
  packKey: string | null;
  installation: Installation | undefined;
  onChanged: () => void;
}

/**
 * What a wellbeing (REGULATED) Studio's page says about consent, and the way out.
 *
 * Before the first run: a plain note that consent will be asked. Once installed (the install is where the service
 * records the consent, its version, the age attestation and the region): that the person agreed, and « Withdraw my
 * consent ». Withdrawing uninstalls: the Studio stops at once and agreeing again is asked at the next run, because
 * the service refuses any install without it. Nothing here claims an erasure the service does not offer: entries
 * live no longer than the retention in the statement.
 */
export function ConsentNotice({ packKey, installation, onChanged }: Readonly<ConsentNoticeProps>) {
  const { t } = useTranslation();
  const regulated = useRegulated(packKey);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  if (!regulated) return null;

  const withdraw = async () => {
    if (!installation) return;
    setBusy(true);
    setFailed(null);
    try {
      await StudioApi.uninstall(installation.id);
      setAsking(false);
      onChanged();
    } catch (caught) {
      setFailed(caught instanceof Error ? caught.message : t.studio.loadError);
    } finally {
      setBusy(false);
    }
  };

  if (!installation || installation.status === "REVOKED") {
    return <p className="max-w-2xl text-xs text-fg-secondary">{t.consent.asked}</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-fg-secondary">
      <span>{t.consent.givenTitle}</span>
      <Button variant="ghost" size="sm" onClick={() => setAsking(true)}>{t.consent.withdraw}</Button>
      <Dialog.Root open={asking} onOpenChange={(next) => !next && !busy && setAsking(false)}>
        <Dialog.Content closeLabel={t.consent.close}>
          <Dialog.Header>
            <Dialog.Title>{t.consent.withdrawTitle}</Dialog.Title>
            <Dialog.Description>{t.consent.withdrawBody}</Dialog.Description>
          </Dialog.Header>
          {failed && <Dialog.Body><p role="alert" className="text-xs text-fg-danger">{failed}</p></Dialog.Body>}
          <Dialog.Footer>
            <Button variant="ghost" size="sm" onClick={() => setAsking(false)} disabled={busy}>{t.consent.keep}</Button>
            <Button size="sm" onClick={() => void withdraw()} loading={busy}>{busy ? t.consent.withdrawing : t.consent.withdrawConfirm}</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
