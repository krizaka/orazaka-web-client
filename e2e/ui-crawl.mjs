#!/usr/bin/env node
/**
 * The UI crawl (Dev preview `ui.krizaka-ui` + `ui.themes-devices`, orazaka-web-client#124): the key screens in dark AND
 * light, on a desktop and a phone viewport, against a DEPLOYED Orazaka (E2E_BASE_URL, https://dev.orazaka.com by default):
 *
 *   - no console error and no uncaught page error;
 *   - no horizontal scroll (nothing cut at the side);
 *   - the page never overflows (containment, krizaka-ui `parameters.contain`): no visible box sticks out past the
 *     viewport or past the scroll container that holds it (a decorative aria-hidden layer or a clipped one may);
 *   - exactly one footer (« A Krizaka product ») and a navigation landmark;
 *   - no broken picture and no empty tile (a control that renders nothing);
 *   - no hard-coded colour in the inline styles of the page (the tokens are `var(--kz-*)`).
 *
 * Public screens come from the site's own sitemap.xml (a page added there is crawled); the signed-in screens need a
 * demo persona (E2E_USER / E2E_PASSWORD) and are skipped, said out loud, without one. A capture of each screen is saved
 * when OUT is set (the set goes to Bunny `pr-assets/orazaka-web-client/dev-preview/`, never to git).
 *
 *   E2E_USER=… E2E_PASSWORD=… OUT=/tmp/orazaka-crawl npm run test:ui-crawl
 *
 * Read-only: it opens pages, never submits anything but the sign-in form.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = (process.env.E2E_BASE_URL || "https://dev.orazaka.com").replace(/\/$/, "");
const OUT = process.env.OUT || "";
const USER = process.env.E2E_USER;
const PASSWORD = process.env.E2E_PASSWORD;
const PUBLIC_LIMIT = Number(process.env.CRAWL_PUBLIC_LIMIT || 14);
const THEMES = ["dark", "light"];
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } };
const SIGNED_IN = ["/", "/studios", "/packs", "/chat", "/jobs", "/usage", "/automation", "/settings"];

/** Console messages that are not Orazaka's (a blocked third-party beacon, a missing favicon). */
const IGNORED_CONSOLE = [/Download the React DevTools/i, /favicon/i, /Failed to load resource.*(401|403|404)/i];

const say = (line) => process.stdout.write(`${line}\n`);

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("✗ Playwright is missing: npm install, then npx playwright install chromium.");
  process.exit(2);
}

const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => (r.ok ? r.text() : null), () => null);
if (sitemap === null) {
  console.error(`✗ Nothing answers at ${BASE}/sitemap.xml: set E2E_BASE_URL to a running Orazaka.`);
  process.exit(2);
}
// The sections with a distinct layout first (home, docs, the Mac page), then the rest up to the limit.
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/");
const picked = [...new Set(["/", "/docs", "/desktop", ...paths])].slice(0, PUBLIC_LIMIT);
const PAGES = [
  ...picked.map((url) => ({ name: url === "/" ? "home" : url.slice(1).replace(/\//g, "-"), url })),
  // The sign-in screen is the auth layout (no bar, no footer, by design); the signed-in app is the rail + header shell
  // (a navigation landmark, no page footer): the family footer belongs to the public pages.
  { name: "login", url: "/login", chrome: "auth" },
  ...(USER && PASSWORD ? SIGNED_IN.map((url) => ({ name: url === "/" ? "app-home" : url.slice(1), url, session: true, chrome: "app" })) : []),
];
if (!(USER && PASSWORD)) say("· signed-in screens skipped: set E2E_USER and E2E_PASSWORD (a demo persona)");

if (OUT) mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

let signedIn;
if (USER && PASSWORD) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', USER);
  await page.fill('input[type="password"]', PASSWORD);
  await page.keyboard.press("Enter");
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 30_000 }).catch(() => {});
  if (new URL(page.url()).pathname.startsWith("/login")) {
    console.error("✗ the persona could not sign in on the deployed site");
    process.exit(2);
  }
  signedIn = await context.storageState();
  await context.close();
}

/** What the page itself says about its layout and family contract (run in the page). */
function inspect(chrome) {
  const problems = [];
  const doc = document.documentElement;
  if (doc.scrollWidth > doc.clientWidth + 1) problems.push(`horizontal scroll (${doc.scrollWidth}px in a ${doc.clientWidth}px viewport)`);
  const clipped = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.getAttribute("aria-hidden") === "true" || n.hasAttribute("inert")) return true;
      if (n !== el && ["hidden", "clip", "auto", "scroll"].includes(getComputedStyle(n).overflowX)) return true;
    }
    return false;
  };
  const sticking = [...document.querySelectorAll("body *")].filter((el) => {
    const box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return false;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none" || style.position === "fixed") return false;
    return box.right > doc.clientWidth + 1 && !clipped(el);
  });
  if (sticking.length > 0) problems.push(`never overflows: ${sticking.length} box(es) past the viewport (first: ${sticking[0].tagName.toLowerCase()}${sticking[0].className && typeof sticking[0].className === "string" ? `.${sticking[0].className.split(/\s+/)[0]}` : ""})`);
  for (const box of document.querySelectorAll("main, aside, header, nav")) {
    if (getComputedStyle(box).overflowX === "visible" && box.scrollWidth > box.clientWidth + 1 && box.clientWidth > 0) problems.push(`never overflows: <${box.tagName.toLowerCase()}> content wider than its box (${box.scrollWidth}px in ${box.clientWidth}px)`);
  }
  const topFooters = [...document.querySelectorAll("footer")].filter((f) => !f.closest("main, article, section, dialog, [role=dialog]"));
  if (chrome === "public") {
    if (topFooters.length !== 1) problems.push(`${topFooters.length} page footers (one « A Krizaka product » footer expected)`);
    else if (!/krizaka/i.test(topFooters[0].textContent || "")) problems.push("the footer does not name Krizaka");
  } else if (topFooters.length > 1) problems.push(`${topFooters.length} page footers (at most one)`);
  if (chrome !== "auth" && !document.querySelector("nav")) problems.push("no <nav> landmark");
  for (const img of document.querySelectorAll("img")) {
    const box = img.getBoundingClientRect();
    if (box.width > 8 && box.height > 8 && img.complete && img.naturalWidth === 0 && img.currentSrc) problems.push(`broken picture ${img.currentSrc.slice(0, 80)}`);
  }
  for (const el of document.querySelectorAll("main a[href], main button")) {
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const visible = style.visibility !== "hidden" && style.display !== "none";
    if (visible && box.width > 0 && box.height > 0 && box.height < 4) problems.push(`collapsed control ${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}`);
    else if (visible && box.width > 24 && box.height > 24 && !el.textContent?.trim() && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.querySelector("img, svg, video, picture, canvas")) problems.push("empty tile (a control with nothing in it)");
  }
  const hard = [...document.querySelectorAll("[style]")].filter((e) => /#[0-9a-f]{3,8}\b|rgba?\(/i.test(e.getAttribute("style") || "") && !/var\(/.test(e.getAttribute("style") || ""));
  if (hard.length > 0) problems.push(`${hard.length} element(s) with a hard-coded colour in an inline style`);
  return [...new Set(problems)];
}

async function crawl(p, theme, device, viewport) {
  const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: "reduce", ...(p.session ? { storageState: signedIn } : {}) });
  await context.addInitScript((mode) => {
    try {
      localStorage.setItem("kz-theme", mode);
    } catch {}
  }, theme);
  const consoleErrors = [];
  try {
    const page = await context.newPage();
    page.on("console", (m) => m.type() === "error" && !IGNORED_CONSOLE.some((re) => re.test(m.text())) && consoleErrors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => consoleErrors.push(`uncaught: ${e.message.slice(0, 160)}`));
    await page.goto(`${BASE}${p.url}`, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
    await page.waitForTimeout(500);
    const problems = await page.evaluate(inspect, p.chrome ?? "public");
    if (consoleErrors.length > 0) problems.push(...consoleErrors.slice(0, 3).map((m) => `console: ${m}`));
    if (OUT) await page.screenshot({ path: join(OUT, `${p.name}.${theme}.${device}.png`), fullPage: false });
    return problems;
  } finally {
    await context.close();
  }
}

let failures = 0;
let checked = 0;
for (const [device, viewport] of Object.entries(VIEWPORTS)) {
  for (const theme of THEMES) {
    for (const p of PAGES) {
      const label = `${p.name} · ${theme} · ${device}`;
      let problems;
      for (let attempt = 1; attempt <= 2 && !problems; attempt++) {
        try {
          problems = await crawl(p, theme, device, viewport);
        } catch (error) {
          if (attempt === 2) problems = [`could not be crawled: ${error.message.split("\n")[0]}`];
        }
      }
      checked++;
      if (problems.length === 0) say(`✓ ${label}`);
      else {
        failures++;
        say(`✗ ${label}`);
        for (const problem of problems) say(`    · ${problem}`);
      }
    }
  }
}
await browser.close();
say(`\n${checked - failures}/${checked} screens clean${OUT ? `, captures in ${OUT}` : ""}`);
process.exit(failures > 0 ? 1 : 0);
