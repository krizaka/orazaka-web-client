<!-- krizaka-header -->
<div align="center">

<img src=".github/assets/orazaka-logo.svg" alt="Orazaka" width="420">

# Orazaka Web Client

**The AI that never leaves home.**

Next.js (App Router) client of the Orazaka platform with its mandatory BFF.

[![CI](https://github.com/krizaka/orazaka-web-client/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/orazaka-web-client/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Orazaka](https://img.shields.io/badge/part%20of-Orazaka-f59e0b)](https://github.com/krizaka/orazaka#repositories)
[![Docs](https://img.shields.io/badge/docs-krizaka.com-6366f1)](https://www.krizaka.com/en/products/orazaka)

[Documentation](https://www.krizaka.com/en/products/orazaka) · [Website](https://www.krizaka.com) · [Krizaka on GitHub](https://github.com/krizaka)

</div>
<!-- /krizaka-header -->

**Layer:** Client application · **Version:** `1.0.0-SNAPSHOT` · **License:** Apache-2.0 ·
part of the [Orazaka platform](https://github.com/krizaka/orazaka) by [Krizaka](https://krizaka.com)

## What it provides

The Next.js (App Router) client of the platform (port `3000`). The browser **never** calls a service
directly: every request goes through the BFF routes (`/api/**`) authenticated by the next-auth
session. Built on [@krizaka/orazaka-design-system](https://github.com/krizaka/orazaka-ui-kit).

```bash
npm install && npm run dev
```

## Position in the platform

| | |
|:---|:---|
| Depends on | [`orazaka-ui-kit`](https://github.com/krizaka/orazaka-ui-kit) |
| Used by | _no other Orazaka repository._ |
| Workspace path | `orazaka-apps/ui/orazaka-web-client` |

## Build

**Inside the Orazaka workspace** (npm workspaces link `@krizaka/*` packages from source):

```bash
git clone https://github.com/krizaka/orazaka.git && cd orazaka
node scripts/workspace.mjs clone
cd orazaka-apps/ui && npm install
```

**Standalone**: add `@krizaka:registry=https://npm.pkg.github.com` to `.npmrc`, then `npm install`.

Requirements: Node.js 22+.

## UI: roles, one theme mechanism, platform primitives

- **Roles only.** Components write the [`@krizaka/tailwind`](https://github.com/krizaka/krizaka-ui) role utilities —
  `bg-surface-1`, `text-fg-secondary`, `border-border-subtle`, `bg-accent text-on-accent`, `text-danger` — never an
  arbitrary `[var(--…)]`, a raw palette colour, `light:`/`dark:` or a className template string. ESLint enforces the
  four `@krizaka/config` UI rules and `krizaka-ratchet` (`lint-ratchet.json`) holds them at zero (`npm run lint`).
- **Theme.** The organisation's mechanism, from `@krizaka/ui/theme`: `<ThemeScript />` in the root layout, dark on
  `:root`, light on `html.light`, a named theme (`custom`, `cyberpunk`, `solarized`, `krizaka`) on
  `html.theme-<name>`. `useAppearance()` maps the profile's single preference onto it.
- **Primitives.** `Card.*`, `Dialog`, `Toaster`/`toast`, `Popover`, `Alert`, `Button` come from `@krizaka/ui`;
  the Orazaka identity (Electric Blue, the named themes) from `@krizaka/orazaka-design-system/theme.css`.
- The one-shot migration that got here is `scripts/codemods/roles.mjs` (jscodeshift, tested by `npm run test:codemods`).

## Governance

This repository follows the Orazaka governance contract — [AGENTS.md](https://github.com/krizaka/orazaka/blob/main/AGENTS.md)
in the workspace is normative; the local [AGENTS.md](AGENTS.md) only scopes it to this repository.

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
