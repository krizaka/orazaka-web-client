import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@krizaka/ui/blocks.css";
import { readAuthFlags } from "@/core/config/auth-flags";
import { indexable } from "@/core/config/indexing";
import { PublicShell } from "@/components/layout/PublicShell";
import { ThemeScript } from "@krizaka/ui/theme";

import { cn } from "@krizaka/ui/cn";
import { KRIZAKA_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, siteJsonLd } from "@/app/_seo/seo";

/*
 * The typefaces are the files of @krizaka/fonts (SIL OFL 1.1), loaded by next/font/local: preloaded, fingerprinted and
 * served from the same origin — never fetched from Google at build. The app is a product, so it wears plain Krizaka UI
 * (`data-surface="product"` on <html>): the text sans, and Plus Jakarta Sans for the titles (ADR-006, mapped to
 * `--kz-font-product-display` in globals.css) — no Young Serif, no Courier Prime (those are the notebook's).
 * The variables sit on <html>, where the tokens read them (`--kz-font-sans` / `--kz-font-product-display` are resolved there:
 * on <body> they would be undefined and the text would fall back to the system face).
 * The arguments must be literals, relative to this file: scripts/link-fonts.mjs copies the faces to ./_fonts (git-ignored)
 * from wherever the package is installed (standalone on App Platform, hoisted in the workspace).
 */
const inter = localFont({
  src: "./_fonts/atkinson-hyperlegible-next-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-inter",
  display: "swap",
});

const productDisplay = localFont({
  src: "./_fonts/plus-jakarta-sans-latin-wght.woff2",
  weight: "500 800",
  variable: "--font-product-display",
  display: "swap",
});

/**
 * Application global metadata configurations.
 */
export const metadata: Metadata = {
  // Not indexed (dev, preview): the page says so too — the header and robots.txt say it already (core/config/indexing.ts).
  ...(indexable() ? {} : { robots: { index: false, follow: false, noarchive: true } }),
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Krizaka", url: KRIZAKA_URL }],
  // Every page is canonical to itself; the image is app/opengraph-image.tsx.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    alternateLocale: "fr_CA",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

/**
 * Root layout component for the entire Next.js application.
 *
 * @param props The layout component properties.
 * @returns The HTML structure of the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-surface="product"
      className={cn(inter.variable, productDisplay.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* The organisation's theme mechanism: applies the persisted mode and named theme before the first paint. */}
        <ThemeScript />
        {/* Without JavaScript nothing rises into view: no [data-reveal] block may stay invisible. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="antialiased transition-colors duration-200">
        <PublicShell authFlags={readAuthFlags()} showDevNotice={!indexable()}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
