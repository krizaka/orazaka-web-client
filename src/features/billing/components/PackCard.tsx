"use client";

import { Icon, type IconName } from "@krizaka/orazaka-design-system";
import { formatCredits, formatPrice, type PackSummary } from "@krizaka/orazaka-shared";
import { useTranslation } from "@/core/context/LocaleContext";

interface PackCardProps {
  pack: PackSummary;
  isOwned: boolean;
  isPending: boolean;
  onSubscribe: () => void;
  onRemove: () => void;
}

/**
 * One pack on the marketplace shelf.
 *
 * An owned pack shows what it granted and how to give it up, never "Add" again —
 * the ownership state is the whole reason the catalogue and the holdings are fetched
 * together (see `usePacks`).
 *
 * The card now renders the pack's **own** identity — its icon, its localised name and
 * tagline, and the Studios it bundles — because those became catalogue data with ADR-036
 * instead of columns on a billing row. What it lists under "what you get" is Studios,
 * which is what a buyer is actually buying; raw entitlement keys were an implementation
 * detail leaking onto a marketing card.
 *
 * A pack with no price renders "—" rather than "free": `null` means the billing service
 * did not answer, and a card that says "Gratuit" during a billing restart is a price the
 * product would be held to.
 *
 * The button is blocked while its own request is in flight (ERR-126): a pack is a
 * purchase, and a double-click on a purchase is the one input race worth spending a
 * disabled state on.
 *
 * A pack the actor's entitlement already grants reads "included" and renders **no button
 * at all** (ADR-061): its installation is derived, so there is nothing to add and nothing
 * to remove. That verdict is `pack.access`, which the server decides from the kind AND the
 * entitlement snapshot — reading `kind === "TOOLKIT"` here said "included" to an actor who
 * had nothing, and then gave them no way to buy it (ADR-066). A pack billing could not
 * price is UNAVAILABLE: no button, because there is no amount to agree to.
 */
export function PackCard({
  pack,
  isOwned,
  isPending,
  onSubscribe,
  onRemove,
}: Readonly<PackCardProps>) {
  const { t } = useTranslation();
  const isIncluded = pack.access === "INCLUDED";
  const isBuyable = pack.access === "BUYABLE";

  return (
    <article className="flex flex-col gap-3 border border-border-subtle bg-surface-1 p-4">
      <header className="flex items-start justify-between gap-3">
        <hgroup className="flex items-start gap-2">
          <Icon name={pack.iconKey as IconName} size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-[14px] font-medium text-fg">{pack.label}</h3>
            {pack.tagline && (
              <p className="text-[11px] text-fg-muted">{pack.tagline}</p>
            )}
          </div>
        </hgroup>
        {(isOwned || isIncluded) && (
          <span className="inline-flex flex-shrink-0 items-center gap-1 text-[11px] text-success">
            <Icon name="check" size={12} />
            {isIncluded ? t.packs.included : t.packs.owned}
          </span>
        )}
      </header>

      <p className="text-[13px] text-fg">
        {pack.priceCents === null
          ? t.packs.priceUnavailable
          : pack.priceCents === 0
            ? t.packs.free
            : formatPrice(pack.priceCents, "EUR")}
        {pack.includedCredits !== null && pack.includedCredits > 0 && (
          <span className="text-fg-muted">
            {" · "}
            {formatCredits(pack.includedCredits)} {t.packs.includedCredits}
          </span>
        )}
      </p>

      {pack.studioKeys.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {pack.studioKeys.map((studioKey) => (
            <li
              key={studioKey}
              className="border border-border-subtle px-1.5 py-0.5 text-[11px] text-fg-muted"
            >
              {studioKey}
            </li>
          ))}
        </ul>
      )}

      {isBuyable && (
        <button
          type="button"
          onClick={isOwned ? onRemove : onSubscribe}
          disabled={isPending}
          className={
            isOwned
              ? "h-8 self-start px-3 text-[12px] font-medium text-fg-muted transition-colors duration-150 hover:text-danger disabled:opacity-50"
              : "inline-flex h-8 items-center gap-1.5 self-start border border-accent px-3 text-[12px] font-medium text-accent transition-colors duration-150 hover:bg-surface-2 disabled:opacity-50"
          }
        >
          {isPending && <Icon name="loader" size={13} className="animate-spin" />}
          {isOwned ? t.packs.remove : isPending ? t.packs.subscribing : t.packs.subscribe}
        </button>
      )}
    </article>
  );
}
