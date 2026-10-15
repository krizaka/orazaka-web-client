import { DocMarkdown } from "@/features/docs/components/DocMarkdown";
import { DocDiagram } from "@/features/docs/components/DocDiagram";
import type { Segment } from "@/features/docs/utils/docs";

/** The body of a page: its prose, and each schema block drawn (as its text version) where the doc wrote it. */
export function DocBody({ segments }: Readonly<{ segments: readonly Segment[] }>) {
  return (
    <>
      {segments.map((s, i) => (s.kind === "markdown" ? <DocMarkdown key={i} text={s.text} /> : <DocDiagram key={i} lang={s.lang} source={s.source} />))}
    </>
  );
}
