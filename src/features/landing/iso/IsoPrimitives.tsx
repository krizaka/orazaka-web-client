import { box, dome, hex, project, pts, type Origin } from "@/features/landing/iso/iso";
import { cn } from "@krizaka/ui/cn";

/**
 * The vocabulary of the Orazaka illustrations, drawn with role colours only (fill-surface-*, stroke-accent…), so
 * every object follows the theme — dark and light — and the brand. Classes `iso-*` (landing.css) carry the light,
 * the glass and the slow motion, all of it still under prefers-reduced-motion.
 */

interface At {
  o: Origin;
  x: number;
  y: number;
  z?: number;
}

/** A solid block: three faces, edges lit in the accent along the top. */
export function IsoBox({ o, x, y, z = 0, w, d, h, lit = false, className }: At & { w: number; d: number; h: number; lit?: boolean; className?: string }) {
  const f = box(o, x, y, z, w, d, h);
  return (
    <g className={className}>
      <polygon points={pts(f.left)} className="fill-surface-2 stroke-border-strong" strokeWidth={1} />
      <polygon points={pts(f.right)} className="fill-surface-1 stroke-border-strong" strokeWidth={1} />
      <polygon points={pts(f.top)} className={cn("fill-surface-3 stroke-border-strong", lit && "iso-lit-top")} strokeWidth={1} />
      {lit && <polyline points={pts([f.top[3], f.top[2], f.top[1]])} className="iso-edge" fill="none" />}
    </g>
  );
}

/** A server: stacked slabs, each with a status light and a lit vent on its front. */
export function IsoServer({ o, x, y, z = 0, slabs = 3, size = 2.4 }: At & { slabs?: number; size?: number }) {
  const h = 0.62;
  return (
    <g>
      {Array.from({ length: slabs }, (_, i) => {
        const zi = z + i * (h + 0.08);
        const a = project(o, x + size * 0.14, y + size, zi + h / 2);
        const b = project(o, x + size * 0.62, y + size, zi + h / 2);
        const led = project(o, x + size * 0.82, y + size, zi + h / 2);
        return (
          <g key={i}>
            <IsoBox o={o} x={x} y={y} z={zi} w={size} d={size} h={h} lit={i === slabs - 1} />
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="iso-vent" />
            <circle cx={led[0]} cy={led[1]} r={2.2} className={cn("fill-accent iso-led", i === 1 && "iso-led-late")} />
          </g>
        );
      })}
    </g>
  );
}

/** The hexagonal platform objects stand on — the Krizaka hexagon, extruded. */
export function IsoPlatform({ o, x, y, z = 0, r }: At & { r: number }) {
  return (
    <g>
      <polygon points={pts(hex(o, x, y, z - 0.45, r))} className="fill-surface-2 stroke-border-default" strokeWidth={1} />
      <polygon points={pts(hex(o, x, y, z, r))} className="fill-surface-1 stroke-border-strong" strokeWidth={1} />
      <polygon points={pts(hex(o, x, y, z, r * 0.82))} className="iso-ring" fill="none" />
    </g>
  );
}

/** The glass dome: what is under it never leaves. */
export function IsoDome({ o, x, y, z = 0, r, gradientId }: At & { r: number; gradientId: string }) {
  const d = dome(o, x, y, z, r);
  return (
    <g className="iso-dome">
      <path d={d.back} className="iso-dome-base" fill="none" />
      <path d={d.shell} fill={`url(#${gradientId})`} className="iso-dome-glass" />
    </g>
  );
}

/** A floating card with text lines on its face — the chat bubble or a document. */
export function IsoCard({ o, x, y, z = 0, w = 2.2, d = 1.5, lines = 3, className }: At & { w?: number; d?: number; lines?: number; className?: string }) {
  return (
    <g className={className}>
      <IsoBox o={o} x={x} y={y} z={z} w={w} d={d} h={0.22} lit />
      {Array.from({ length: lines }, (_, i) => {
        const yy = y + d * (0.28 + i * 0.22);
        const a = project(o, x + w * 0.18, yy, z + 0.22);
        const b = project(o, x + w * (i === lines - 1 ? 0.55 : 0.82), yy, z + 0.22);
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="iso-text-line" />;
      })}
    </g>
  );
}

/** A node of the marks: a small hexagonal prism with a glowing core. */
export function IsoNode({ o, x, y, z = 0, r = 0.7, className }: At & { r?: number; className?: string }) {
  const c = project(o, x, y, z + 0.5);
  return (
    <g className={className}>
      <polygon points={pts(hex(o, x, y, z, r))} className="fill-surface-2 stroke-border-strong" strokeWidth={1} />
      <polygon points={pts(hex(o, x, y, z + 0.5, r))} className="fill-surface-3 iso-edge-soft" />
      <circle cx={c[0]} cy={c[1]} r={4} className="fill-accent iso-core" />
    </g>
  );
}

/** A path of light along the floor, from one object to another (dashes that flow). */
export function IsoFlow({ o, path, z = 0, className }: { o: Origin; path: readonly (readonly [number, number])[]; z?: number; className?: string }) {
  const points = path.map(([x, y]) => project(o, x, y, z));
  return <polyline points={pts(points)} fill="none" className={cn("iso-flow", className)} />;
}

/** The shared definitions: the dome's glass and the core's glow. */
export function IsoDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-glass`} cx="50%" cy="78%" r="70%">
        <stop offset="0%" className="iso-stop-accent-strong" />
        <stop offset="60%" className="iso-stop-accent-soft" />
        <stop offset="100%" className="iso-stop-clear" />
      </radialGradient>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0%" className="iso-stop-accent-strong" />
        <stop offset="100%" className="iso-stop-clear" />
      </radialGradient>
    </defs>
  );
}
