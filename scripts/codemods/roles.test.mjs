// node --test scripts/codemods/*.test.mjs — the roles codemod, on the cases it was written for.
import assert from "node:assert/strict";
import { test } from "node:test";
import { rewriteClasses, rewriteVariables, transformJsx, transformStrings } from "./roles.mjs";

test("1.x arbitrary utilities become role utilities", () => {
  assert.equal(
    rewriteClasses("bg-[var(--surface-1)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--accent)]"),
    "bg-surface-1 text-fg-secondary border-border-subtle hover:text-accent",
  );
  assert.equal(rewriteClasses("focus-visible:ring-[var(--accent)]"), "focus-visible:ring-ring");
  assert.equal(rewriteClasses("text-[var(--status-error)] bg-[var(--accent)]/20"), "text-danger bg-accent/20");
  assert.equal(rewriteClasses("shadow-[var(--accent-glow)] shadow-[var(--accent)]/[0.05]"), "shadow-(--orazaka-accent-glow) shadow-accent/5");
  assert.equal(rewriteClasses("rounded-[var(--radius-md)] p-[var(--space-card)] text-[var(--text-sm)]"), "rounded-md p-(--orazaka-space-card) text-sm");
  assert.equal(rewriteClasses("bg-[color-mix(in_srgb,var(--surface-1)_88%,transparent)]"), "bg-surface-1/88");
});

test("the kit's 2.x compatibility utilities become roles", () => {
  assert.equal(
    rewriteClasses("text-text-primary bg-status-error/10 bg-card-bg border-card-border text-foreground/70 bg-background"),
    "text-fg bg-danger/10 bg-surface-1 border-border-subtle text-fg/70 bg-surface-0",
  );
});

test("dark: goes — the dark value wins on the same property, the others stay", () => {
  assert.equal(rewriteClasses("text-text-muted dark:text-text-secondary font-medium"), "text-fg-secondary font-medium");
  assert.equal(rewriteClasses("bg-white dark:bg-surface-2 dark:hover:bg-surface-3"), "bg-surface-2 hover:bg-surface-3");
  assert.equal(rewriteClasses("border-status-success/20 dark:border-status-success/15"), "border-success/15");
  assert.equal(rewriteClasses("p-4 dark:p-6"), "p-4 p-6");
});

test("1.x variables become --kz-* (style objects, SVG, CSS)", () => {
  assert.equal(rewriteVariables("fill: var(--accent); stroke: var(--border-subtle)"), "fill: var(--kz-accent); stroke: var(--kz-border-subtle)");
  assert.equal(rewriteVariables("var(--status-error) var(--chip-color)"), "var(--kz-danger) var(--chip-color)");
});

test("a className template becomes cn(), with its import", () => {
  const out = transformJsx('import x from "y";\nconst A = () => <p className={`a b ${c ? "d" : ""}`} />;\n');
  assert.match(out, /import \{ cn \} from "@krizaka\/ui\/cn";/);
  assert.match(out, /className=\{cn\("a b", c \? "d" : ""\)\}/);
});

test("a glued template is left alone (w-${n} cannot be split)", () => {
  const src = "const A = () => <p className={`w-${n}`} />;\n";
  assert.equal(transformJsx(src), src);
});

test("the kit Card becomes Card.*, the 1.x spacing kept and merged", () => {
  const out = transformJsx(
    'import { Card, CardHeader, CardTitle, CardContent } from "@krizaka/orazaka-design-system";\n' +
      'const A = () => <Card className="p-2"><CardHeader><CardTitle className="text-fg">T</CardTitle></CardHeader><CardContent className="space-y-4">x</CardContent></Card>;\n',
  );
  assert.match(out, /import \{ Card \} from "@krizaka\/ui\/card";/);
  assert.doesNotMatch(out, /orazaka-design-system/);
  assert.match(out, /<Card\.Root className="p-2">/);
  assert.match(out, /<Card\.Body padding="lg" className="gap-1\.5">/);
  assert.match(out, /<Card\.Title className="[^"]*group-hover:text-fg[^"]*text-fg">/);
  assert.match(out, /<Card\.Body padding="lg" className="block pt-0 space-y-4">/);
});

test("every string of a module goes through the class rewrite", () => {
  const out = transformStrings('const C = { bg: "bg-[var(--surface-2)]", t: `text-[var(--text-muted)] ${x}` };\n');
  assert.match(out, /"bg-surface-2"/);
  assert.match(out, /`text-fg-muted \$\{x\}`/);
});
