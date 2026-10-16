import assert from "node:assert/strict";
import { test } from "node:test";
import { HEROES, SUBJECTS, heroRecords, records } from "./sync-i2v.mjs";

const run = (id, aspect, over = {}) => ({
  id, aspect, status: "SUCCEEDED", model: "wan2.2-ti2v-5b", prompt: "p", runId: "11111111-1111-1111-1111-111111111111",
  runSeconds: 1106, gpuRateUsdPerHour: 0.76, gpuCostUsd: 0.2335,
  reported: { width: 1280, height: 704, frames: 121, fps: 24, seed: "2718", durationSeconds: 5.04, gpu: "NVIDIA RTX 4000 Ada Generation" },
  ...over,
});

test("only an accepted 16:9 clip that succeeded is published, with what its run reported", () => {
  const rows = records(
    [run("mini-bagels-16x9", "16:9"), run("mini-bagels-9x16", "9:16"), run("mini-souk-16x9", "16:9"), run("tea-pour-16x9", "16:9", { status: "FAILED" })],
    { "mini-bagels-16x9": { accepted: true }, "mini-bagels-9x16": { accepted: true }, "mini-souk-16x9": { accepted: false, note: "warped" } },
  );
  assert.equal(rows.length, 1); // 9:16 is for Shorts, a warped one is rejected, a failed one never was
  const [{ stem, record }] = rows;
  assert.equal(stem, "products/orazaka/gallery-video/bagels-i2v");
  assert.deepEqual([record.id, record.imageId, record.model, record.fromImage, record.seed, record.width, record.height, record.fps, record.duration, record.seconds, record.costUsd, record.featured],
    ["bagels-i2v", "mini-bagels", "wan2.2-ti2v-5b", true, "2718", 1280, 704, 24, 5.04, 1106, 0.23, true]);
});

test("a clip nobody reviewed is not published, and a run that did not report its frame is an error", () => {
  assert.deepEqual(records([run("mini-souk-16x9", "16:9")], {}), []);
  assert.throws(() => records([run("mini-souk-16x9", "16:9", { reported: {} })], { "mini-souk-16x9": { accepted: true } }), /did not report its frame/);
});

test("every subject has its own gallery image and file stem", () => {
  assert.equal(new Set(Object.values(SUBJECTS).map((s) => s.stem)).size, Object.keys(SUBJECTS).length);
});

test("a 10 s version is published when its second run was accepted: two linked runs, summed time and cost, a 4-frame cross-fade", () => {
  const rows = records(
    [run("tea-pour-16x9", "16:9"), run("tea-pour-16x9-b", "16:9", { runId: "22222222-2222-2222-2222-222222222222" })],
    { "tea-pour-16x9": { accepted: true }, "tea-pour-16x9-b": { accepted: true } },
  );
  assert.deepEqual(rows.map((r) => r.record.id), ["tea-pour-i2v", "tea-pour-i2v-10s"]);
  const ten = rows[1].record;
  assert.equal(ten.duration, 9.92);
  assert.equal(ten.seconds, 2212);
  assert.equal(ten.linkedRunId, "22222222-2222-2222-2222-222222222222");
  assert.equal(ten.featured, undefined);
  // without the second run's review there is no 10 s clip
  assert.equal(records([run("tea-pour-16x9", "16:9"), run("tea-pour-16x9-b", "16:9")], { "tea-pour-16x9": { accepted: true } }).length, 1);
});

test("a 720p hero is published from its reviewed 16:9 run: text to video, its own GPU and rate, no image", () => {
  const hero = (id, aspect) => ({ ...run(id, aspect, { model: "wan2.2-t2v-a14b", gpuRateUsdPerHour: 3.99, gpuCostUsd: 1.3843, runSeconds: 1249 }), reported: { width: 1280, height: 720, frames: 81, fps: 16, seed: "20261011", durationSeconds: 5.06, gpu: "NVIDIA H100 80GB HBM3" } });
  const rows = heroRecords([hero("old-port-16x9", "16:9"), hero("old-port-9x16", "9:16"), hero("chefchaouen-16x9", "16:9")], { "old-port-16x9": { accepted: true }, "old-port-9x16": { accepted: true } });
  assert.equal(rows.length, 1); // the 9:16 is for Shorts, the unreviewed one is not published
  assert.equal(rows[0].stem, "products/orazaka/video/old-port");
  assert.deepEqual([rows[0].record.model, rows[0].record.width, rows[0].record.height, rows[0].record.fps, rows[0].record.fromImage, rows[0].record.imageId, rows[0].record.featured, rows[0].record.costUsd],
    ["wan2.2-t2v-a14b", 1280, 720, 16, undefined, undefined, true, 1.38]);
  assert.equal(new Set(Object.values(HEROES).map((h) => h.stem)).size, Object.keys(HEROES).length);
});
