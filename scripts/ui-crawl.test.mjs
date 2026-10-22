// Dev preview `ui.themes-devices` (orazaka-web-client#124): the UI crawl exists, covers both themes and both viewports,
// reads the sitemap, and the post-deploy workflow runs it against the deployed site.
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");
const crawl = read("e2e/ui-crawl.mjs");

test("the crawl covers dark and light, phone and desktop", () => {
  assert.match(crawl, /THEMES = \["dark", "light"\]/);
  assert.match(crawl, /desktop:/);
  assert.match(crawl, /phone:/);
});

test("it checks what the criterion asks: console errors, horizontal scroll, one footer, broken pictures, empty tiles, colours", () => {
  for (const needle of ["pageerror", "horizontal scroll", "page footers", "broken picture", "empty tile", "hard-coded colour"]) {
    assert.ok(crawl.includes(needle), `missing: ${needle}`);
  }
});

test("public screens come from the sitemap, signed-in screens need a persona (E2E_USER / E2E_PASSWORD)", () => {
  assert.match(crawl, /sitemap\.xml/);
  assert.match(crawl, /E2E_USER/);
  assert.match(crawl, /E2E_PASSWORD/);
  for (const screen of ["/", "/studios", "/packs", "/chat", "/jobs"]) assert.ok(crawl.includes(`"${screen}"`), `signed-in screen ${screen}`);
});

test("captures go to a scratch folder (OUT), never into the repository", () => {
  assert.match(crawl, /process\.env\.OUT/);
  assert.doesNotMatch(crawl, /docs\/screenshots/);
});

test("it is an npm script and a step of its own post-deploy workflow (a failing smoke never hides it)", () => {
  assert.equal(JSON.parse(read("package.json")).scripts["test:ui-crawl"], "node e2e/ui-crawl.mjs");
  const wf = read(".github/workflows/dev-preview-live.yml");
  assert.ok(wf.includes("npm run test:ui-crawl"));
  assert.ok(wf.includes("Wait for the deployed build"));
});

test("the post-deploy workflow also runs the SEO family contract against the deployed site, indexed (seo.family)", () => {
  const wf = read(".github/workflows/dev-preview-live.yml");
  assert.match(wf, /node scripts\/check-seo-family\.mjs --base https:\/\/www\.orazaka\.com --host https:\/\/www\.orazaka\.com(\s|$)/);
  assert.ok(!/--index off/.test(wf), "www.orazaka.com is indexed (AGENTS.md)");
});

test("the console crawl covers every console screen in both themes and both viewports, and checks the DEV badge (admin.shell)", () => {
  const c = read("e2e/console-crawl.mjs");
  assert.match(c, /THEMES = \["dark", "light"\]/);
  assert.match(c, /desktop:/);
  assert.match(c, /phone:/);
  for (const screen of ["/operations", "/tasks", "/users", "/billing", "/models", "/studios", "/audit"]) assert.ok(c.includes(`"${screen}"`), screen);
  assert.ok(c.includes("no DEV badge"));
  assert.equal(JSON.parse(read("package.json")).scripts["test:console-crawl"], "node e2e/console-crawl.mjs");
});

test("the same workflow proves the console gate from outside: 403 on the admin host, 404 on the public one (admin.gated)", () => {
  const wf = read(".github/workflows/dev-preview-live.yml");
  assert.match(wf, /admin\.orazaka\.com\/login[^\n]*\n?[^\n]*= 403/);
  assert.match(wf, /www\.orazaka\.com\/console[^\n]*= 404/);
});
