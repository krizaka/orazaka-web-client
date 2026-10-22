/**
 * The publication manifest of dev.orazaka.com/docs — what is published from the Orazaka repository
 * (https://github.com/krizaka/orazaka), where each page sits in the reader's journey, and the words that introduce it.
 *
 * The pages' CONTENT is never written here: `node scripts/sync-docs.mjs <orazaka checkout>` copies it from the source
 * markdown (hand-written under `docs/`, generated under `docs/_generated/` by `orazaka docs sync`). A fact that is wrong or
 * unclear is fixed in the Orazaka repository, then re-synced. What lives here is only the allow-list (a doc that is not
 * listed stays internal), the order, the curated title and one-line intro, and the sections a page leaves out.
 *
 * Journeys (the hub and the sidebar follow them): start → guides → reference. The reading path is the first two; the
 * reference (generated from the code) is folded. A page the manifest does not list stays on GitHub; its old address
 * answers 308 (`REMOVED_DOCS` in src/core/config/redirects.ts). `clip` names a recording of `src/core/clips/clips.ts`.
 */

export const JOURNEYS = [
  { id: "start", icon: "rocket" },
  { id: "guides", icon: "sparkles" },
  { id: "packs", icon: "layers" },
  { id: "reference", icon: "code" },
];

/**
 * `source`: path in the Orazaka repository. `generated`: written from the code (the page says so, and "edit" leads to
 * the source file of the generator's input). `omit`: headings (prefix match) whose section is internal planning, left out.
 * `group`: a sub-heading of the reference in the sidebar.
 */
export const DOCS = [
  { slug: "101", journey: "start", order: 1, source: "docs/101.md", title: "Quickstart", intro: "Orazaka running on your machine in five minutes: install, start, ask, run a Studio.", audience: "everyone", clip: "take" },
  { slug: "concepts", journey: "start", order: 2, source: "docs/CONCEPTS.md", title: "Concepts", intro: "The whole model on one page: clients, engine, workers, packs, Studios and runs.", audience: "everyone", clip: "workspace" },

  { slug: "self-hosting", journey: "guides", order: 1, source: "docs/SELF_HOSTING.md", title: "Install, update and back up", intro: "A Mac, a Linux server or from source, then health, updates, rollback and backups. Your data never leaves your machine.", audience: "everyone" },
  { slug: "studio-guide", journey: "guides", order: 2, source: "docs/STUDIO_GUIDE.md", title: "Run a Studio", intro: "Install a Studio, run it from the web app or the terminal, read its result and its run record.", audience: "everyone", clip: "studio" },
  { slug: "content-policy", journey: "guides", order: 3, source: "docs/CONTENT_POLICY.md", title: "Content policy: you decide", intro: "What Orazaka refuses by itself, what you decide, and how a run is checked before a GPU second is spent.", audience: "everyone" },

  { slug: "api", journey: "reference", group: "integrate", order: 1, source: "docs/_generated/API_REFERENCE.md", generated: true, title: "API", intro: "Every REST endpoint of every service, with the authorisation rule that guards it.", audience: "developer" },
  { slug: "cli", journey: "reference", group: "integrate", order: 2, source: "docs/_generated/CLI.md", generated: true, title: "CLI", intro: "Every command, subcommand and option of the orazaka CLI.", audience: "developer" },
  { slug: "tools", journey: "reference", group: "integrate", order: 3, source: "docs/_generated/TOOLS.md", generated: true, title: "Tools and MCP", intro: "What a model may call during a turn: tools, MCP servers, the tool cache and the write sandbox.", audience: "developer" },
  { slug: "worker-protocol", journey: "reference", group: "integrate", order: 4, source: "docs/WORKER_PROTOCOL.md", title: "Worker protocol", intro: "The AMQP contract a worker speaks to join the platform, in any language.", audience: "developer" },
  { slug: "automation", journey: "reference", group: "integrate", order: 5, source: "docs/AUTOMATION.md", title: "Automation and the local agent", intro: "The protocol of the local executing agent and the automation worker.", audience: "developer" },
  { slug: "packs", journey: "packs", order: 1, source: "docs/_generated/PACKS.md", generated: true, title: "Packs and Studios", intro: "The catalogue, every manifest field, and how to write, validate and install a pack.", audience: "everyone" },
  { slug: "jobs", journey: "reference", group: "platform", order: 2, source: "docs/_generated/JOBS.md", generated: true, title: "Jobs, schedules and automation", intro: "The job plane, its workers, every scheduled task and the automation connectors.", audience: "everyone" },
  { slug: "models", journey: "reference", group: "platform", order: 3, source: "docs/_generated/MODELS.md", generated: true, title: "Models", intro: "Every supported model: where it runs, its licence and its context window.", audience: "everyone" },
  { slug: "measured-runs", journey: "reference", group: "platform", order: 4, source: "docs/_generated/MEASURED_RUNS.md", generated: true, title: "Measured runs", intro: "Time, cost and parameters of the runs Orazaka made, per model and provider, failures included.", audience: "everyone" },
  { slug: "admin", journey: "reference", group: "platform", order: 5, source: "docs/_generated/ADMIN.md", generated: true, title: "Administration", intro: "What an administrator controls, and how the console is secured.", audience: "operator" },
  { slug: "architecture", journey: "reference", group: "platform", order: 6, source: "docs/_generated/ARCHITECTURE.md", generated: true, title: "Architecture", intro: "The module map, dependencies, runtime flows, interceptor pipeline and messaging topology.", audience: "developer" },
  { slug: "auth", journey: "reference", group: "policies", order: 1, source: "docs/AUTH.md", title: "Authentication and sessions", intro: "How identity, sessions and access control work, flow by flow.", audience: "operator" },
  { slug: "security", journey: "reference", group: "policies", order: 2, source: "SECURITY.md", title: "Security policy", intro: "How to report a vulnerability and which versions get fixes.", audience: "operator" },
  { slug: "licensing", journey: "reference", group: "policies", order: 3, source: "docs/LICENSING.md", title: "Licensing", intro: "What Apache-2.0 covers across the repositories, and where the proprietary line falls.", audience: "decision-maker" },
  { slug: "mobile-guide", journey: "reference", group: "policies", order: 4, source: "docs/MOBILE.md", title: "The mobile app, screen by screen", intro: "What the app does today, how to run it against the local stack, and which screens do not read the server yet.", audience: "everyone" },
];

/** The pages that are not a markdown file of the source: the hub links them, the sidebar lists them. */
export const SPECIAL = [{ slug: "mobile", journey: "guides", order: 4, title: "The mobile app in four steps", intro: "Sign in, run a Studio, ask the model, follow your jobs: four screens, each explained.", audience: "everyone" }];
