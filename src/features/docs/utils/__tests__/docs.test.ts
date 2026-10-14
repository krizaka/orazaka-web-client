/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import { groupDocs, listDocs, readDoc, resolveDocLink } from "@/features/docs/utils/docs";

describe("published docs", () => {
  const docs = listDocs();

  it("lists the allow-listed docs, each with its markdown file", () => {
    expect(docs.length).toBeGreaterThan(10);
    for (const d of docs) {
      expect(fs.existsSync(path.join(process.cwd(), "content", "docs", d.file))).toBe(true);
      expect(d.title).not.toBe("");
    }
  });

  it("never publishes contributor-only docs or leaves diagram fences or frontmatter behind", () => {
    const slugs = docs.map((d) => d.slug);
    expect(slugs).not.toContain("billing_architecture");
    for (const d of docs) {
      const { body } = readDoc(d.slug)!;
      expect(body).not.toMatch(/^```(architecture|pipeline|sequence|states|mermaid)/m);
      expect(body.startsWith("---")).toBe(false);
    }
  });

  it("groups by category in reading order", () => {
    const groups = groupDocs(docs);
    expect(groups[0].category).toBe("getting-started");
    for (const g of groups) expect(g.docs.map((d) => d.order)).toEqual([...g.docs.map((d) => d.order)].sort((a, b) => a - b));
  });

  it("returns null for an unknown doc", () => {
    expect(readDoc("nope")).toBeNull();
  });
});

describe("resolveDocLink", () => {
  const published = new Set(["core", "licensing"]);
  it("keeps external and in-page links", () => {
    expect(resolveDocLink("https://www.krizaka.com", published)).toBe("https://www.krizaka.com");
    expect(resolveDocLink("#api", published)).toBe("#api");
  });
  it("routes links between published docs", () => {
    expect(resolveDocLink("./CORE.md#pipeline", published)).toBe("/docs/core#pipeline");
    expect(resolveDocLink("../LICENSING.md", published)).toBe("/docs/licensing");
    expect(resolveDocLink("/docs/core", published)).toBe("/docs/core");
  });
  it("drops links to anything not published", () => {
    expect(resolveDocLink("../AGENTS.md", published)).toBeNull();
    expect(resolveDocLink("../.agent/rules/x.md", published)).toBeNull();
  });
});
