import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveDocLink } from "@/features/docs/utils/docs";

/**
 * Renders a published doc: GitHub-flavoured markdown on the design tokens (roles only, no colours). A link to a doc
 * that is not published here is plain text, never a dead link.
 */
export function DocMarkdown({ body, published }: Readonly<{ body: string; published: ReadonlySet<string> }>) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (p) => <h1 className="mb-6 mt-2 font-display text-3xl font-bold tracking-tight text-fg" {...strip(p)} />,
        h2: (p) => <h2 className="mb-3 mt-12 scroll-mt-20 border-b border-border-subtle pb-2 font-display text-2xl font-bold tracking-tight text-fg" {...strip(p)} />,
        h3: (p) => <h3 className="mb-2 mt-8 text-lg font-semibold text-fg" {...strip(p)} />,
        h4: (p) => <h4 className="mb-2 mt-6 font-semibold text-fg" {...strip(p)} />,
        p: (p) => <p className="my-4 leading-relaxed text-fg-secondary" {...strip(p)} />,
        ul: (p) => <ul className="my-4 list-disc space-y-1.5 pl-6 text-fg-secondary" {...strip(p)} />,
        ol: (p) => <ol className="my-4 list-decimal space-y-1.5 pl-6 text-fg-secondary" {...strip(p)} />,
        blockquote: (p) => <blockquote className="my-5 border-l-2 border-border-default pl-4 text-fg-secondary" {...strip(p)} />,
        hr: () => <hr className="my-10 border-border-subtle" />,
        pre: (p) => <pre className="my-5 overflow-x-auto rounded-xl border border-border-default bg-surface-1 p-4 font-mono text-sm text-fg" {...strip(p)} />,
        code: ({ className, children }) =>
          className ? <code className={className}>{children}</code> : <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-fg">{children}</code>,
        table: (p) => (
          <div className="my-5 overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full border-collapse text-left text-sm" {...strip(p)} />
          </div>
        ),
        th: (p) => <th className="border-b border-border-default bg-surface-1 px-3 py-2 font-semibold text-fg" {...strip(p)} />,
        td: (p) => <td className="border-b border-border-subtle px-3 py-2 align-top text-fg-secondary" {...strip(p)} />,
        img: ({ src, alt }) =>
          typeof src === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote captures on the CDN, sized by the doc
            <img src={src} alt={alt ?? ""} loading="lazy" className="my-5 max-w-full rounded-xl border border-border-default" />
          ) : null,
        a: ({ href = "", children }: { href?: string; children?: ReactNode }) => {
          const target = resolveDocLink(href, published);
          if (!target) return <span>{children}</span>;
          const external = /^https?:/.test(target);
          return (
            <a href={target} className="text-fg-accent underline underline-offset-2 hover:text-fg" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {children}
            </a>
          );
        },
      }}
    >
      {body}
    </Markdown>
  );
}

/** react-markdown hands the hast node to every component; it is not a DOM attribute. */
function strip<T extends object>(props: T): Omit<T, "node"> {
  const { node: _node, ...rest } = props as T & { node?: unknown };
  void _node;
  return rest;
}
