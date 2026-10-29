import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("the recorded chat proves a server tool run (orazaka-ai-engine#169)", () => {
  it("asks for the statute lookup and keeps the event stream beside the video", () => {
    const tour = readFileSync(new URL("./tour/eric.mjs", import.meta.url), "utf8");
    const showcase = readFileSync(new URL("./showcase-web.mjs", import.meta.url), "utf8");
    assert.match(tour, /statute lookup/);
    assert.match(showcase, /text\/event-stream/);
    assert.match(showcase, /chat-sse\.txt/);
  });
});
