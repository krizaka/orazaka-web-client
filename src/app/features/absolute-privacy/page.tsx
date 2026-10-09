"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChatShowcase } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { CONTENT, LOCALES } from "@/app/features/absolute-privacy/content";
import { PrivacySandboxSvg } from "@/app/features/absolute-privacy/PrivacySandboxSvg";

export default function AbsolutePrivacyFeaturePage() {
  const { t, locale, setLocale } = useTranslation();
  const c = CONTENT[locale] || CONTENT.en;

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-surface-0 ambient-grid w-full overflow-y-auto">
      {/* Navbar header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 mb-10 border-b border-border-subtle">
        <Link href="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Orazaka Logo" width={24} height={24} className="w-6 h-6" />
          <span className="text-lg font-bold tracking-tight text-fg">
            Orazaka
          </span>
        </Link>

        <Link
          href="/login"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-default hover:border-accent transition-colors hover:text-accent text-fg-secondary"
        >
          {c.backToLogin}
        </Link>
      </header>

      {/* Hero Header Content */}
      <div className="w-full max-w-4xl text-center space-y-4 mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Local-First Invariant
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl lg:text-6xl bg-gradient-to-r from-fg to-success bg-clip-text text-transparent pb-1">
          {c.title}
        </h1>
        <p className="text-lg text-fg-secondary max-w-2xl mx-auto leading-relaxed">
          {c.subtitle}
        </p>
      </div>

      {/* Live sovereign-chat demo (shared design-system component) */}
      <section className="w-full max-w-4xl flex flex-col items-center gap-4 mb-14">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-fg-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          {c.demoLabel}
        </span>
        <ChatShowcase
          key={locale}
          labels={c.chat.labels}
          question={c.chat.question}
          answer={c.chat.answer}
          pipeline={c.chat.pipeline}
        />
      </section>

      {/* Main Glass Card container */}
      <article className="w-full max-w-4xl glass-card rounded-2xl p-6 md:p-10 space-y-12 animate-fade-up shadow-2xl mb-8">
        {/* Transparent SVG Schema */}
        <section className="flex flex-col items-center justify-center p-6 rounded-xl border border-border-subtle bg-surface-1/45 backdrop-blur-sm relative overflow-hidden group">
          <span className="absolute inset-0 bg-radial-gradient from-success/5 to-transparent opacity-40 pointer-events-none" />
          <h3 className="text-sm font-bold text-fg mb-1 flex items-center gap-2">
            {c.schemaTitle}
          </h3>
          <p className="text-[11px] text-fg-muted mb-6 text-center">
            {c.schemaDesc}
          </p>
          <PrivacySandboxSvg />
        </section>

        {/* Informative text columns */}
        <p className="text-fg-secondary text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
          {c.intro}
        </p>

        <div className="grid gap-6 md:grid-cols-3 pt-4">
          {c.columns.map((column) => (
            <section
              key={column.title}
              className="p-6 rounded-xl border border-border-subtle bg-surface-1 hover:border-border-strong transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <h2 className="text-base font-bold text-fg mb-3">
                {column.title}
              </h2>
              <p className="text-xs text-fg-secondary leading-relaxed">
                {column.desc}
              </p>
            </section>
          ))}
        </div>
      </article>

      {/* Public Footer */}
      <footer className="w-full max-w-4xl flex items-center justify-between py-6 mt-6 border-t border-border-subtle text-xs text-fg-muted">
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-accent transition-colors underline">
            {t.auth.legalPrivacy}
          </Link>
          <Link href="/terms" className="hover:text-accent transition-colors">
            {t.auth.legalTerms}
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            {t.auth.legalContact}
          </Link>
        </div>

        <nav className="auth-lang-switcher-inline" aria-label={t.auth.langSwitchLabel}>
          {LOCALES.map(({ code, label }, i) => (
            <React.Fragment key={code}>
              {i > 0 && <span className="auth-lang-divider">/</span>}
              <button
                type="button"
                className="auth-lang-link"
                data-active={locale === code}
                onClick={() => setLocale(code)}
              >
                {label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </footer>
    </main>
  );
}
