/**
 * @file auth-flags.ts
 * @description Feature flags of the sign-in and sign-up entry points (bounded context AUTH_).
 *
 * `AUTH_LOGIN_ENABLED` and `AUTH_SIGNUP_ENABLED` default to false: the public development site is read-only —
 * no sign-in, no sign-up and no call to the backend (no edge URL is needed to build or run it). They are read
 * on the server (root layout, proxy, API routes) and handed to the client by `AuthFlagsProvider`.
 */

export interface AuthFlags {
  login: boolean;
  signup: boolean;
}

/** `true`, `1`, `yes` and `on` (any case) switch a flag on; anything else, or nothing, is off. */
export function parseFlag(value: string | undefined): boolean {
  return ["true", "1", "yes", "on"].includes((value ?? "").trim().toLowerCase());
}

export function readAuthFlags(env: Record<string, string | undefined> = process.env): AuthFlags {
  return { login: parseFlag(env.AUTH_LOGIN_ENABLED), signup: parseFlag(env.AUTH_SIGNUP_ENABLED) };
}

/** Neither way in is open: the site is a showcase and must not reach the backend. */
export function authClosed(flags: AuthFlags): boolean {
  return !flags.login && !flags.signup;
}

const BACKEND_PREFIXES = ["/api/v1", "/api/auth", "/api/chat", "/uploads"];

/** Paths served by the BFF on behalf of a signed-in user — they answer 404 when the site is closed. */
export function isBackendPath(pathname: string): boolean {
  return BACKEND_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
