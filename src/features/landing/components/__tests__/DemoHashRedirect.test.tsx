import { demoRedirect } from "@/features/landing/components/DemoHashRedirect";

describe("demoRedirect", () => {
  it("sends an old #demo-<clip> link to the same clip on /gallery", () => {
    expect(demoRedirect("#demo-chat")).toBe("/gallery#demo-chat");
    expect(demoRedirect("#demo-documents")).toBe("/gallery#demo-documents");
  });

  it("leaves #demo and every other hash on the home page", () => {
    expect(demoRedirect("#demo")).toBeNull();
    expect(demoRedirect("#studios")).toBeNull();
    expect(demoRedirect("")).toBeNull();
  });
});
