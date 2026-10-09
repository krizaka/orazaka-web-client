import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

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
  // @krizaka/ui: the primitives the design system re-exports since 2.0 (ES modules) — listed so next/jest
  // transforms them like the design system itself.
  transpilePackages: ["@krizaka/orazaka-design-system", "@krizaka/orazaka-shared", "@krizaka/ui"],
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  // /uploads/** is proxied by the authenticated BFF route (src/app/uploads/[...path]/route.ts),
  // which injects the user's Bearer token — a plain rewrite could not carry auth, so the router
  // (which protects /uploads/** with hasAnyAuthority) returned 401 for `<img>`/`<video>` requests.
};

export default nextConfig;
