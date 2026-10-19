# orazaka-web-client — Governance scope (agent-neutral)

> This repository is one component of the **Orazaka platform**. The normative contract is
> [`AGENTS.md`](https://github.com/krizaka/orazaka/blob/main/AGENTS.md) at the root of the Orazaka workspace
> ([`krizaka/orazaka`](https://github.com/krizaka/orazaka)), together with its `.agent/rules/*`. When this repository
> is cloned inside the workspace (`orazaka-apps/ui/orazaka-web-client`), that contract is loaded first and applies
> without exception. **No rule lives here** — this file only scopes it.

## Scope of this repository

- **Role:** Next.js (App Router) client of the Orazaka platform with its mandatory BFF.
- **Layer:** Client application
- **Depends on:** orazaka-ui-kit — never on another repository's Tier-3 implementation (AGENTS.md §2, [SEAM-002]).
- **Workspace path:** `orazaka-apps/ui/orazaka-web-client`

## Static rules & codemods (ast-grep)

The org code rules (addendum 2026-10-15) are lint rules, not review comments. [`@ast-grep/cli`](https://ast-grep.github.io)
is a **pinned devDependency** (no global install, CI reproduces local): `sgconfig.yml` + `rules/*.yml` (one rule per file,
with a message and, where safe, a `fix:`; written for Tsx and `.ts` is parsed as Tsx too, so each rule covers `.ts` and `.tsx`), `rule-tests/` (valid/invalid cases of each rule).

| Rule | What it refuses |
| :--- | :--- |
| `no-hand-ms-*`, `no-get-time-difference`, `no-get-time-arithmetic` | hand-written time arithmetic (`n * 60 * 1000`, `a.getTime() - b.getTime()`): date-fns, or a duration read from the settings |
| `no-env-in-domain` | an `env` import in domain code (`packages/*/src`, `src/`): the value arrives as a parameter |
| `no-db-in-service-or-rules` | a db client / schema import in `*.service.ts`, `*-service.ts`, `*.rules.ts`, `*-rules.ts` |
| `no-ts-enum` | the TypeScript `enum` keyword (`as const` object + derived type, or a Postgres enum) |
| `no-enum-string-compare` | `x.status === "OPEN"` (field named status/kind/role/reason/state/direction compared to a string literal) |
| `no-ambient-clock` | `new Date()` / `Date.now()` in domain code: the clock is injected |
| `no-types-at-package-root` | `types.ts` at a package root (`<feature>/<feature>.types.ts`) |
| `no-unjustified-numeric-export` | a numeric (or `…ToMilliseconds(n)`) `export const` in feature code without `// @fixed: <reason>` just above |
| `no-hand-made-nav`, `no-hand-made-language-switch` | a navigation bar that is not `NavBar` of @krizaka/ui (own Radix NavigationMenu, a local `NavBar`/`TopNav`), a hand-made language switch (`hrefLang` in a component, a row of `aria-pressed={locale === …}` buttons): use `NavBar` and `NavBar.Language` (« Navigation in the family », ui.krizaka.com) |

- **Run**: `npm run lint` runs everything (it includes `ast-grep test` and the ratchet). `npx ast-grep scan` lists the
  violations with their message; `npm run lint:sg:test` runs the rule tests.
- **Ratchet**: `scripts/sg-ratchet.mjs` counts the violations per rule and refuses any increase against
  `sg-ratchet.json` (same idea as `krizaka-ratchet` / `lint-ratchet.json`: the debt only goes down). Fixed some? Lock the gain with
  `npm run sg:ratchet:update` (it never raises a count and records a new rule at its current count). A new rule is
  added with its test in `rule-tests/` and its baseline in the same pull request. The script is identical in every
  Krizaka TypeScript repository (keep the copies identical; its unit test is `scripts/sg-ratchet.test.mjs`).
- **Codemods**: `npm run sg:fix` applies the `fix:` of the rules (`ast-grep scan --update-all`) and adds the date-fns import;
  behaviour is identical — run `npm run lint && npm test` after, and land the result in a small pull request.
- A rule is never silenced to get a PR green; fix the code, or (a business parameter that is a technical fact) justify it with `// @fixed:`.

## One app, two hosts (dev.orazaka.com · admin.orazaka.com)

The operator console of the former `orazaka-web-admin` lives here, served by **host routing** (krizaka/orazaka-web-admin#31):
`src/proxy.ts` → `src/console/core/config/host.ts` (`routeFor`, pure) rewrites `Host: admin.*` under `/console`
(`src/app/console/**`, logic in `src/console/**`) and answers 404 for `/console/**` on every other host; the network gate
(`AUTH_ALLOWED_IPS`, 403) runs before any console route, sign-in included (`src/console/core/edge.ts`). The console never
shares the public site's session cookie, signing key (`AUTH_CONSOLE_SECRET`) or sign-in flag (`AUTH_CONSOLE_LOGIN_ENABLED`).
The public shell (`PublicShell`) skips itself for the `console` segment, so public pages stay static. Never add a console
route outside `src/app/console`, never link `/console/...` (addresses on the admin host are unprefixed), and keep
`/api/healthz` answered before any gate. Tests: `src/__tests__/host-routing.test.ts`, `npm run test:console`.

## Definition of done

1. `npm run validate` (or `lint` + `build`) is green inside the workspace (`orazaka-apps/ui`).
2. No hard-coded colors, 250-line cap per component, types only from `@krizaka/orazaka-shared` (AGENTS.md §8).
3. PR captures (screenshots, recordings, metrics) are never committed: they go to Bunny Storage under `pr-assets/<repo>/<pr-or-topic>/` with [`scripts/pr-assets.mjs`](https://github.com/krizaka/krizaka-com/blob/main/scripts/pr-assets.mjs) of krizaka-com (its AGENTS.md §5.1), and the PR body links their CDN URLs. `docs/screenshots/`, `.github/pr-assets/` and `.github/screenshots/` are git-ignored.
4. The change ships with its tests — a unit test for logic, a render test for a component, an end-to-end test for a
   route or a flow; a fix starts with a failing test that reproduces the bug. CI runs them and must be green; no test =
   not done (workspace [`AGENTS.md` §9](https://github.com/krizaka/orazaka/blob/main/AGENTS.md#9-testing)).

## Search engines & AI assistants (Krizaka family contract)

The contract is defined once, in krizaka-com `AGENTS.md` §2.4, and checked here by `scripts/check-seo-family.mjs` (a copy of
the same dependency-free file in every site's repository — keep the copies identical; its unit test sits beside it).

dev.orazaka.com is **indexed** (`src/core/config/seo.ts`: origin, crawlers, JSON-LD, `llms.txt`/`llms-full.txt` rendered from the synced docs; `src/app/robots.ts`, `sitemap.ts`, `opengraph-image.tsx`). The language is chosen in the page (one URL per page), so there is no hreflang. The sign-in proxy (`src/proxy.ts`) must keep those files public. Tests: `src/__tests__/seo.test.ts`.
