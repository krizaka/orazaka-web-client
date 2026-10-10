// Product tour of the real application, recorded for krizaka.com (public/assets/orazaka/tour/<clip>.{webm,mp4,jpg}).
//
//   orazaka start && orazaka dev           # the whole stack, or at least identity, edge, conversation, billing, studio
//   npm run build && npm run start         # a production build: no dev overlay in the frames
//   npm run record:tour                    # ORAZAKA_URL (default http://localhost:3000), OUT (default tour/)
//
// Four clips, chained by the site's ProductTour: home (the landing page), chat (a question answered by the local
// model, streamed), studios (dashboard → Studios → one Studio), settings (Packs → Profile → Appearance, theme switch).
// Each clip is recorded at 1440×900 by Playwright, then encoded by ffmpeg to 1280×800 at 25 fps: VP9 .webm, H.264 .mp4
// (faststart) and a .jpg poster — the format of the Orochia clips. Sign-in uses the development seed account
// (TOUR_LOGIN / TOUR_PASSWORD, default admin@orazaka.com) and happens outside the recording.
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const BASE = (process.env.ORAZAKA_URL || "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve(process.env.OUT || "tour");
const LOGIN = process.env.TOUR_LOGIN || "admin@orazaka.com";
const PASSWORD = process.env.TOUR_PASSWORD || "Admin123!";
const QUESTION = process.env.TOUR_QUESTION || "In two sentences: why should a company run its AI on its own hardware?";
const ONLY = process.argv.slice(2); // e.g. `npm run record:tour -- chat`
const VIEWPORT = { width: 1440, height: 900 };

let chromium;
try {
  ({ chromium } = await import("@playwright/test"));
} catch {
  console.error("✗ Playwright is missing: npm install, then npx playwright install chromium.");
  process.exit(2);
}
if (!(await fetch(`${BASE}/login`).then((r) => r.ok, () => false))) {
  console.error(`✗ Nothing answers at ${BASE}: start the web client (npm run start) or set ORAZAKA_URL.`);
  process.exit(2);
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });
const raw = await mkdtemp(path.join(os.tmpdir(), "orazaka-tour-"));
const pause = (page, ms) => page.waitForTimeout(ms);

/** A browser context in dark English, signed in when `state` is given. */
async function context(state, record) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: "dark",
    storageState: state,
    recordVideo: record ? { dir: raw, size: VIEWPORT } : undefined,
  });
  await ctx.addInitScript(() => {
    try {
      if (!sessionStorage.getItem("tour-init")) {
        localStorage.setItem("kz-theme", "dark");
        localStorage.setItem("orazaka_language", "en");
        sessionStorage.setItem("tour-init", "1");
      }
    } catch {}
  });
  return ctx;
}

/** Signs in once through the real form and keeps the session for the recorded contexts. */
async function signIn() {
  const ctx = await context(undefined, false);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`);
  await page.fill('input[type="email"]', LOGIN);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/`, { timeout: 60_000 });
  const state = await ctx.storageState();
  await ctx.close();
  return state;
}

/** Scrolls the page (or its scrolling container) smoothly by `dy` pixels. */
async function glide(page, dy, ms = 1400, selector) {
  await page.evaluate(
    ({ dy, selector }) => (selector ? document.querySelector(selector) : window)?.scrollBy({ top: dy, behavior: "smooth" }),
    { dy, selector },
  );
  await pause(page, ms);
}

const CLIPS = {
  async home(page) {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    return async () => {
      await pause(page, 5200); // the sovereign chat answers on its own
      // Hero → why (the isometric scene) → platform → cost & control → how → Studios → the last call.
      for (const dy of [760, 900, 1000, 900, 900, 900, 900]) await glide(page, dy, 1700);
      await pause(page, 800);
    };
  },

  async chat(page) {
    await page.goto(`${BASE}/chat`, { waitUntil: "load" });
    await page.locator("textarea").first().waitFor();
    return async () => {
      await pause(page, 1200);
      const box = page.locator("textarea").first();
      await box.click();
      await box.pressSequentially(QUESTION, { delay: 28 });
      await pause(page, 400);
      await page.getByRole("button", { name: /^Send/ }).click();
      // The composer is locked while the engine works (ERR-126): the turn is over when it is editable again. A cold
      // model can think for a while before its first token, so "the page stopped changing" is not the signal.
      const composer = (locked) => page.waitForFunction((l) => document.querySelector("textarea")?.disabled === l, locked, { timeout: locked ? 5_000 : 120_000, polling: 250 }).catch(() => {});
      await composer(true);
      await composer(false);
      // Then let the streamed answer settle.
      let last = "";
      for (let stable = 0, i = 0; stable < 4 && i < 90; i++) {
        await pause(page, 500);
        const now = await page.locator("body").innerText();
        stable = now === last && now.length > QUESTION.length + 40 ? stable + 1 : 0;
        last = now;
      }
      await pause(page, 1800);
    };
  },

  async studios(page) {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    return async () => {
      await pause(page, 1400);
      await page.getByRole("link", { name: /^Studios$/ }).first().click();
      await page.getByRole("tab", { name: /Explore/ }).or(page.getByRole("button", { name: /Explore/ })).first().click();
      await pause(page, 2200);
      await glide(page, 420, 1600, "main");
      const card = page.getByText("Trade Showcase").first();
      await card.hover();
      await pause(page, 900);
      await card.click();
      await pause(page, 3200);
    };
  },

  async settings(page) {
    await page.goto(`${BASE}/packs`, { waitUntil: "load" });
    return async () => {
      await pause(page, 2600);
      await page.goto(`${BASE}/profile?tab=appearance`, { waitUntil: "load" });
      await pause(page, 2000);
      await page.getByRole("button", { name: /Light Mode/ }).click();
      await pause(page, 2200);
      await page.getByRole("button", { name: /Dark Mode/ }).click();
      await pause(page, 2000);
    };
  },
};

/** Records one clip, then encodes it next to the others. */
async function record(id, state) {
  const ctx = await context(id === "home" ? undefined : state, true);
  const page = await ctx.newPage();
  const opened = Date.now();
  const play = await CLIPS[id](page);
  await pause(page, 1500); // fonts, data, first paint settle before the clip starts
  const start = (Date.now() - opened) / 1000;
  await play();
  const video = page.video();
  await ctx.close();
  const source = await video.path();

  const target = path.join(OUT, id);
  const trim = ["-y", "-loglevel", "error", "-ss", start.toFixed(2), "-i", source, "-vf", "scale=1280:800:flags=lanczos,fps=25", "-an"];
  execFileSync("ffmpeg", [...trim, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "42", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", `${target}.webm`]);
  execFileSync("ffmpeg", [...trim, "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${target}.mp4`]);
  const duration = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", `${target}.mp4`]).toString(),
  );
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", (duration * 0.7).toFixed(2), "-i", `${target}.mp4`, "-frames:v", "1", "-q:v", "4", `${target}.jpg`]);
  process.stdout.write(`✓ ${id}  ${duration.toFixed(1)} s → ${path.relative(process.cwd(), target)}.{webm,mp4,jpg}` + "\n");
}

try {
  const state = await signIn();
  // Warm the local model up outside the recording: the first answer of a cold Ollama loads its weights.
  const ollama = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  await fetch(`${ollama}/api/generate`, {
    method: "POST",
    body: JSON.stringify({ model, prompt: "ok", stream: false, keep_alive: "15m" }),
  }).catch(() => console.warn(`⚠ Ollama did not answer at ${ollama}: the chat clip will wait for a cold model.`));
  for (const id of Object.keys(CLIPS)) if (ONLY.length === 0 || ONLY.includes(id)) await record(id, state);
} finally {
  await browser.close();
  await rm(raw, { recursive: true, force: true });
}
