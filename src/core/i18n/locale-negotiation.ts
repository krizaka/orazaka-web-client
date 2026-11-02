/**
 * @file locale-negotiation.ts
 * @description The language of a visitor (Loi 96: French by default), the same rule as www.krizaka.com.
 */

export type SiteLocale = "fr" | "en";

/** Loi 96: French is the site's language by default. */
export const FALLBACK_LOCALE: SiteLocale = "fr";

const PREFIXED = /^\/(fr|en)(\/.*)?$/;

/** `/fr/login` is the French `/login`: the prefix names the language, the rest is the page. */
export function splitLocalePrefix(pathname: string): { locale: SiteLocale | null; path: string } {
  const match = PREFIXED.exec(pathname);
  if (!match) return { locale: null, path: pathname };
  return { locale: match[1] as SiteLocale, path: match[2] ?? "/" };
}

/**
 * 1. the language the visitor chose (stored), whichever it is;
 * 2. else English only when the browser asks for English and never for French;
 * 3. else French (no header, a bot, any French, any other language).
 */
export function negotiateLocale(stored: string | null | undefined, languages: readonly string[]): SiteLocale {
  if (stored === "fr" || stored === "en") return stored;
  const tags = languages.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const asksFrench = tags.some((t) => t === "fr" || t.startsWith("fr-"));
  const asksEnglish = tags.some((t) => t === "en" || t.startsWith("en-"));
  return asksEnglish && !asksFrench ? "en" : FALLBACK_LOCALE;
}
