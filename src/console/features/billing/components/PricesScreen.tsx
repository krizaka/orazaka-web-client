"use client";

import { Alert } from "@krizaka/ui/alert";
import { Button } from "@krizaka/ui/button";
import { PriceCatalogueEditor, type PriceFigures } from "@krizaka/ui/price-catalogue-editor";
import { pricesCopy, type PricesLocale } from "@/console/core/copy/prices";
import { PricesAdminApi } from "@/console/services/prices.admin.api";
import { effectiveInstant } from "@/console/features/billing/utils/prices";
import { usePrices } from "@/console/features/billing/hooks/usePrices";

const pageLocale = (): PricesLocale => (typeof document !== "undefined" && document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "fr");

/** The price catalogue: each entry editable from a date (@krizaka/ui's PriceCatalogueEditor); billing is the only holder of the figures. */
export function PricesScreen({ locale }: Readonly<{ locale?: PricesLocale }>) {
  const lang = locale ?? pageLocale();
  const words = pricesCopy[lang];
  const { prices, isLoading, hasError, reload, loadHistory, refresh } = usePrices();

  const onSchedule = async (key: string, change: PriceFigures, day: string) => {
    const now = new Date();
    let from: string;
    try {
      from = effectiveInstant(day, now.toISOString().slice(0, 10), now);
    } catch (error) {
      return { ok: false as const, message: error instanceof Error ? error.message : "" };
    }
    const result = await PricesAdminApi.schedule(key, change, from);
    if (result.ok) await refresh();
    return result;
  };

  return (
    <section className="flex flex-col gap-4" aria-labelledby="prices-title">
      <header className="flex flex-col gap-1">
        <h2 id="prices-title" className="text-lg font-semibold text-fg">{words.title}</h2>
        <p className="max-w-3xl text-sm text-fg-secondary">{words.lead}</p>
      </header>
      {hasError && !isLoading && (
        <Alert tone="warning" action={<Button variant="secondary" size="sm" onClick={reload}>{words.retry}</Button>}>{words.error}</Alert>
      )}
      {isLoading && <output className="text-sm text-fg-secondary">{words.loading}</output>}
      {prices && (
        <PriceCatalogueEditor
          prices={prices}
          words={words.editor}
          locale={lang === "fr" ? "fr-CA" : "en-CA"}
          today={new Date().toISOString().slice(0, 10)}
          onSchedule={onSchedule}
          loadHistory={loadHistory}
          headingLevel={3}
        />
      )}
    </section>
  );
}
