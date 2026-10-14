/** @jest-environment node */
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const call = (path: string, env: Record<string, string> = {}) => {
  const before = { ...process.env };
  Object.assign(process.env, env);
  try {
    return proxy(new NextRequest(`https://dev.orazaka.com${path}`));
  } finally {
    delete process.env.AUTH_LOGIN_ENABLED;
    delete process.env.AUTH_SIGNUP_ENABLED;
    Object.assign(process.env, before);
  }
};

describe("proxy with the entry points closed (default)", () => {
  it.each(["/api/v1/profile", "/api/auth/session", "/api/chat/stream/1", "/uploads/a.png"])("answers 404 on %s, no backend call", (path) => {
    expect(call(path).status).toBe(404);
  });

  it.each(["/", "/docs", "/docs/core", "/features/privacy", "/login", "/register"])("lets %s through", (path) => {
    expect(call(path).headers.get("x-middleware-next")).toBe("1");
  });

  it("sends a protected page to /login (the closed notice)", () => {
    const res = call("/dashboard/jobs");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://dev.orazaka.com/login");
  });
});

describe("proxy with sign-in open", () => {
  it("lets the BFF routes through", () => {
    expect(call("/api/v1/profile", { AUTH_LOGIN_ENABLED: "true" }).headers.get("x-middleware-next")).toBe("1");
  });
});
