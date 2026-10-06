"use client";

import { useTranslation } from "@/core/context/LocaleContext";
import { usePacks } from "@/features/billing/hooks/usePacks";
import { PackCard } from "@/features/billing/components/PackCard";

/**
 * The packs marketplace — where a user adds a pack to their account.
 *
 * Laid out one section per category because the category exists to be browsed: a flat
 * list would make the admin's choice at entry time invisible, and a shelf nobody sees
 * is a field nobody fills in correctly.
 *
 * The shelves are **fetched**, not enumerated here. They used to be a closed enum in
 * `orazaka-shared` with their French labels written into this file, which meant adding
 * a shelf was a deploy of the web client that also had to invent a translation. A shelf
 * is a row now and it arrives already named (ADR-036).
 *
 * Empty shelves are rendered rather than hidden. A category the product has not filled
 * yet is information — it tells a returning user there is somewhere new to look — and
 * hiding it would make the page silently change shape as the catalogue grows.
 *
 * The band above the shelves holds what this actor's plan already includes, and it is
 * keyed on `access` — the server's verdict from the pack's kind AND the entitlement
 * snapshot (ADR-066). Filtering on `kind === "TOOLKIT"` here put a pack the actor is not
 * entitled to under an "Included" heading, which is the mirror of the state M1 deleted.
 * A TOOLKIT they are not entitled to now sits on its shelf with its price, like anything
 * else they can buy.
 *
 * `kind` answers what sort of thing a pack is and `category` answers for whom, so an
 * included pack is taken off the shelves rather than given a `tool` shelf of its own —
 * that shelf would be a category pretending to be a kind. The band is hidden when empty:
 * unlike a shelf, it is not somewhere new to look.
 */
export function PackMarketplace() {
  const { t, locale } = useTranslation();
  const { packs, categories, ownedKeys, isLoading, error, pendingKey, reload, subscribe, remove } =
    usePacks(locale, t.packs.loadError);

  const included = packs.filter((pack) => pack.access === "INCLUDED");
  const verticals = packs.filter((pack) => pack.access !== "INCLUDED");

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-[18px] font-medium text-[var(--text-primary)]">{t.packs.title}</h1>
        <p className="max-w-2xl text-[13px] text-[var(--text-muted)]">{t.packs.subtitle}</p>
      </header>

      {error && (
        <div className="flex items-center gap-3">
          <p className="text-[12px] text-[var(--status-error)]">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="h-7 border border-[var(--border-subtle)] px-2 text-[12px] text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--surface-2)]"
          >
            {t.packs.retry}
          </button>
        </div>
      )}

      {included.length > 0 && (
        <div className="flex flex-col gap-3">
          <header className="flex flex-col gap-0.5">
            <h2 className="text-[13px] font-medium text-[var(--text-secondary)]">
              {t.packs.includedTitle}
            </h2>
            <p className="text-[12px] text-[var(--text-muted)]">{t.packs.includedSubtitle}</p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((pack) => (
              <PackCard
                key={pack.packKey}
                pack={pack}
                isOwned={ownedKeys.has(pack.packKey)}
                isPending={pendingKey === pack.packKey}
                onSubscribe={() => subscribe(pack.packKey)}
                onRemove={() => remove(pack.packKey)}
              />
            ))}
          </div>
        </div>
      )}

      {categories.map((category) => {
        const shelf = verticals.filter((pack) => pack.categoryKey === category.categoryKey);
        return (
          <div key={category.categoryKey} className="flex flex-col gap-3">
            <h2 className="text-[13px] font-medium text-[var(--text-secondary)]">
              {category.label}
            </h2>

            {isLoading ? (
              <p className="text-[12px] text-[var(--text-muted)]">…</p>
            ) : shelf.length === 0 ? (
              <p className="text-[12px] text-[var(--text-muted)]">{t.packs.emptyCategory}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shelf.map((pack) => (
                  <PackCard
                    key={pack.packKey}
                    pack={pack}
                    isOwned={ownedKeys.has(pack.packKey)}
                    isPending={pendingKey === pack.packKey}
                    onSubscribe={() => subscribe(pack.packKey)}
                    onRemove={() => remove(pack.packKey)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
