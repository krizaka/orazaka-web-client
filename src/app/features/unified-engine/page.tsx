"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChatShowcase } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { CONTENT, LOCALES } from "@/app/features/unified-engine/content";
import { EnginePipelineSvg } from "@/app/features/unified-engine/EnginePipelineSvg";

const PIPELINE_STEPS = [
  { order: "01", name: "UserContextResolver", desc: "Checks user profile details, active RBAC constraints, and rate-limiting tiers." },
  { order: "02", name: "SystemContextInjector", desc: "Injects environment signals, system variables, and currently active local tools." },
  { order: "03", name: "LanguageAlignmentInterceptor", desc: "Forces LLM internal reasoning in English while aligning output translation to user preferences." },
  { order: "04", name: "MemoryInterceptor", desc: "Restores context of the recent conversation history in a FIFO window from the local DB." },
  { order: "05", name: "RagInterceptor", desc: "Queries local PGVector store using hybrid lexical/dense search to inject context nodes." },
  { order: "06", name: "McpInterceptor", desc: "Resolves dynamic schemas and schemas mapping from the Model Context Protocol." },
  { order: "07", name: "Refiner & Router", desc: "Performs fuzzy query optimization and routes context to the optimal hardware engine." },
  { order: "08", name: "ToolInterceptor", desc: "Attaches runtime callback declarations for execute hooks matching user intent." },
  { order: "09", name: "CostShieldInterceptor", desc: "Monitors local unified memory usage, auto-shifting loads to cloud adapters if memory >85%." },
  { order: "10", name: "QuantumValidationAdvisor", desc: "Runs 3-tier self-correction: strict JSON validation, sandbox crash test, and semantic consensus debate." },
];

const VALIDATION_TIERS = [
  { tier: "TIER A", title: "Deterministic JSON Schema", desc: "Executes structural parses of JSON payloads using Jackson ObjectMapper at zero-token cost. Any malformed syntax triggers an instant, localized pipeline retry." },
  { tier: "TIER B", title: "MCP Sandbox Crash-Test", desc: "Extracts code snippets and compiles them inside an isolated Model Context Protocol (MCP) compilation sandbox, feeding syntax errors back to self-correct the model dynamically." },
  { tier: "TIER C", title: "Semantic Consensus Debate", desc: "Spawns independent Advocate and Critic agent personas at zero temperature to review response logic. The request is retried if the Critic detects alignment flaws." },
];

export default function UnifiedEngineFeaturePage() {
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20">
          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          Multi-Modal Pipeline Orchestration
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl lg:text-6xl bg-gradient-to-r from-fg to-warning bg-clip-text text-transparent pb-1">
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
          <span className="absolute inset-0 bg-radial-gradient from-warning/5 to-transparent opacity-40 pointer-events-none" />
          <h3 className="text-sm font-bold text-fg mb-1 flex items-center gap-2">
            {c.schemaTitle}
          </h3>
          <p className="text-[11px] text-fg-muted mb-6 text-center">
            {c.schemaDesc}
          </p>
          <EnginePipelineSvg />
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

        {/* Detailed Interceptor Pipeline Steps */}
        <section className="border-t border-border-subtle pt-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl bg-gradient-to-r from-fg to-warning bg-clip-text text-transparent pb-1">
              Cognitive Interceptor execution sequence
            </h2>
            <p className="text-xs text-fg-secondary leading-relaxed">
              Every request is dynamically processed through a 10-tier pipeline resolving security controls, memory injections, vector storage, and 3-tier self-correction validation.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2 text-left">
            {PIPELINE_STEPS.map((step) => (
              <article key={step.order} className="p-4 rounded-xl border border-border-subtle bg-surface-1/30 backdrop-blur-sm hover:border-border-strong transition-all duration-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="font-mono text-[10px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                    {step.order}
                  </span>
                  <h4 className="text-xs font-bold text-fg">
                    {step.name}
                  </h4>
                </div>
                <p className="text-[10px] text-fg-secondary leading-relaxed">
                  {step.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Quantum Validation Advisor Section */}
        <section className="border-t border-border-subtle pt-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl bg-gradient-to-r from-fg to-warning bg-clip-text text-transparent pb-1">
              Quantum Validation Advisor
            </h2>
            <p className="text-xs text-fg-secondary leading-relaxed">
              Orazaka&apos;s unique, closed-loop self-correction architecture validates model outputs using three distinct, automated approaches before delivering payloads.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-2 text-left">
            {VALIDATION_TIERS.map((v) => (
              <article key={v.tier} className="p-5 rounded-xl border border-border-subtle bg-surface-1/30 backdrop-blur-sm hover:border-border-strong transition-all duration-200">
                <p className="font-mono text-[10px] font-bold text-warning mb-2">{v.tier}</p>
                <h3 className="text-sm font-bold text-fg mb-2">{v.title}</h3>
                <p className="text-[11px] text-fg-secondary leading-relaxed">
                  {v.desc}
                </p>
              </article>
            ))}
          </div>
        </section>
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
