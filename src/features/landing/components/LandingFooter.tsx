"use client";

import Link from "next/link";
import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";
import { useTranslation } from "@/core/context/LocaleContext";
import { APP_ENV, APP_VERSION } from "@/core/config/version";
import { FEATURE_IDS } from "@/features/landing/components/features";

/**
 * The footer of the public pages (NAV-SYS) is @krizaka/ui's SiteFooter: Orazaka's own column (the feature pages, the
 * documentation), the Krizaka family in columns, « A Krizaka product », DEV · the version, Montréal. The legal pages
 * and the licence end the signature line.
 */
export function LandingFooter() {
  const { t, locale } = useTranslation();
  const f = t.landing.footer;

  return (
    <SiteFooter
      current="orazaka"
      labels={familyLabels[locale]}
      aria-label={f.product}
      version={APP_VERSION}
      env={APP_ENV === "production" ? undefined : APP_ENV}
      data-testid="app-version"
      legal={
        <>
          <span>{f.license}</span>
          <SiteFooter.Link asChild>
            <Link href="/privacy">{f.privacy}</Link>
          </SiteFooter.Link>
          <SiteFooter.Link asChild>
            <Link href="/terms">{f.terms}</Link>
          </SiteFooter.Link>
          <SiteFooter.Link asChild>
            <Link href="/contact">{f.contact}</Link>
          </SiteFooter.Link>
        </>
      }
    >
      <SiteFooter.Column title={f.product}>
        {FEATURE_IDS.map((id) => (
          <SiteFooter.Link key={id} asChild>
            <Link href={`/features/${id}`}>{t.features.pages[id].name}</Link>
          </SiteFooter.Link>
        ))}
        <SiteFooter.Link asChild>
          <Link href="/docs">{f.docs}</Link>
        </SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}
