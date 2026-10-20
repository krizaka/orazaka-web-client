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
 * served from the same origin — never fetched from Google at build. The CSS variables are the ones the app already uses.
 * The arguments must be literals, relative to this file: scripts/link-fonts.mjs copies the faces to ./_fonts (git-ignored)
 * from wherever the package is installed (standalone on App Platform, hoisted in the workspace).
 */
const inter = localFont({
  src: "./_fonts/inter-latin-wght.woff2",
  weight: "300 700",
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./_fonts/jetbrains-mono-latin-wght.woff2",
  weight: "400 600",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Outfit's role (headings) is taken by Plus Jakarta Sans, the display face of @krizaka/fonts. */
const outfit = localFont({
  src: "./_fonts/plus-jakarta-sans-latin-wght.woff2",
  weight: "500 800",
  variable: "--font-outfit",
  display: "swap",
});

/**
 * Krizaka Display: the display face of @krizaka/fonts (Plus Jakarta Sans).
 * CSS variable --font-krizaka-display resolves to it.
 */
const krizakaDisplay = localFont({
  src: "./_fonts/plus-jakarta-sans-latin-wght.woff2",
  weight: "500 800",
  variable: "--font-krizaka-display",
  display: "swap",
});

/**
 * Krizaka Mono: the mono face of @krizaka/fonts (JetBrains Mono).
 * CSS variable --font-krizaka-mono resolves to it.
 */
const krizakaMono = localFont({
  src: "./_fonts/jetbrains-mono-latin-wght.woff2",
  weight: "400 600",
  variable: "--font-krizaka-mono",
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
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, locale: "en_US", alternateLocale: "fr_CA" },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The organisation's theme mechanism: applies the persisted mode and named theme before the first paint. */}
        <ThemeScript />
        {/* Without JavaScript nothing rises into view: no [data-reveal] block may stay invisible. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()).replace(/</g, "\\u003c") }} />
      </head>
      <body
        className={cn(
          inter.variable,
          jetbrainsMono.variable,
          outfit.variable,
          krizakaDisplay.variable,
          krizakaMono.variable,
          "antialiased transition-colors duration-200"
        )}
      >
        <PublicShell authFlags={readAuthFlags()} showDevNotice={!indexable()}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
