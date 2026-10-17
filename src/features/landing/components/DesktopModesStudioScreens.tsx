"use client";

import { CheckIcon, GlobeIcon, LocalIcon, StudioIcon } from "@krizaka/icons";
import { cn } from "@krizaka/ui/cn";

export function ModesScreen({
  mode,
  onToggleMode,
}: Readonly<{
  mode: "local" | "cloud";
  onToggleMode: (m: "local" | "cloud") => void;
}>) {
  const isLocal = mode === "local";
  return (
    <article className="flex h-full flex-col justify-between space-y-4 rounded-xl bg-surface-0/60 p-4 font-sans sm:p-5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2.5">
          <figure className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", isLocal ? "border-brand-orazaka/40 bg-brand-orazaka/10 text-brand-orazaka" : "border-fg-accent/40 bg-fg-accent/10 text-fg-accent")}>
            {isLocal ? <LocalIcon size={18} /> : <GlobeIcon size={18} />}
          </figure>
          <div>
            <h4 className="text-sm font-bold text-fg">{isLocal ? "Apple Silicon Metal (Local)" : "Cloud API (dev.orazaka.com)"}</h4>
            <p className="font-mono text-xs text-fg-muted">{isLocal ? "http://localhost:8088 · Sovereign Edge" : "https://dev.orazaka.com · OAuth 2.1 PKCE"}</p>
          </div>
        </div>
        <nav aria-label="Mode switcher" className="flex rounded-lg border border-border-default bg-surface-1 p-0.5">
          <button
            type="button"
            onClick={() => onToggleMode("local")}
            className={cn("rounded-md px-3 py-1 text-xs font-semibold transition", isLocal ? "bg-surface-2 text-fg shadow-sm" : "text-fg-muted hover:text-fg")}
          >
            Local Metal
          </button>
          <button
            type="button"
            onClick={() => onToggleMode("cloud")}
            className={cn("rounded-md px-3 py-1 text-xs font-semibold transition", !isLocal ? "bg-surface-2 text-fg shadow-sm" : "text-fg-muted hover:text-fg")}
          >
            Cloud API
          </button>
        </nav>
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-1/70 p-3">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">Latency & Probe</dt>
          <dd className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-sm font-bold text-fg">{isLocal ? "0.8 ms (Loopback)" : "19.2 ms (TLS 1.3)"}</span>
          </dd>
          <p className="text-xs text-fg-secondary">{isLocal ? "Zero round-trip latency outside local RAM." : "Real-time edge probe to production cluster."}</p>
        </div>
        <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-1/70 p-3">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">Hardware & Pipeline</dt>
          <dd className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-fg">{isLocal ? "Metal 16-Core Neural Engine" : "Multi-Node Distributed GPU"}</span>
          </dd>
          <p className="text-xs text-fg-secondary">{isLocal ? "Unified memory execution (128-bit bus)." : "H100 & Wan 2.1 distributed worker nodes."}</p>
        </div>
        <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-1/70 p-3">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">Data Exfiltration Guard</dt>
          <dd className="flex items-center gap-1.5 text-success">
            <CheckIcon size={14} />
            <span className="font-mono text-xs font-bold">{isLocal ? "0 Bytes Transmitted (Airgap)" : "mTLS Encrypted & PII Redacted"}</span>
          </dd>
          <p className="text-xs text-fg-secondary">{isLocal ? "Socket firewall halts non-local packets." : "Keychain scoped access token authentication."}</p>
        </div>
        <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-1/70 p-3">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">Active Model Weight</dt>
          <dd className="font-mono text-xs font-bold text-fg">{isLocal ? "orazaka-metal-8b-instruct" : "orazaka-deepseek-r1-671b"}</dd>
          <p className="text-xs text-fg-secondary">{isLocal ? "Quantized Q4_K_M sovereign weights." : "Full cloud parameter reasoning model."}</p>
        </div>
      </dl>

      <footer className="flex items-center justify-between rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-xs text-success">
        <span className="flex items-center gap-2 font-mono">
          <CheckIcon size={14} />
          Verified: Header [x-orazaka-connection-mode: {mode}] dynamically switched
        </span>
        <span className="font-mono text-[11px] opacity-75">34/34 Cargo Tests OK</span>
      </footer>
    </article>
  );
}

export function StudioScreen() {
  return (
    <article className="flex h-full flex-col justify-between space-y-3 rounded-xl bg-surface-0/60 p-4 font-sans sm:p-5">
      <header className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <StudioIcon size={16} className="text-brand-orazaka" />
          <h4 className="text-xs font-bold text-fg">Contract Lease Audit · Chat & Reasoning</h4>
        </div>
        <span className="rounded-full border border-border-subtle bg-surface-1 px-2.5 py-0.5 font-mono text-[11px] text-fg-muted">
          18.4 tok/s · Metal 8B
        </span>
      </header>

      <section className="space-y-3 text-xs">
        <div className="flex justify-end">
          <blockquote className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-orazaka/15 px-3.5 py-2.5 text-fg">
            <p className="font-medium">Analyse ce bail commercial et résume la clause de résiliation.</p>
            <footer className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-brand-orazaka">
              <span>📄 bail-commercial-2026.pdf (1.2 MB · Granted folder)</span>
            </footer>
          </blockquote>
        </div>

        <div className="space-y-2">
          <details open className="rounded-lg border border-border-subtle bg-surface-1/70 p-2.5 text-fg-secondary">
            <summary className="cursor-pointer font-mono text-[11px] font-semibold text-fg-accent">
              ▾ Thinking Process (1.4s · 312 reasoning tokens)
            </summary>
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-fg-muted">
              1. Extracted clauses 14.1 & 14.2 from granted PDF.<br />
              2. Read the notice period and the renewal terms.<br />
              3. Compared them with the summary the user asked for.<br />
              4. Drafted the summary.
            </p>
          </details>

          <article className="rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-1 p-3 text-fg">
            <p className="leading-relaxed">
              <strong className="text-success">Résumé :</strong> la clause 14.2 permet la résiliation avec un préavis écrit. Le document est resté sur votre machine pendant toute l&apos;analyse.
            </p>
          </article>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-border-subtle pt-2.5 font-mono text-[11px] text-fg-muted">
        <span>Prompt tokens: 1,420 · Output: 184</span>
        <span className="text-success">Vitest UI 32/32 tests passed</span>
      </footer>
    </article>
  );
}
