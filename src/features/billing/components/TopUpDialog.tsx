"use client";

import { useEffect, useState } from "react";
import { Button, Dialog } from "@krizaka/orazaka-design-system";
import { BillingApi } from "@/services/billing.api";
import { formatCredits, formatPrice, type Plan } from "@krizaka/orazaka-shared";

export interface TopUpDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Close it. */
  onClose: () => void;
}

/**
 * The way out of an empty balance.
 *
 * Shows the plans rather than a credit-pack picker, because the local phase sells
 * no packs yet: `billing_pack` exists but nothing links an actor to one, so
 * offering to buy one would be a button with nothing behind it. Upgrading is the
 * remedy that actually works today, and the refusal payload says so — the server
 * only offers `top_up_credits` to actors whose plan permits it.
 */
export function TopUpDialog({ open, onClose }: TopUpDialogProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(true);
      BillingApi.fetchPlans()
        .then((loaded) => setPlans(loaded.filter((plan) => plan.isPublic && plan.isActive)))
        .catch(() => setPlans([]))
        .finally(() => setIsLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} title="Recharger vos crédits">
      <div className="space-y-4">
        {isLoading && <p className="text-sm text-[var(--text-muted)]">Chargement…</p>}

        {!isLoading && plans.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            Aucune offre disponible pour le moment.
          </p>
        )}

        <ul className="space-y-2">
          {plans.map((plan) => (
            <li
              key={plan.planKey}
              className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{plan.label}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatCredits(plan.monthlyCreditGrant)} crédits / mois
                </p>
              </div>
              <span className="text-sm text-[var(--text-primary)]">
                {formatPrice(plan.priceCents, plan.currency)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
