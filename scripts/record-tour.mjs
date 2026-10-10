// Product tour of the real application, recorded for krizaka.com (public/assets/orazaka/tour/<clip>.{webm,mp4,jpg}).
//
//   orazaka start && orazaka dev           # the stack, with the image engine (sd-server, :8086)
//   orazaka demo seed                      # Eric, the demo persona (orazaka-cli) — never "admin"
//   npm run build && npm run start         # a production build: no dev overlay in the frames
//   npm run record:tour -- prepare         # Eric holds three conversations first (kept for the recordings)
//   npm run record:tour                    # every clip; `-- chat create` re-records some. ORAZAKA_URL, OUT (tour/)
//
// Clips, chained by the site: home (the public landing page), dashboard (Eric's workspace), chat (a question
// answered from the policy pasted under it, streamed by the local model), create (a product visual generated on
// this machine), studios (his Studios), packs (what his plan holds), settings (Appearance, theme switch).
// Each clip is recorded at 1440×900 by Playwright, then encoded by ffmpeg to 1280×800 at 25 fps: VP9 .webm, H.264
// .mp4 (faststart) and a .jpg poster — the format of the Orochia clips. Waiting for the image engine is cut from
// the create clip (the cut is declared on the site). Sign-in happens outside the recording.
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { setHours, setMinutes, startOfDay } from "date-fns";
import { ERIC, PREPARED, RECORDED_DOCUMENT, RECORDED_QUESTION, RECORDED_VISUAL } from "./tour/eric.mjs";

const BASE = (process.env.ORAZAKA_URL || "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve(process.env.OUT || "tour");
const LOGIN = process.env.TOUR_LOGIN || ERIC.login;
const PASSWORD = process.env.TOUR_PASSWORD || process.env.DEMO_PASSWORD || ERIC.password;
const ARGS = process.argv.slice(2);
const PREPARE = ARGS.includes("prepare");
const ONLY = ARGS.filter((a) => a !== "prepare");
const VIEWPORT = { width: 1440, height: 900 };
// The browser's clock reads 18:40 today (TOUR_TIME=HH:MM): the greeting and the timestamps of an evening's work
// look the same whenever the tour is re-recorded. Time still flows; only its starting point is set.
const [TOUR_H, TOUR_M] = (process.env.TOUR_TIME || "18:40").split(":").map(Number);
// Eric's browser between runs: the web client keeps transcripts where they were held (useMessageHistory).
const STATE = path.join(os.tmpdir(), `orazaka-tour-${new URL(BASE).port || "80"}.json`);

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
  await ctx.clock.setSystemTime(setMinutes(setHours(startOfDay(new Date()), TOUR_H), TOUR_M));
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

/** Signs Eric in through the real form; keeps what an earlier `prepare` left in his browser. */
async function signIn() {
  const kept = await readFile(STATE, "utf8").then(JSON.parse, () => undefined);
  const ctx = await context(kept ? { origins: kept.origins, cookies: [] } : undefined, false);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`);
  await page.fill('input[type="email"]', LOGIN);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/`, { timeout: 60_000 }).catch(() => {
    throw new Error(`Sign-in failed for ${LOGIN}: run \`orazaka demo seed\` first (or set TOUR_LOGIN / TOUR_PASSWORD).`);
  });
  return { ctx, page };
}

/** The turn is over when the composer is editable again (ERR-126), then when the streamed text settles. */
async function awaitAnswer(page, minLength) {
  const composer = (locked) =>
    page.waitForFunction((l) => document.querySelector("textarea")?.disabled === l, locked, { timeout: locked ? 5_000 : 180_000, polling: 250 }).catch(() => {});
  await composer(true);
  await composer(false);
  let last = "";
  for (let stable = 0, i = 0; stable < 4 && i < 120; i++) {
    await pause(page, 500);
    const now = await page.locator("main").first().innerText();
    stable = now === last && now.length > minLength ? stable + 1 : 0;
    last = now;
  }
}

/** Starts a new conversation from the empty composer with `text` (pasted, not typed). */
async function ask(page, text) {
  await page.goto(`${BASE}/chat`, { waitUntil: "load" });
  const box = page.locator("textarea").first();
  await box.waitFor();
  await box.fill(text);
  await page.getByRole("button", { name: /^Send/ }).click();
  await page.waitForURL(/conversationId=/, { timeout: 30_000 });
  await awaitAnswer(page, text.length / 2);
}

/** Scrolls the page (or its scrolling container) smoothly by `dy` pixels. */
async function glide(page, dy, ms = 1400, selector) {
  await page.evaluate(
    ({ dy, selector }) => (selector ? document.querySelector(selector) : window)?.scrollBy({ top: dy, behavior: "smooth" }),
    { dy, selector },
  );
  await pause(page, ms);
}

/** Each clip opens its page, then returns what to play once the page has settled; `cut` drops a wait. */
const CLIPS = {
  async home(page) {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    return async () => {
      await pause(page, 5200); // the sovereign chat answers on its own
      for (const dy of [760, 900, 1000, 900, 900, 900, 900]) await glide(page, dy, 1700);
      await pause(page, 800);
    };
  },

  async dashboard(page) {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await page.getByText(/Good (morning|afternoon|evening)/).waitFor();
    return async () => {
      await pause(page, 2600);
      const recent = page.locator("main").getByRole("button").filter({ hasText: /Summarise|Draft|sales/i }).first();
      if (await recent.count()) await recent.hover();
      await pause(page, 1600);
      await glide(page, 420, 1800, "main");
      await pause(page, 1800);
    };
  },

  async chat(page) {
    await page.goto(`${BASE}/chat`, { waitUntil: "load" });
    await page.locator("textarea").first().waitFor();
    return async () => {
      await pause(page, 1400);
      const box = page.locator("textarea").first();
      await box.click();
      await box.pressSequentially(RECORDED_QUESTION, { delay: 24 });
      await page.keyboard.insertText(`\n\n${RECORDED_DOCUMENT}`); // the policy, pasted
      await pause(page, 900);
      await page.getByRole("button", { name: /^Send/ }).click();
      await page.waitForURL(/conversationId=/, { timeout: 30_000 });
      await awaitAnswer(page, RECORDED_DOCUMENT.length);
      await pause(page, 2200);
    };
  },

  async create(page, cut) {
    await page.goto(`${BASE}/chat`, { waitUntil: "load" });
    await page.locator("textarea").first().waitFor();
    return async () => {
      await pause(page, 1200);
      await page.getByRole("button", { name: /Add Capability/ }).click();
      await pause(page, 1100);
      await page.getByRole("menu").getByText(/^Image generation$/).click();
      await pause(page, 700);
      const box = page.locator("textarea").first();
      await box.click();
      await box.pressSequentially(RECORDED_VISUAL, { delay: 18 });
      await pause(page, 600);
      await page.getByRole("button", { name: /^Send/ }).click();
      await page.getByText(/Generating/).first().waitFor({ timeout: 30_000 });
      await pause(page, 2500);
      cut.from();
      await page.getByText(/Generating/).first().waitFor({ state: "detached", timeout: 300_000 });
      await pause(page, 600);
      cut.to();
      await pause(page, 4200);
    };
  },

  async studios(page) {
    await page.goto(`${BASE}/studios`, { waitUntil: "load" });
    return async () => {
      await pause(page, 1400);
      await page.getByRole("tab", { name: /Explore/ }).or(page.getByRole("button", { name: /Explore/ })).first().click();
      await pause(page, 2200);
      await page.getByRole("button", { name: /^Sales$/ }).first().click();
      await pause(page, 1600);
      await page.getByText(/^Lead Research$/).first().hover();
      await pause(page, 1800);
      await page.getByText(/^Follow-up Sequences$/).first().hover();
      await pause(page, 2200);
    };
  },

  async packs(page) {
    await page.goto(`${BASE}/packs`, { waitUntil: "load" });
    return async () => {
      await pause(page, 2600);
      await page.getByText(/^Owned$/).first().hover().catch(() => {});
      await pause(page, 1800);
      await page.goto(`${BASE}/`, { waitUntil: "load" });
      await page.getByText(/Credits available/i).first().hover();
      await pause(page, 2600);
    };
  },

  async settings(page) {
    await page.goto(`${BASE}/profile?tab=appearance`, { waitUntil: "load" });
    return async () => {
      await pause(page, 2000);
      await page.getByRole("button", { name: /Light Mode/ }).click();
      await pause(page, 2200);
      await page.getByRole("button", { name: /Dark Mode/ }).click();
      await pause(page, 2000);
    };
  },
};

/** Records one clip, then encodes it next to the others (dropping the wait the clip declared). */
async function record(id, state) {
  const ctx = await context(id === "home" ? undefined : state, true);
  const page = await ctx.newPage();
  const opened = Date.now();
  const at = () => (Date.now() - opened) / 1000;
  const skip = {};
  const cut = { from: () => (skip.from = at()), to: () => (skip.to = at()) };
  const play = await CLIPS[id](page, cut);
  await pause(page, 1500); // fonts, data, first paint settle before the clip starts
  const start = at();
  await play();
  const video = page.video();
  await ctx.close();
  const source = await video.path();

  const target = path.join(OUT, id);
  const drop = skip.from && skip.to ? `select='not(between(t,${(skip.from - start).toFixed(2)},${(skip.to - start).toFixed(2)}))',setpts=N/FRAME_RATE/TB,` : "";
  const trim = ["-y", "-loglevel", "error", "-ss", start.toFixed(2), "-i", source, "-vf", `fps=25,${drop}scale=1280:800:flags=lanczos`, "-an"];
  execFileSync("ffmpeg", [...trim, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "42", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", `${target}.webm`]);
  execFileSync("ffmpeg", [...trim, "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${target}.mp4`]);
  const duration = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", `${target}.mp4`]).toString(),
  );
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", (duration * 0.7).toFixed(2), "-i", `${target}.mp4`, "-frames:v", "1", "-q:v", "4", `${target}.jpg`]);
  const cutNote = drop ? ` (${(skip.to - skip.from).toFixed(0)} s of generation cut)` : "";
  process.stdout.write(`✓ ${id}  ${duration.toFixed(1)} s${cutNote} → ${path.relative(process.cwd(), target)}.{webm,mp4,jpg}` + "\n");
}

try {
  const { ctx, page } = await signIn();
  // Warm the local model up outside the recording: the first answer of a cold Ollama loads its weights.
  const ollama = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  await fetch(`${ollama}/api/generate`, {
    method: "POST",
    body: JSON.stringify({ model, prompt: "ok", stream: false, keep_alive: "15m" }),
  }).catch(() => console.warn(`⚠ Ollama did not answer at ${ollama}: the chat clip will wait for a cold model.`));
  if (PREPARE) {
    for (const [i, { prompt }] of PREPARED.entries()) {
      await ask(page, prompt);
      process.stdout.write(`✓ prepared conversation ${i + 1}/${PREPARED.length}\n`);
    }
  }
  const state = await ctx.storageState();
  await writeFile(STATE, JSON.stringify(state));
  await ctx.close();
  const clips = Object.keys(CLIPS).filter((id) => ONLY.length === 0 || ONLY.includes(id));
  if (!(PREPARE && ONLY.length === 0 && ARGS.length === 1)) for (const id of clips) await record(id, state);
} finally {
  await browser.close();
  await rm(raw, { recursive: true, force: true });
}
