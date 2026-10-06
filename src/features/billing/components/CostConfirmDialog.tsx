"use client";

import { Button, Dialog } from "@krizaka/orazaka-design-system";
import { formatCredits } from "@krizaka/orazaka-shared";
import { useCostEstimate } from "@/features/billing/hooks/useCostEstimate";

export interface CostConfirmDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** The capability about to run. */
  capability: string;
  /** The resolved model, when the user picked one. */
  modelName?: string | null;
  /** What the user is about to do, in their words. */
  actionLabel: string;
  /** Proceed. */
  onConfirm: () => void;
  /** Back out. */
  onCancel: () => void;
}

/**
 * Shows what an action costs before the user commits to it.
 *
 * The design states this is not a UI nicety (§12): an unexpected debit on a job
 * the user did not know was expensive is the number-one support ticket in credit
 * products. The figure is the pricebook's own estimate — the same one the hold
 * will reserve — so the quote and the charge cannot disagree.
 *
 * When the estimate cannot be fetched the dialog still confirms, without a price.
 * Blocking the action would turn a billing hiccup into an outage of the product;
 * showing a guessed number would be worse than showing none.
 */
export function CostConfirmDialog({
  open,
  capability,
  modelName,
  actionLabel,
  onConfirm,
  onCancel,
}: CostConfirmDialogProps) {
  const { estimate, isLoading } = useCostEstimate(open ? capability : null, modelName);

  const unaffordable = estimate ? !estimate.affordable : false;

  return (
    <Dialog open={open} onClose={onCancel} title={actionLabel}>
      <div className="space-y-4">
        {isLoading && (
          <p className="text-sm text-[var(--text-muted)]">Estimation du coût…</p>
        )}

        {!isLoading && estimate && (
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-primary)]">
              Cette action coûtera environ{" "}
              <strong>{formatCredits(estimate.estimateCredits)} crédits</strong>.
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Solde disponible : {formatCredits(estimate.availableCredits)} crédits.
            </p>
            {unaffordable && (
              <p className="text-sm text-[var(--danger)]">
                Solde insuffisant — rechargez ou changez d’offre pour continuer.
              </p>
            )}
          </div>
        )}

        {!isLoading && !estimate && (
          <p className="text-sm text-[var(--text-muted)]">
            Le coût n’a pas pu être estimé. L’action reste possible et sera facturée
            à la consommation réelle.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={unaffordable}>
            Confirmer
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
