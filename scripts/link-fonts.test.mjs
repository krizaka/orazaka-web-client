import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { FACES, linkFonts } from "./link-fonts.mjs";

const fakePackage = (faces) => {
  const dir = mkdtempSync(path.join(tmpdir(), "fonts-"));
  mkdirSync(path.join(dir, "files", "web"), { recursive: true });
  for (const face of faces) writeFileSync(path.join(dir, "files", "web", face), `face:${face}`);
  return dir;
};

test("copies every face next/font/local reads", () => {
  const target = path.join(mkdtempSync(path.join(tmpdir(), "app-")), "_fonts");
  const written = linkFonts(fakePackage(FACES), target);
  assert.equal(written.length, FACES.length);
  for (const face of FACES) assert.equal(readFileSync(path.join(target, face), "utf8"), `face:${face}`);
});

test("says which face is missing instead of building without it", () => {
  const target = path.join(mkdtempSync(path.join(tmpdir(), "app-")), "_fonts");
  assert.throws(() => linkFonts(fakePackage(FACES.slice(1)), target), /has no atkinson-hyperlegible-next-latin-wght\.woff2/);
  assert.equal(existsSync(path.join(target, FACES[0])), false);
});

test("the layout names the same files the script copies, relative to itself", () => {
  const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  for (const face of FACES) assert.match(layout, new RegExp(`"\\./_fonts/${face.replace(".", "\\.")}"`));
  assert.doesNotMatch(layout, /node_modules/);
});

test("the faces are the Cahier's (krizaka-ui ADR-004): Young Serif, Atkinson Hyperlegible Next, Courier Prime — never the old trio", () => {
  assert.ok(FACES.includes("young-serif-latin-400.woff2"));
  assert.ok(FACES.includes("atkinson-hyperlegible-next-latin-wght.woff2"));
  assert.ok(FACES.includes("courier-prime-latin-400.woff2"));
  for (const face of FACES) assert.doesNotMatch(face, /inter-|jetbrains|plus-jakarta/);
});
