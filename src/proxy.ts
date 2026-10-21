/**
 * @file proxy.ts
 * @description Next.js Proxy (ex-Middleware) for authentication gating.
 * Redirects unauthenticated users to /login for protected page routes.
 * Uses the next-auth session token cookie to determine auth status server-side,
 * avoiding skeleton flash on protected pages.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`; the exported
 * entrypoint is now named `proxy` (same request/response contract as before).
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authClosed, isBackendPath, readAuthFlags } from "@/core/config/auth-flags";
import { CLOSED_ROBOTS, devRedirect, indexable, isDevHost, NOINDEX_HEADER } from "@/core/config/indexing";
import { SITE_URL } from "@/app/_seo/seo";
import { consoleResponse } from "@/console/core/edge";
import { isAdminHost, routeFor } from "@/console/core/config/host";
/** The platform's liveness probe: answered on every host, before any gate. */
const HEALTH_PATH = "/api/healthz";

/**
 * Route prefixes that do NOT require authentication.
 */
const PUBLIC_PREFIXES = [
  "/login",
  "/register",
  "/api/",        // All API routes (auth, BFF proxy, etc.)
  "/.well-known/", // Universal links / App Links files (app-links.json)
  "/_next/",      // Next.js internals (static, image, RSC payloads, HMR)
  "/favicon",
  "/logo.svg",
  "/privacy",
  "/terms",
  "/contact",
  "/docs",
  "/mobile",
  "/desktop",
  // What search engines and AI assistants read (src/app/robots.ts, sitemap.ts, llms*.txt, opengraph-image.tsx).
  "/robots.txt",
  "/sitemap.xml",
  "/llms",
  "/opengraph-image",
];

/**
 * Checks whether a given pathname matches any public (unauthenticated) route prefix.
 */
function isPublicPath(pathname: string): boolean {
  // `/` itself is public: it renders the landing page for a visitor and the dashboard for a session
  // (src/app/page.tsx). It cannot be a prefix — every path starts with "/".
  return pathname === "/" || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function route(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Both entry points closed (AUTH_LOGIN_ENABLED / AUTH_SIGNUP_ENABLED false): nothing is proxied to the backend.
  if (authClosed(readAuthFlags()) && isBackendPath(pathname)) {
    return NextResponse.json({ error: "Orazaka is in development — sign-in is closed on this site" }, { status: 404 });
  }

  // Allow public routes, API routes, and static assets through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for next-auth session token (works for both secure and dev cookies)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Two sites, one app. admin.orazaka.com is the operator console: its requests are gated (network, then sign-in) and
 * rewritten under the internal `/console` tree, and every answer says noindex. On any other host `/console` is a 404.
 * The rest is the public site; a deployment closed to search engines (APP_SEARCH_INDEXING=off) says noindex on every
 * response — pages, redirects, the BFF.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");
  // dev.orazaka.com (APP_DEV_HOST): robots.txt closes everything, a page goes to www (308); the BFF, auth and
  // /.well-known keep serving - all noindex (src/core/config/indexing.ts).
  if (isDevHost(host)) {
    const closed = (r: NextResponse) => {
      r.headers.set("x-robots-tag", NOINDEX_HEADER);
      return r;
    };
    if (pathname === "/robots.txt") return closed(new NextResponse(CLOSED_ROBOTS, { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } }));
    const to = devRedirect(request.method, pathname, request.nextUrl.search, process.env.APP_PUBLIC_URL ?? SITE_URL);
    if (to) return closed(NextResponse.redirect(to, 308));
    if (pathname !== HEALTH_PATH) return closed(route(request));
    return closed(NextResponse.next());
  }
  let response: NextResponse;
  if (pathname === HEALTH_PATH) {
    response = NextResponse.next();
  } else {
    const hostRoute = routeFor(host, pathname);
    if (pathname === "/robots.txt" && isAdminHost(host)) {
      // The console is never indexed: said here, for any address, before the network gate (a crawler must read it).
      return new NextResponse("User-agent: *\nDisallow: /\n", { status: 200, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": NOINDEX_HEADER } });
    }
    if (hostRoute.kind === "notFound") {
      response = new NextResponse("Not found", { status: 404 });
      if (isAdminHost(host)) response.headers.set("x-robots-tag", NOINDEX_HEADER);
    } else if (hostRoute.kind === "rewrite") {
      return consoleResponse(request, hostRoute.path);
    } else {
      response = route(request);
    }
  }
  if (!indexable()) response.headers.set("x-robots-tag", NOINDEX_HEADER);
  return response;
}

export const config = {
  /**
   * Run on pages and on the BFF routes (a closed site answers 404 there) — exclude static assets and internals.
   */
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon).*)",
  ],
};
