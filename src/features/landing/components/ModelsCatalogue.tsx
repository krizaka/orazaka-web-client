"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@krizaka/ui/badge";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CataloguePage } from "@krizaka/ui/catalogue-page";
import { LinkCard } from "@krizaka/ui/link-card";
import { ChipLink } from "@krizaka/ui/chip-link";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import { useTranslation } from "@/core/context/LocaleContext";
import { CapabilityBadges, WhereBadge } from "@/features/landing/components/ModelBadges";
import { capabilitiesOf, filterModels, filtersHref, formatCount, MODELS, readFilters, type Capability, type ModelEntry, type RunsOn } from "@/features/landing/utils/models";

const WHERE: RunsOn[] = ["local", "provider"];

/**
 * `/models` — the catalogue of the models Orazaka supports (the `catalogue` template of @krizaka/ui): filters by what
 * a model does and where it runs, kept in the address; the results in a DataTable (cards on a phone) with the licence of
 * each model's own card, its context window and the date it was last verified. Provider-hosted models are labelled
 * optional. Every figure is the registry's (`models.generated.json`).
 */
export function ModelsCatalogue({ models = MODELS }: Readonly<{ models?: readonly ModelEntry[] }>) {
  const { t, locale } = useTranslation();
  const m = t.models;
  const params = useSearchParams();
  const query = params.toString();
  const filters = useMemo(() => readFilters(new URLSearchParams(query), models), [query, models]);
  const rows = useMemo(() => filterModels(models, filters), [models, filters]);
  const capabilities = capabilitiesOf(models);
  const toggleCapability = (c: Capability): Capability[] => (filters.capabilities.includes(c) ? filters.capabilities.filter((x) => x !== c) : [...filters.capabilities, c]);

  // Priorities (DataTable): the model, what it does, where it runs and its status stay in the row; the maker, licence,
  // context window and verification date leave it, in that order, as the table narrows — into the row's detail.
  const columns = useMemo<DataTableColumn<ModelEntry>[]>(
    () => [
      { id: "name", header: m.columns.model, type: "title", sortable: true, subtitle: (r) => r.id },
      { id: "does", header: m.columns.does, type: "badge", minWidth: 128, value: (r) => r.capabilities.join(", "), cell: (r) => <CapabilityBadges capabilities={r.capabilities} /> },
      {
        id: "runs",
        header: m.columns.runs,
        type: "badge",
        sortable: true,
        value: (r) => r.runsOn,
        cell: (r) => (
          <span className="flex flex-col items-start gap-0.5">
            <WhereBadge runsOn={r.runsOn} />
            <span className="text-xs text-fg-tertiary">{r.runtime}</span>
          </span>
        ),
      },
      {
        id: "status",
        header: m.columns.status,
        type: "status",
        sortable: true,
        value: (r) => r.status,
        cell: (r) => (
          <Badge tone={r.status === "default" ? "success" : r.status === "planned" ? "warning" : "neutral"} size="sm">
            {m.status[r.status]}
          </Badge>
        ),
      },
      {
        id: "vendor",
        header: m.columns.vendor,
        type: "text",
        priority: 3,
        sortable: true,
        value: (r) => r.vendor,
        cell: (r) => (
          <span className="block">
            {r.vendor}
            <span className="block text-xs text-fg-tertiary">{r.family}</span>
          </span>
        ),
      },
      {
        id: "licence",
        header: m.columns.licence,
        type: "text",
        priority: 4,
        sortable: true,
        value: (r) => r.licence.name,
        cell: (r) => (
          <span className="flex flex-col">
            {r.licence.url ? (
              <a href={r.licence.url} target="_blank" rel="noopener noreferrer" className="text-fg-accent underline-offset-2 hover:underline">
                {r.licence.name}
              </a>
            ) : (
              <span>{r.licence.name}</span>
            )}
            <span className="flex flex-wrap items-center gap-1 text-xs text-fg-tertiary">
              {r.commercialUse === "no" && (
                <Badge tone="warning" size="sm">
                  {m.licence.nonCommercial}
                </Badge>
              )}
              <span>{`${r.openWeights ? m.licence.open : m.licence.proprietary}${r.commercialUse === "no" ? "" : ` · ${r.commercialUse === "yes" ? m.licence.commercial : m.licence.conditions}`}`}</span>
            </span>
          </span>
        ),
      },
      {
        id: "context",
        header: m.columns.context,
        type: "number",
        priority: 5,
        sortable: true,
        value: (r) => r.contextWindow ?? 0,
        cell: (r) => (r.contextWindow ? m.context.tokens.replace("{count}", formatCount(r.contextWindow, locale)) : m.context.none),
      },
      {
        id: "verified",
        header: m.columns.verified,
        type: "date",
        priority: 5,
        sortable: true,
        value: (r) => r.lastVerified ?? "",
        cell: (r) => r.lastVerified ?? m.verified.never,
      },
    ],
    [m, locale],
  );

  const chips = (
    <div className="flex flex-wrap gap-x-10 gap-y-4 xl:flex-col xl:gap-6">
      <div className="flex flex-wrap items-center gap-2 xl:flex-col xl:items-start" role="group" aria-label={m.filters.capability}>
        <p className="kz-label xl:w-full">{m.filters.capability}</p>
        <ChipLink asChild selected={filters.capabilities.length === 0}>
          <Link href={filtersHref({ ...filters, capabilities: [] })} scroll={false} replace>{m.filters.all}</Link>
        </ChipLink>
        {capabilities.map((c) => (
          <ChipLink key={c} asChild selected={filters.capabilities.includes(c)}>
            <Link href={filtersHref({ ...filters, capabilities: toggleCapability(c) })} scroll={false} replace>{m.capabilities[c]}</Link>
          </ChipLink>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 xl:flex-col xl:items-start" role="group" aria-label={m.filters.where}>
        <p className="kz-label xl:w-full">{m.filters.where}</p>
        <ChipLink asChild selected={filters.runsOn === null}>
          <Link href={filtersHref({ ...filters, runsOn: null })} scroll={false} replace>{m.filters.all}</Link>
        </ChipLink>
        {WHERE.map((w) => (
          <ChipLink key={w} asChild selected={filters.runsOn === w}>
            <Link href={filtersHref({ ...filters, runsOn: w })} scroll={false} replace>{w === "local" ? m.where.localLong : m.where.providerLong}</Link>
          </ChipLink>
        ))}
      </div>
    </div>
  );

  return (
    <CataloguePage
      eyebrow={m.hero.eyebrow}
      title={m.hero.title}
      lead={m.hero.lead}
      filtersLabel={m.filters.label}
      filters={chips}
      count={rows.length === 1 ? m.countOne : m.count.replace("{count}", String(rows.length))}
      linkAs={Link}
      railFrom="wide"
    >
      <aside aria-label={m.sovereign.title} className="mb-6 grid gap-4 rounded-2xl border border-border-default bg-surface-1/85 p-5 md:grid-cols-2">
        <div className="space-y-2 border-l-2 border-accent pl-4">
          <p className="flex items-center gap-2 font-semibold text-fg"><WhereBadge runsOn="local" />{m.where.localLong}</p>
          <p className="text-sm leading-relaxed text-fg-secondary">{m.sovereign.local}</p>
        </div>
        <div className="space-y-2 border-l-2 border-border-default pl-4">
          <p className="flex items-center gap-2 font-semibold text-fg"><WhereBadge runsOn="provider" />{m.where.providerLong}</p>
          <p className="text-sm leading-relaxed text-fg-secondary">{m.sovereign.provider}</p>
        </div>
      </aside>
      <DataTable
        caption={m.table.caption}
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        rowLabel={(r) => r.name}
        density="compact"
        empty={<p className="p-6 text-center text-fg-secondary">{m.empty}</p>}
        labels={{ empty: m.empty, showMore: (name) => m.table.showMore.replace("{name}", name), results: (n) => (n === 1 ? m.countOne : m.count.replace("{count}", String(n))) }}
      />
      <section aria-labelledby="models-docs" className="mt-12 space-y-4">
        <div className="space-y-1">
          <h2 id="models-docs" className="font-display text-xl font-bold text-fg">{m.docs.title}</h2>
          <p className="text-sm text-fg-secondary">{m.docs.lead}</p>
        </div>
        <CardGrid as="ul" min={260} reveal={false}>
          <LinkCard href="/docs/models" linkAs={Link} title={m.docs.catalogue} titleAs="span" description={m.docs.catalogueLead} cta={m.docs.cta} />
          <LinkCard href="/docs/architecture" linkAs={Link} title={m.docs.routing} titleAs="span" description={m.docs.routingLead} cta={m.docs.cta} />
        </CardGrid>
      </section>
    </CataloguePage>
  );
}
