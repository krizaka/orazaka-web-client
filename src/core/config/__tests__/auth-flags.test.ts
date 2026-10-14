import { authClosed, isBackendPath, parseFlag, readAuthFlags } from "@/core/config/auth-flags";

describe("auth flags", () => {
  it("are off by default", () => {
    expect(readAuthFlags({})).toEqual({ login: false, signup: false });
    expect(authClosed(readAuthFlags({}))).toBe(true);
  });

  it("read AUTH_LOGIN_ENABLED and AUTH_SIGNUP_ENABLED independently", () => {
    expect(readAuthFlags({ AUTH_LOGIN_ENABLED: "true" })).toEqual({ login: true, signup: false });
    expect(readAuthFlags({ AUTH_SIGNUP_ENABLED: "1" })).toEqual({ login: false, signup: true });
    expect(authClosed(readAuthFlags({ AUTH_LOGIN_ENABLED: "true" }))).toBe(false);
  });

  it("only accept explicit truthy words", () => {
    expect(["true", "TRUE", " 1 ", "yes", "on"].map(parseFlag)).toEqual([true, true, true, true, true]);
    expect(["false", "0", "", "nope", undefined].map(parseFlag)).toEqual([false, false, false, false, false]);
  });

  it("recognise the paths that reach the backend", () => {
    expect(isBackendPath("/api/v1/profile")).toBe(true);
    expect(isBackendPath("/api/auth/session")).toBe(true);
    expect(isBackendPath("/api/chat/stream/1")).toBe(true);
    expect(isBackendPath("/uploads/a.png")).toBe(true);
    expect(isBackendPath("/features/privacy")).toBe(false);
  });
});
