/** @jest-environment node */
import { formatVersion, resolveSha } from "@/core/config/app-version";

describe("app version", () => {
  it("joins the package version and the short sha", () => {
    expect(formatVersion("1.2.3", "ab12cd3ef456")).toBe("1.2.3+ab12cd3");
  });
  it("is the bare version without a sha", () => {
    expect(formatVersion("1.2.3", "")).toBe("1.2.3");
    expect(formatVersion("1.2.3")).toBe("1.2.3");
  });
  it("prefers the platform's commit and ignores an unresolved placeholder", () => {
    expect(resolveSha({ APP_COMMIT: "deadbeefcafe" })).toBe("deadbeefcafe");
    expect(resolveSha({ APP_COMMIT: "${_self.COMMIT_HASH}", GITHUB_SHA: "f00dfeed" })).toBe("f00dfeed");
  });
});
