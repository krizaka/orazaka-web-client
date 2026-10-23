/** @jest-environment node */
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { publicPaths } from "@/app/_seo/seo";

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

  it.each(["/", "/docs", "/docs/core", "/desktop", "/login", "/register"])("lets %s through", (path) => {
    expect(call(path).headers.get("x-middleware-next")).toBe("1");
  });

  it("lets every page of the sitemap through — a public page never lands on the login wall", () => {
    for (const path of publicPaths()) expect(`${path} ${String(call(path).headers.get("x-middleware-next"))}`).toBe(`${path} 1`);
  });

  it("sends a protected page to /login (the closed notice)", () => {
    const res = call("/jobs");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://dev.orazaka.com/login");
  });
});

describe("Packs moved into the docs", () => {
  it("sends a visitor without a session from /packs to /docs/packs with a 308", () => {
    const res = call("/packs");
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://dev.orazaka.com/docs/packs");
  });

  it("keeps /packs the signed-in Plan & packs for a session", () => {
    const req = new NextRequest("https://dev.orazaka.com/packs", { headers: { cookie: "next-auth.session-token=x" } });
    expect(proxy(req).headers.get("x-middleware-next")).toBe("1");
  });
});

describe("proxy with sign-in open", () => {
  it("lets the BFF routes through", () => {
    expect(call("/api/v1/profile", { AUTH_LOGIN_ENABLED: "true" }).headers.get("x-middleware-next")).toBe("1");
  });

  it.each(["/jobs", "/studios", "/settings", "/dashboard"])("sends a signed-out visitor of %s to /login, and lets a session through", (path) => {
    const open = { AUTH_LOGIN_ENABLED: "true" };
    const res = call(path, open);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://dev.orazaka.com/login");
    const before = { ...process.env };
    Object.assign(process.env, open);
    try {
      const req = new NextRequest(`https://dev.orazaka.com${path}`, { headers: { cookie: "next-auth.session-token=x" } });
      expect(proxy(req).headers.get("x-middleware-next")).toBe("1");
    } finally {
      delete process.env.AUTH_LOGIN_ENABLED;
      Object.assign(process.env, before);
    }
  });
});
