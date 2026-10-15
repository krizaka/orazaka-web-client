/**
 * The publication manifest of dev.orazaka.com/docs — what is published from the Orazaka repository
 * (https://github.com/krizaka/orazaka), where each page sits in the reader's journey, and the words that introduce it.
 *
 * The pages' CONTENT is never written here: `node scripts/sync-docs.mjs <orazaka checkout>` copies it from the source
 * markdown (hand-written under `docs/`, generated under `docs/_generated/` by `orazaka docs sync`). A fact that is wrong or
 * unclear is fixed in the Orazaka repository, then re-synced. What lives here is only the allow-list (a doc that is not
 * listed stays internal), the order, the curated title and one-line intro, and the sections a page leaves out.
 *
 * Journeys (the hub and the sidebar follow them): start → use → run → build, then the mobile app.
 */

export const JOURNEYS = [
  { id: "start", icon: "rocket" },
  { id: "use", icon: "sparkles" },
  { id: "run", icon: "server" },
  { id: "build", icon: "code" },
  { id: "mobile", icon: "smartphone" },
];

/**
 * `source`: path in the Orazaka repository. `generated`: written from the code (the page says so, and "edit" leads to
 * the source file of the generator's input). `omit`: headings (prefix match) whose section is internal planning, left out.
 * `group`: a sub-heading of the journey in the sidebar.
 */
export const DOCS = [
  // ── Get started ───────────────────────────────────────────────────────────────────────────────
  { slug: "101", journey: "start", order: 1, source: "docs/101.md", title: "Orazaka in ten minutes", intro: "What Orazaka is, how it is put together, and your first chat, image and Studio run from a fresh checkout.", audience: "everyone" },
  { slug: "self-hosting", journey: "start", order: 2, source: "docs/SELF_HOSTING.md", title: "Install, update & back up", intro: "Requirements, the three-step installs for a Mac and for a Linux server, then living with it: health, updates, rollback, backups and removal. Your data never leaves your machine.", audience: "everyone" },
  { slug: "glossary", journey: "start", order: 3, source: "docs/GLOSSARY.md", title: "Glossary", intro: "The words used across these docs, in plain language.", audience: "everyone" },

  // ── Use it ────────────────────────────────────────────────────────────────────────────────────
  { slug: "packs", journey: "use", order: 1, source: "docs/_generated/PACKS.md", generated: true, title: "Packs & Studios", intro: "The packs that extend Orazaka without code: the reference catalogue, each manifest field, and how to write, validate and install a pack.", audience: "everyone" },
  { slug: "business-playbook", journey: "use", order: 2, source: "docs/BUSINESS_IMPLEMENTATION.md", title: "Playbook: build a product on Orazaka", intro: "A worked example — what to deploy, in what order, and what each step delivers — written for decision-makers as much as engineers.", audience: "decision-maker" },
  { slug: "jobs", journey: "use", order: 3, source: "docs/_generated/JOBS.md", generated: true, title: "Jobs, schedules & automation", intro: "Everything Orazaka runs without a person waiting: the job plane, its workers, every scheduled task and the automation connectors.", audience: "everyone" },
  { slug: "models", journey: "use", order: 4, source: "docs/_generated/MODELS.md", generated: true, title: "Supported models", intro: "Every model Orazaka supports: where it runs, its licence and its context window, read from the registry the routing reads.", audience: "everyone" },
  { slug: "measured-runs", journey: "use", order: 5, source: "docs/_generated/MEASURED_RUNS.md", generated: true, title: "Measured runs", intro: "Time, cost and every parameter of the video and image runs Orazaka made — per model and provider, read from the run records, with the failures and their causes.", audience: "everyone" },

  // ── Run it ────────────────────────────────────────────────────────────────────────────────────
  { slug: "admin", journey: "run", order: 1, source: "docs/_generated/ADMIN.md", generated: true, title: "Administration", intro: "What an administrator controls — models, the interceptor pipeline, capabilities, plans, wallets, Studios — and how the console is secured.", audience: "operator" },
  { slug: "auth", journey: "run", order: 2, source: "docs/AUTH.md", title: "Authentication & sessions", intro: "How identity, sessions and access control work, flow by flow.", audience: "operator" },
  { slug: "security", journey: "run", order: 3, source: "SECURITY.md", title: "Security policy", intro: "How to report a vulnerability, which versions get fixes, and what a self-hosted installation provides.", audience: "operator" },
  { slug: "licensing", journey: "run", order: 4, source: "docs/LICENSING.md", title: "Licensing", intro: "What the Apache-2.0 licence covers across the Orazaka repositories, and where the proprietary line falls.", audience: "decision-maker" },

  // ── Build on it ───────────────────────────────────────────────────────────────────────────────
  { slug: "api", journey: "build", group: "integrate", order: 1, source: "docs/_generated/API_REFERENCE.md", generated: true, title: "API reference", intro: "Every REST endpoint of every service, with the authorisation rule that guards it.", audience: "developer" },
  { slug: "cli", journey: "build", group: "integrate", order: 2, source: "docs/_generated/CLI.md", generated: true, title: "CLI reference", intro: "One tool for the whole platform: every command, subcommand and option of the orazaka CLI.", audience: "developer" },
  { slug: "tools", journey: "build", group: "integrate", order: 3, source: "docs/_generated/TOOLS.md", generated: true, title: "Tools & MCP", intro: "What a model may call during a turn: registered tools, the MCP servers, the tool cache and the write sandbox.", audience: "developer" },
  { slug: "worker-protocol", journey: "build", group: "integrate", order: 4, source: "docs/WORKER_PROTOCOL.md", title: "Worker protocol", intro: "The AMQP contract a worker speaks to join the platform — bindings, envelopes, progress and failure — in any language.", audience: "developer" },
  { slug: "automation", journey: "build", group: "integrate", order: 5, source: "docs/AUTOMATION.md", title: "Automation & the local agent", intro: "The protocol of the local executing agent and the automation worker.", audience: "developer" },
  { slug: "interface-contracts", journey: "build", group: "integrate", order: 6, source: "docs/_generated/INTERFACE_CONTRACTS.md", generated: true, title: "Interface contracts", intro: "Inbound and outbound ports per module, extracted from the code.", audience: "developer" },
  { slug: "architecture", journey: "build", group: "internals", order: 1, source: "docs/_generated/ARCHITECTURE.md", generated: true, title: "Architecture reference", intro: "The module map, dependencies, runtime flows, interceptor pipeline and messaging topology, read from the code.", audience: "developer" },
  { slug: "core", journey: "build", group: "internals", order: 2, source: "docs/CORE.md", title: "The core engine & its pipeline", intro: "The stateless orchestration core and the request pipeline every interaction flows through.", audience: "developer" },
  { slug: "interceptors", journey: "build", group: "internals", order: 3, source: "docs/_generated/INTERCEPTORS.md", generated: true, title: "Interceptor registry", intro: "Every cross-cutting interceptor of the pipeline and its database-driven order.", audience: "developer" },
  { slug: "business", journey: "build", group: "internals", order: 4, source: "docs/_generated/BUSINESS.md", generated: true, title: "The business layer", intro: "Where a request becomes business: intentions, use-cases, the dispatcher and the ports to the engine.", audience: "developer" },
  { slug: "use-cases", journey: "build", group: "internals", order: 5, source: "docs/_generated/USE_CASES.md", generated: true, title: "Use-case catalogue", intro: "The App Factory use-cases of the business layer.", audience: "developer" },
  { slug: "repositories", journey: "build", group: "internals", order: 6, source: "docs/_generated/REPOSITORIES.md", generated: true, title: "Repositories", intro: "One GitHub repository per component, what each holds and what it depends on.", audience: "developer" },
  { slug: "governance", journey: "build", group: "internals", order: 7, source: "docs/_generated/GOVERNANCE.md", generated: true, title: "Governance rules", intro: "The architecture rules the build enforces, and the test suites behind each.", audience: "developer" },
  { slug: "adrs", journey: "build", group: "internals", order: 8, source: "docs/_generated/ADRS.md", generated: true, title: "Decision records", intro: "The Architecture Decision Records cited across the code, and the rationale behind the structure.", audience: "developer" },

  // ── Mobile ────────────────────────────────────────────────────────────────────────────────────
  // `mobile` is the four-step tour (src/app/docs/mobile, its words in translations.mobile.ts); the guide is MOBILE.md.
  { slug: "mobile-guide", journey: "mobile", order: 2, source: "docs/MOBILE.md", title: "The mobile app, screen by screen", intro: "What the iOS and Android app does today, how to run it against the local stack, its tests, and which screens do not read the server yet.", audience: "everyone" },
];

/** The pages that are not a markdown file of the source: the hub links them, the sidebar lists them. */
export const SPECIAL = [
  { slug: "mobile", journey: "mobile", order: 1, title: "The mobile app in four steps", intro: "Sign in, run a Studio, ask the model, follow your jobs — four screens, each explained.", audience: "everyone" },
];
