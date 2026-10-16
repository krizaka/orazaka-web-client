"use client";

import { useState } from "react";
import { CheckIcon, LockIcon, ShieldIcon } from "@krizaka/icons";

export function PacksScreen() {
  const [showModal, setShowModal] = useState(true);
  return (
    <article className="relative flex h-full flex-col justify-between space-y-3 rounded-xl bg-surface-0/60 p-4 font-sans sm:p-5">
      <header className="flex items-center justify-between border-b border-border-subtle pb-3">
        <h4 className="text-xs font-bold text-fg">Sovereign Domain Packs & Scope Guard Catalog</h4>
        <span className="rounded-full bg-surface-1 px-2 py-0.5 font-mono text-[10px] text-fg-accent">Loi 25 · RGPD · HIPAA</span>
      </header>

      <ul className="grid gap-2.5 sm:grid-cols-3">
        <li className="rounded-lg border border-border-default bg-surface-1 p-3">
          <header className="flex items-center justify-between">
            <span className="rounded bg-brand-orazaka/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-orazaka">WORKER</span>
            <span className="font-mono text-[10px] text-success">Active</span>
          </header>
          <h5 className="mt-1.5 text-xs font-bold text-fg">Legal & Lease Guard</h5>
          <p className="mt-1 text-[11px] text-fg-secondary">Refusal on cross-border transmission without sovereign encryption.</p>
        </li>
        <li className="rounded-lg border border-border-default bg-surface-1 p-3">
          <header className="flex items-center justify-between">
            <span className="rounded bg-info/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-info">DATA</span>
            <span className="font-mono text-[10px] text-warning">Strict</span>
          </header>
          <h5 className="mt-1.5 text-xs font-bold text-fg">Medical Consent Auditor</h5>
          <p className="mt-1 text-[11px] text-fg-secondary">Blocks unredacted clinical data and patient identifiers (Art. 9).</p>
        </li>
        <li className="rounded-lg border border-border-default bg-surface-1 p-3">
          <header className="flex items-center justify-between">
            <span className="rounded bg-fg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-fg-accent">OSS</span>
            <span className="font-mono text-[10px] text-success">Active</span>
          </header>
          <h5 className="mt-1.5 text-xs font-bold text-fg">Tax & Finance Sentinel</h5>
          <p className="mt-1 text-[11px] text-fg-secondary">Revenu Québec & CRA statutory calculations without filing claims.</p>
        </li>
      </ul>

      {showModal ? (
        <section aria-label="Scope Guard Inspection" className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-warning">
              <ShieldIcon size={14} />
              <span>Scope Guard Refusal Inspection · Rule SG-CA-QC-25</span>
            </div>
            <button type="button" onClick={() => setShowModal(false)} className="text-[10px] text-warning/70 hover:text-warning">
              [Minimize]
            </button>
          </header>
          <p className="mt-1 text-[11px] text-warning">
            Statutory violation blocked: Unredacted Social Insurance Number (NAS) prohibited in outgoing prompts.
          </p>
          <footer className="mt-2 flex items-center justify-between font-mono text-[10px] text-warning">
            <span>Action: Refusal modal presented to user</span>
            <span className="text-success">Zero Socket Exfiltration</span>
          </footer>
        </section>
      ) : (
        <button type="button" onClick={() => setShowModal(true)} className="rounded-lg border border-border-subtle bg-surface-1 p-2 text-center text-xs text-fg-accent hover:bg-surface-2">
          View Scope Guard Refusal Modal →
        </button>
      )}

      <footer className="font-mono text-[11px] text-fg-muted">
        Statutory refusal verification: 100% block rate on prohibited terms across 18 benchmark tests.
      </footer>
    </article>
  );
}

export function SagasScreen() {
  return (
    <article className="flex h-full flex-col justify-between space-y-3 rounded-xl bg-surface-0/60 p-4 font-sans sm:p-5">
      <header className="flex items-center justify-between border-b border-border-subtle pb-3">
        <h4 className="text-xs font-bold text-fg">Studio Saga: lease-compliance-audit-2026</h4>
        <span className="rounded-full bg-success/20 px-2 py-0.5 font-mono text-[10px] text-success">Completed (604 ms)</span>
      </header>

      <ul className="grid gap-2 sm:grid-cols-4">
        {[
          { name: "1. Ingest", time: "142 ms", status: "Done" },
          { name: "2. Scope Guard", time: "88 ms", status: "Passed" },
          { name: "3. Reasoning", time: "342 ms", status: "Done" },
          { name: "4. Certificate", time: "32 ms", status: "Signed" },
        ].map((s) => (
          <li key={s.name} className="rounded-lg border border-success/30 bg-surface-1 p-2.5 text-center">
            <p className="text-[11px] font-bold text-fg">{s.name}</p>
            <p className="mt-0.5 font-mono text-[10px] text-success">{s.time} · {s.status}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-lg border border-border-default bg-surface-1/90 p-3 font-mono text-[11px]">
        <header className="flex items-center gap-2 text-success">
          <CheckIcon size={14} />
          <h5 className="font-bold">Verified Sovereign Execution Certificate</h5>
        </header>
        <div className="mt-1.5 space-y-0.5 text-fg-muted">
          <p>Certificate ID: cert_ozk_8819a_sovereign</p>
          <p className="truncate text-fg-secondary">SHA-256: 7f8a329e4b1029c9ef89123bc45012a9efb829104b9281a039d91024b8102931</p>
          <p className="text-fg-accent">Engine: Apple Silicon Metal · Local Stack · Zero Remote Exfiltration</p>
        </div>
      </section>

      <footer className="font-mono text-[11px] text-fg-muted">
        Proof: Deterministic saga pipeline replay test suite passes with zero state corruption.
      </footer>
    </article>
  );
}

export function FilesScreen() {
  return (
    <article className="flex h-full flex-col justify-between space-y-3 rounded-xl bg-surface-0/60 p-4 font-sans sm:p-5">
      <header className="flex items-center justify-between border-b border-border-subtle pb-3">
        <h4 className="text-xs font-bold text-fg">Scoped Folders & Sidecar CLI Supervision</h4>
        <span className="font-mono text-[10px] text-fg-muted">Least-Privilege Containment</span>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-border-subtle bg-surface-1 p-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-success">Granted User Folders</span>
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center justify-between rounded bg-surface-0/50 p-1.5">
              <span className="truncate text-fg">📁 ~/Documents/Contracts</span>
              <span className="font-mono text-[10px] text-success">Read-Only</span>
            </li>
            <li className="flex items-center justify-between rounded bg-surface-0/50 p-1.5">
              <span className="truncate text-fg">📁 ~/Projects/Audits-2026</span>
              <span className="font-mono text-[10px] text-success">Read/Write</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2 rounded-lg border border-danger/20 bg-danger/5 p-3">
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-danger">
            <LockIcon size={12} /> Strictly Blocked Paths
          </span>
          <ul className="space-y-1 font-mono text-[11px] text-danger">
            <li>✕ / (Root filesystem)</li>
            <li>✕ ~ (User home directory root)</li>
            <li>✕ ~/.ssh, ~/.aws, ~/Library</li>
          </ul>
        </div>
      </section>

      <footer className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-1 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="font-mono text-fg">Sidecar CLI daemon: orazaka v0.1.0 (PID 48291)</span>
        </div>
        <span className="font-mono text-[11px] text-fg-muted">Rust canonicalize guard OK</span>
      </footer>
    </article>
  );
}
