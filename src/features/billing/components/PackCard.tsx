"use client";

import { CheckIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { CatalogueIcon } from "@/components/icons/CatalogueIcon";
import { formatCredits, formatPrice, type PackSummary } from "@krizaka/orazaka-shared";
import { useTranslation } from "@/core/context/LocaleContext";

interface PackCardProps {
  pack: PackSummary;
  isOwned: boolean;
  isPending: boolean;
  onSubscribe: () => void;
  onRemove: () => void;
  /** The Studios of the catalogue by key — their name and icon, in the reader's language. */
  studios: ReadonlyMap<string, { label: string; iconKey: string }>;
  /** Its place on the shelf: the cards arrive one after the other. */
  index?: number;
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
  studios,
  index,
}: Readonly<PackCardProps>) {
  const { t } = useTranslation();
  const isIncluded = pack.access === "INCLUDED";
  const isBuyable = pack.access === "BUYABLE";
  let price = formatPrice(pack.priceCents ?? 0, "EUR");
  if (pack.priceCents === null) price = t.packs.priceUnavailable;
  else if (pack.priceCents === 0) price = t.packs.free;

  return (
    <Card.Root reveal={index} interactive>
      <Card.Body className="gap-4">
        <header className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-fg-accent ring-1 ring-inset ring-accent/25">
            <CatalogueIcon iconKey={pack.iconKey} size={22} />
          </span>
          {(isOwned || isIncluded) && (
            <Badge tone="success">
              <CheckIcon size={12} />
              {isIncluded ? t.packs.included : t.packs.owned}
            </Badge>
          )}
        </header>

        <div className="flex flex-col gap-1">
          <Card.Title className="line-clamp-none text-[15px]">{pack.label}</Card.Title>
          {pack.tagline && <Card.Description className="line-clamp-none text-[13px] leading-snug">{pack.tagline}</Card.Description>}
        </div>

        <p className="flex items-baseline gap-1.5 text-sm text-fg">
          <span className="font-display text-xl font-bold tabular-nums">{price}</span>
          {pack.includedCredits !== null && pack.includedCredits > 0 && (
            <span className="text-xs text-fg-muted">
              · {formatCredits(pack.includedCredits)} {t.packs.includedCredits}
            </span>
          )}
        </p>

        {pack.studioKeys.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{t.showcase.packs.studiosIncluded}</span>
            <ul className="flex flex-col gap-1.5">
              {pack.studioKeys.map((studioKey) => {
                const studio = studios.get(studioKey);
                return (
                  <li key={studioKey} className="flex items-center gap-2 text-[13px] text-fg-secondary">
                    <CatalogueIcon iconKey={studio?.iconKey} size={16} className="flex-shrink-0 text-fg-accent" />
                    {studio?.label ?? studioKey}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isBuyable && (
          <Card.Footer>
            {isOwned ? (
              <Button variant="ghost" size="sm" onClick={onRemove} loading={isPending}>
                {t.packs.remove}
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onSubscribe} loading={isPending}>
                {isPending ? t.packs.subscribing : t.packs.subscribe}
              </Button>
            )}
          </Card.Footer>
        )}
      </Card.Body>
    </Card.Root>
  );
}
