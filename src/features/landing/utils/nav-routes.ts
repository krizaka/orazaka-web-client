/**
 * Routes that are named in the bar before they exist. An entry whose route is `false` is kept in the nav data but not
 * rendered — no dead link — and appears when its page ships: flip the flag in the PR that adds the route.
 */
export const SHIPPED_ROUTES = {
  /** `/infrastructure` — « Run it », built by another session. */
  infrastructure: false,
} as const;
