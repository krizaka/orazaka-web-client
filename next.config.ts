import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import { SECURITY_HEADERS } from "./src/core/config/security-headers";
import pkg from "./package.json";
import { formatVersion, resolveSha } from "./src/core/config/app-version";

/**
 * Load the monorepo-root `.env` (the single source of truth — see AGENTS.md) into
 * `process.env` before Next reads it. Next only auto-loads `.env*` from the
 * project dir, so a standalone `npm run dev` would otherwise start with no
 * `NEXTAUTH_SECRET`; NextAuth then derives an ephemeral secret that changes on
 * every restart, silently invalidating existing session cookies
 * (JWEDecryptionFailed → null session → 401 on every BFF call). Loading it here
 * makes the secret stable regardless of how the server is launched (`npm run dev`
 * or `orazaka dev`). Existing values win, matching dotenv's non-override rule.
 */
function loadRootEnv(): void {
  const envPath = path.resolve(__dirname, "..", "..", "..", ".env");
  let raw: string;
  try {
    raw = fs.readFileSync(envPath, "utf-8");
  } catch {
    return; // No root .env (e.g. CI) — rely on the ambient environment.
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadRootEnv();

const nextConfig: NextConfig = {
  // APP_VERSION (package.json + short sha) is shown in the footer of every deployed site.
  // NEXT_PUBLIC_APP_ENV names the environment in the bar's badge: this repository deploys dev.orazaka.com only until a
  // production site exists, hence the default.
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.APP_VERSION || formatVersion(pkg.version, resolveSha()),
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase() || "dev",
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // The contact form of this app is a placeholder: the public site sends people to krizaka.com's.
  async redirects() {
    return [
      { source: "/contact", destination: "https://www.krizaka.com/contact", permanent: false },
      // The mobile guide is a section of the documentation; the docs' pages were renamed (slugs without underscores).
      { source: "/mobile", destination: "/docs/mobile", permanent: true },
      { source: "/docs/api_reference", destination: "/docs/api", permanent: true },
      { source: "/docs/interface_contracts", destination: "/docs/interface-contracts", permanent: true },
      { source: "/docs/worker_protocol", destination: "/docs/worker-protocol", permanent: true },
      { source: "/docs/business_implementation", destination: "/docs/business-playbook", permanent: true },
      { source: "/docs/use_cases", destination: "/docs/use-cases", permanent: true },
    ];
  },
  // `next dev` would otherwise append its own block to AGENTS.md on every start; this repository's
  // AGENTS.md only scopes the workspace contract and must not drift (AGENTS.md §13).
  agentRules: false,
  // @krizaka/ui: the primitives the design system re-exports since 2.0 (ES modules) — listed so next/jest
  // transforms them like the design system itself.
  transpilePackages: ["@krizaka/orazaka-design-system", "@krizaka/orazaka-shared", "@krizaka/ui", "@krizaka/charts", "@krizaka/tokens", "@krizaka/icons", "@krizaka/intl", "@krizaka/pacer", "@tanstack/pacer", "@tanstack/react-table", "@tanstack/table-core", "@tanstack/react-virtual", "@tanstack/virtual-core", "@tanstack/store", "@tanstack/react-store", "@tanstack/markdown", "@tanstack/highlight"],
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  // /uploads/** is proxied by the authenticated BFF route (src/app/uploads/[...path]/route.ts),
  // which injects the user's Bearer token — a plain rewrite could not carry auth, so the router
  // (which protects /uploads/** with hasAnyAuthority) returned 401 for `<img>`/`<video>` requests.
};

export default nextConfig;
