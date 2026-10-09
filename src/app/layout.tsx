import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/core/providers/Providers";
import { ThemeScript } from "@krizaka/ui/theme";

import { cn } from "@krizaka/ui/cn";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

/**
 * Krizaka Display — mapped to Outfit until custom .woff2 is provisioned.
 * CSS variable --font-krizaka-display resolves to Outfit's variable font.
 */
const krizakaDisplay = Outfit({
  variable: "--font-krizaka-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

/**
 * Krizaka Mono — mapped to JetBrains Mono until custom .woff2 is provisioned.
 * CSS variable --font-krizaka-mono resolves to JetBrains Mono's variable font.
 */
const krizakaMono = JetBrains_Mono({
  variable: "--font-krizaka-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/**
 * Application global metadata configurations.
 */
export const metadata: Metadata = {
  title: "Orazaka UI",
  description: "Advanced AI Coding Interface",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
