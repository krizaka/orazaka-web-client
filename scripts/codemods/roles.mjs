#!/usr/bin/env node
// Codemod — the web-client moves from the 1.x Orazaka vocabulary to the Krizaka roles (@krizaka/tailwind) and
// to the @krizaka/ui card. Run once, then review the diff by hand:
//
//   node scripts/codemods/roles.mjs [paths…]        (default: src)
//
// What it rewrites, in every .ts/.tsx string and template chunk (and, for the variables, in .css files):
//   bg-[var(--surface-N)]             → bg-surface-N
//   text-[var(--text-primary)]        → text-fg          (secondary → fg-secondary, muted → fg-muted)
//   border-[var(--border-subtle)]     → border-border-subtle   (default, strong)
//   *-[var(--accent)]                 → *-accent         (ring-[var(--accent)] → ring-ring)
//   *-[var(--status-error)]           → *-danger         (success → success, warning → warning)
//   shadow-[var(--accent-glow)]       → shadow-(--orazaka-accent-glow) (the kit's product token)
//   rounded-[var(--radius-md)]        → rounded-md, p-[var(--space-card)] → p-(--orazaka-space-card)
//   the 1.x utilities of the kit's 2.x compatibility block (text-text-primary, bg-status-error, bg-card-bg,
//   text-foreground, bg-background…) → their role
//   `x dark:y` on the same property    → `y` (dark is the default and the roles follow the theme; `dark:` goes)
//   var(--surface-1) (style, SVG, CSS) → var(--kz-surface-1)  — and every other 1.x variable to its --kz-* role
// and, in the JSX:
//   className={`a ${b}`}              → className={cn("a", b)}   (import { cn } from "@krizaka/ui/cn")
//   <Card> <CardHeader> <CardTitle> <CardDescription> <CardContent> <CardFooter> (kit)
//                                      → <Card.Root> <Card.Body> <Card.Title> <Card.Description> <Card.Body> <Card.Footer>
//                                        (import { Card } from "@krizaka/ui/card"), with the 1.x spacing kept.
import { readFileSync, statSync, writeFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import jscodeshift from "jscodeshift";
import { cn as merge } from "tailwind-variants";

const j = jscodeshift.withParser("tsx");
const KIT = "@krizaka/orazaka-design-system";

// ── 1.x variable → role ─────────────────────────────────────────────────────
/** The role utility suffix of a 1.x variable, as written after `bg-`, `text-`, `border-`… */
const ROLE = {
  "surface-0": "surface-0",
  "surface-1": "surface-1",
  "surface-2": "surface-2",
  "surface-3": "surface-3",
  "text-primary": "fg",
  "text-secondary": "fg-secondary",
  "text-muted": "fg-muted",
  "border-subtle": "border-subtle",
  "border-default": "border-default",
  "border-strong": "border-strong",
  accent: "accent",
  "accent-soft": "accent-soft",
  "accent-hover": "accent-hover",
  "status-success": "success",
  "status-error": "danger",
  "status-warning": "warning",
  success: "success",
  danger: "danger",
  warning: "warning",
  background: "surface-0",
  foreground: "fg",
  "card-bg": "surface-1",
  "card-border": "border-subtle",
  "card-text": "fg",
  "input-bg": "surface-2",
  "input-border": "border-default",
  "input-text": "fg",
};

/** The --kz-* (or --orazaka-*) variable of a 1.x variable, for var() outside a utility. */
const VARIABLE = {
  "surface-0": "--kz-surface-0",
  "surface-1": "--kz-surface-1",
  "surface-2": "--kz-surface-2",
  "surface-3": "--kz-surface-3",
  "text-primary": "--kz-text-primary",
  "text-secondary": "--kz-text-secondary",
  "text-muted": "--kz-text-muted",
  "border-subtle": "--kz-border-subtle",
  "border-default": "--kz-border-default",
  "border-strong": "--kz-border-strong",
  accent: "--kz-accent",
  "accent-soft": "--kz-accent-soft",
  "accent-hover": "--kz-accent-hover",
  "accent-glow": "--orazaka-accent-glow",
  "status-success": "--kz-success",
  "status-error": "--kz-danger",
  "status-warning": "--kz-warning",
  "radius-sm": "--kz-radius-sm",
  "radius-md": "--kz-radius-md",
  "radius-lg": "--kz-radius-lg",
  "radius-xl": "--kz-radius-xl",
  "radius-full": "--kz-radius-full",
  "shadow-sm": "--kz-shadow-sm",
  "shadow-md": "--kz-shadow-md",
  "shadow-lg": "--kz-shadow-lg",
  "space-card": "--orazaka-space-card",
  "space-section": "--orazaka-space-section",
  "grid-color": "--orazaka-grid-color",
  background: "--kz-surface-0",
  foreground: "--kz-text-primary",
  "card-bg": "--kz-surface-1",
  "card-border": "--kz-border-subtle",
  "input-bg": "--kz-surface-2",
  "input-border": "--kz-border-default",
  "glow-color": "--kz-accent",
  "glow-accent": "--kz-accent-soft",
};

/** One arbitrary utility `[var(--x)]` (with its utility prefix) → its role utility, or null when unknown. */
function arbitrary(prefix, name, rest) {
  const util = prefix.replace(/^.*:/, "");
  const variants = prefix.slice(0, prefix.length - util.length);
  let out = null;
  if (util === "ring" && name === "accent") out = "ring-ring";
  else if (util === "shadow" && (name === "accent-glow" || name === "shadow-glow")) out = name === "accent-glow" ? "shadow-(--orazaka-accent-glow)" : "shadow-md";
  else if (util === "shadow" && /^shadow-(xs|sm|md|lg)$/.test(name)) out = name;
  else if (util === "rounded" && /^radius-/.test(name)) out = `rounded-${name.slice(7)}`;
  else if (util === "text" && /^text-(xs|sm|base|lg|xl|2xl|display)$/.test(name)) out = name;
  else if (/^space-/.test(name)) out = `${util}-(--orazaka-${name})`;
  else if (ROLE[name]) out = `${util}-${ROLE[name]}`;
  if (!out) return null;
  // `/[0.05]` → `/5`
  const opacity = rest.replace(/^\/\[0?\.(\d+)\]$/, (_, d) => `/${Number(`0.${d}`) * 100}`);
  return variants + out + opacity;
}

/** The 1.x utilities of the kit's compatibility block → roles. */
const COMPAT = [
  [/\b(text|bg|border|from|via|to|divide|ring|fill|stroke|placeholder|decoration|outline|shadow)-text-(primary|secondary|muted)\b/g, (_, u, n) => `${u}-${ROLE[`text-${n}`]}`],
  [/\b(text|bg|border|from|via|to|divide|ring|fill|stroke|outline|shadow)-status-(success|error|warning)\b/g, (_, u, n) => `${u}-${ROLE[`status-${n}`]}`],
  [/\b(text|bg|border|from|via|to|divide|ring|fill|stroke|outline)-(card|input)-(bg|border|text)\b/g, (_, u, a, b) => `${u}-${ROLE[`${a}-${b}`]}`],
  [/\b(text|bg|border|from|via|to|divide|ring|fill|stroke|outline)-(background|foreground)\b/g, (_, u, n) => `${u}-${ROLE[n]}`],
];

const COLOR_VALUE =
  /^(surface-[0-3]|fg(-secondary|-muted|-on-media)?|border-(subtle|default|strong)|accent(-soft|-hover|-2)?|on-accent|ring|success|warning|danger|info|media|scrim(-strong)?|overlay|white|black|transparent|current|(zinc|slate|gray|neutral|stone|red|rose|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink)-\d+|\[[^\]]*\])(\/\S+)?$/;
const KINDS = ["border-t", "border-b", "border-l", "border-r", "border-x", "border-y", "bg", "text", "border", "from", "via", "to", "divide", "ring", "shadow", "fill", "stroke", "outline"];

/** `[variants:]kind-value` → { key, value } when the value is a colour, else null. */
function colorToken(token) {
  const at = token.lastIndexOf(":");
  const variants = at === -1 ? "" : token.slice(0, at + 1);
  const util = token.slice(at + 1);
  for (const kind of KINDS) {
    if (util.startsWith(`${kind}-`)) {
      const value = util.slice(kind.length + 1);
      return COLOR_VALUE.test(value) ? { key: `${variants}${kind}`, value } : null;
    }
  }
  return null;
}

/** `a dark:b` → the dark value wins (dark is the default; the roles follow the theme), `dark:` is gone. */
function dropDark(text) {
  if (!/(^|\s)dark:/.test(text)) return text;
  const tokens = text.split(/(\s+)/);
  const words = tokens.filter((t, i) => i % 2 === 0);
  const darks = words.filter((w) => w.startsWith("dark:"));
  const keep = new Set();
  const replaced = new Map(); // index of a base token → its dark value
  for (const d of darks) {
    const plain = d.slice(5);
    if (!plain) continue;
    const info = colorToken(plain);
    const base = info ? words.findIndex((w) => !w.startsWith("dark:") && colorToken(w)?.key === info.key) : -1;
    if (base !== -1) replaced.set(base, plain);
    else keep.add(plain);
  }
  const out = [];
  words.forEach((w, i) => {
    if (w.startsWith("dark:")) return;
    out.push(replaced.has(i) ? replaced.get(i) : w);
  });
  for (const k of keep) if (!out.includes(k)) out.push(k);
  const lead = text.match(/^\s*/)[0];
  const trail = text.match(/\s*$/)[0];
  return lead + out.filter(Boolean).join(" ") + trail;
}

/** Every class rewrite on a chunk of text (a string literal, a template chunk). */
export function rewriteClasses(text) {
  let s = text;
  // bg-[color-mix(in_srgb,var(--surface-1)_88%,transparent)] → bg-surface-1/88
  s = s.replace(/([a-z:-]*?)-\[color-mix\(in_srgb,var\(--([a-z0-9-]+)\)_(\d+)%,transparent\)\]/g, (m, p, n, pct) =>
    ROLE[n] ? `${p}-${ROLE[n]}/${pct}` : m,
  );
  s = s.replace(/([a-z0-9:-]*?)-\[var\(--([a-z0-9-]+)\)\](\/\[[0-9.]+\]|\/\d+)?/g, (m, p, n, rest = "") => arbitrary(p, n, rest) ?? m);
  for (const [re, fn] of COMPAT) s = s.replace(re, fn);
  s = dropDark(s);
  return rewriteVariables(s);
}

/** var(--surface-1) → var(--kz-surface-1), everywhere (style objects, SVG attributes, CSS). */
export function rewriteVariables(text) {
  return text.replace(/var\(--([a-z0-9-]+)/g, (m, n) => (VARIABLE[n] ? `var(${VARIABLE[n]}` : m));
}

// ── JSX: className template → cn(), kit Card → Card.* ────────────────────────
const CARD = {
  Card: { to: "Root", classes: "" },
  CardHeader: { to: "Body", props: { padding: "lg" }, classes: "gap-1.5" },
  CardTitle: { to: "Title", classes: "line-clamp-none text-lg leading-none tracking-tight" },
  CardDescription: { to: "Description", classes: "line-clamp-none text-sm" },
  CardContent: { to: "Body", props: { padding: "lg" }, classes: "block pt-0" },
  CardFooter: { to: "Footer", classes: "px-6 pb-6 text-sm" },
};

function ensureImport(root, source, name) {
  const existing = root.find(j.ImportDeclaration, { source: { value: source } });
  if (existing.size()) {
    const decl = existing.get().node;
    if (!decl.specifiers.some((s) => s.imported?.name === name)) decl.specifiers.push(j.importSpecifier(j.identifier(name)));
    return;
  }
  const imports = root.find(j.ImportDeclaration);
  const node = j.importDeclaration([j.importSpecifier(j.identifier(name))], j.literal(source));
  if (imports.size()) imports.at(imports.size() - 1).insertAfter(node);
  else root.get().node.program.body.unshift(node);
}

/** The text-colour class of a className, for the title's hover (the primitive turns it accent on a card hover). */
function titleHover(classes) {
  const colour = classes.split(/\s+/).find((c) => /^text-(fg|fg-secondary|fg-muted|accent|success|warning|danger|transparent)(\/\d+)?$/.test(c));
  return colour ? `group-hover:${colour}` : "group-hover:text-fg";
}

function mergeClassName(attrs, extra) {
  if (!extra) return;
  const idx = attrs.findIndex((a) => a.type === "JSXAttribute" && a.name.name === "className");
  if (idx === -1) {
    if (!extra.trim()) return;
    attrs.push(j.jsxAttribute(j.jsxIdentifier("className"), j.stringLiteral(extra)));
    return { usesCn: false };
  }
  const value = attrs[idx].value;
  if (value.type === "StringLiteral" || value.type === "Literal") {
    // Merged as @krizaka/ui merges at runtime (tailwind-merge): the literal reads what renders.
    value.value = merge(extra, value.value) ?? "";
    if (value.extra) delete value.extra;
    return { usesCn: false };
  }
  const expr = value.expression;
  attrs[idx].value = j.jsxExpressionContainer(j.callExpression(j.identifier("cn"), [j.stringLiteral(extra), expr]));
  return { usesCn: true };
}

export function transformJsx(source) {
  const root = j(source);
  let usesCn = false;
  let usesCard = false;

  // className={`…`} → className={cn(…)} when every chunk boundary is a class boundary.
  root.find(j.JSXAttribute, { name: { name: "className" } }).forEach((path) => {
    const value = path.node.value;
    if (value?.type !== "JSXExpressionContainer" || value.expression.type !== "TemplateLiteral") return;
    const { quasis, expressions } = value.expression;
    const glued = quasis.some((q, i) => (i > 0 && /^\S/.test(q.value.cooked)) || (i < quasis.length - 1 && /\S$/.test(q.value.cooked)));
    if (glued) return;
    const args = [];
    quasis.forEach((q, i) => {
      const text = q.value.cooked.replace(/\s+/g, " ").trim();
      if (text) args.push(j.stringLiteral(text));
      if (i < expressions.length) args.push(expressions[i]);
    });
    path.node.value = j.jsxExpressionContainer(j.callExpression(j.identifier("cn"), args));
    usesCn = true;
  });

  // Kit Card* → Card.*
  const kitImport = root.find(j.ImportDeclaration, { source: { value: KIT } });
  const cardNames = new Set();
  kitImport.forEach((path) => {
    path.node.specifiers = path.node.specifiers.filter((s) => {
      if (s.type === "ImportSpecifier" && CARD[s.imported.name]) {
        cardNames.add(s.local.name);
        return false;
      }
      return true;
    });
    if (path.node.specifiers.length === 0) j(path).remove();
  });
  if (cardNames.size) {
    root.find(j.JSXElement).forEach((path) => {
      const open = path.node.openingElement;
      if (open.name.type !== "JSXIdentifier" || !cardNames.has(open.name.name)) return;
      const spec = CARD[open.name.name];
      const name = j.jsxMemberExpression(j.jsxIdentifier("Card"), j.jsxIdentifier(spec.to));
      for (const [k, v] of Object.entries(spec.props ?? {})) {
        if (!open.attributes.some((a) => a.name?.name === k)) open.attributes.unshift(j.jsxAttribute(j.jsxIdentifier(k), j.stringLiteral(v)));
      }
      let extra = spec.classes;
      if (spec.to === "Title") {
        const cls = open.attributes.find((a) => a.name?.name === "className");
        const text = cls?.value?.type === "StringLiteral" || cls?.value?.type === "Literal" ? cls.value.value : "";
        extra = `${extra} ${titleHover(text)}`;
      }
      if (mergeClassName(open.attributes, extra)?.usesCn) usesCn = true;
      open.name = name;
      if (path.node.closingElement) path.node.closingElement.name = j.jsxMemberExpression(j.jsxIdentifier("Card"), j.jsxIdentifier(spec.to));
      usesCard = true;
    });
  }

  if (usesCard) ensureImport(root, "@krizaka/ui/card", "Card");
  if (usesCn) {
    const hasCn = root.find(j.ImportSpecifier, { local: { name: "cn" } }).size() > 0;
    if (!hasCn) ensureImport(root, "@krizaka/ui/cn", "cn");
  }
  return usesCn || usesCard ? root.toSource({ quote: "double" }) : source;
}

/** Every string and template chunk of a module goes through rewriteClasses. */
export function transformStrings(source) {
  const root = j(source);
  let changed = false;
  root.find(j.StringLiteral).forEach((path) => {
    const next = rewriteClasses(path.node.value);
    if (next !== path.node.value) {
      path.node.value = next;
      if (path.node.extra) delete path.node.extra;
      changed = true;
    }
  });
  root.find(j.TemplateElement).forEach((path) => {
    const next = rewriteClasses(path.node.value.raw);
    if (next !== path.node.value.raw) {
      path.node.value = { raw: next, cooked: next };
      changed = true;
    }
  });
  root.find(j.JSXText).forEach((path) => {
    // CSS inside <style>{`…`}</style> is a template; plain JSX text is left alone.
    void path;
  });
  return changed ? root.toSource({ quote: "double" }) : source;
}

function walk(path, out) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) if (entry !== "node_modules" && !entry.startsWith(".")) walk(join(path, entry), out);
  } else out.push(path);
  return out;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const targets = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
  let count = 0;
  for (const file of targets.flatMap((t) => walk(t, []))) {
    const ext = extname(file);
    const before = readFileSync(file, "utf8");
    let after = before;
    if (ext === ".css") after = rewriteVariables(before);
    else if (ext === ".ts" || ext === ".tsx") {
      after = transformStrings(after);
      if (ext === ".tsx") after = transformJsx(after);
    } else continue;
    if (after !== before) {
      writeFileSync(file, after);
      count += 1;
    }
  }
  process.stdout.write(`roles codemod: ${count} file(s) rewritten\n`);
}
