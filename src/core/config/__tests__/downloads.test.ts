import { readDownloads } from "@/core/config/downloads";

describe("readDownloads", () => {
  it("is off by default, empty or anything but « true »", () => {
    expect(readDownloads({}).macEnabled).toBe(false);
    expect(readDownloads({ APP_DOWNLOADS_MAC_ENABLED: "" }).macEnabled).toBe(false);
    expect(readDownloads({ APP_DOWNLOADS_MAC_ENABLED: "1" }).macEnabled).toBe(false);
    expect(readDownloads({ APP_DOWNLOADS_MAC_ENABLED: "false" }).macEnabled).toBe(false);
  });
  it("is on only when set to true", () => {
    expect(readDownloads({ APP_DOWNLOADS_MAC_ENABLED: "true" }).macEnabled).toBe(true);
    expect(readDownloads({ APP_DOWNLOADS_MAC_ENABLED: " TRUE " }).macEnabled).toBe(true);
  });
});
