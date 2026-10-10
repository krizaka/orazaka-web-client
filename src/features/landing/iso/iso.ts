/**
 * @file iso.ts
 * @description The isometric projection of the Orazaka illustrations (BRAND.md §4: objects of our own vocabulary —
 * servers, hexagons, nodes, the chat bubble — extruded and lit from inside). Pure geometry, no React: a point of the
 * world (x right-down, y left-down, z up, in grid units) becomes a point of a 640 × 480 drawing.
 */

/** One grid unit, in drawing pixels. */
export const UNIT = 35;
const COS = Math.cos(Math.PI / 6);

/** Where the world origin sits in the drawing. */
export interface Origin {
  ox: number;
  oy: number;
}

export type Point = readonly [number, number];

/** A world point → a drawing point. */
export function project(o: Origin, x: number, y: number, z = 0): Point {
  return [o.ox + (x - y) * COS * UNIT, o.oy + (x + y) * 0.5 * UNIT - z * UNIT];
}

/** Drawing points → an SVG `points` attribute. */
export function pts(points: readonly Point[]): string {
  return points.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");
}

/** A box standing at (x, y, z), `w` along x, `d` along y, `h` tall: its three visible faces. */
export interface BoxFaces {
  top: Point[];
  left: Point[];
  right: Point[];
}

export function box(o: Origin, x: number, y: number, z: number, w: number, d: number, h: number): BoxFaces {
  const p = (a: number, b: number, c: number) => project(o, a, b, c);
  return {
    top: [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)],
    left: [p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)],
    right: [p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)],
  };
}

/** A flat hexagon of radius `r` centred on (cx, cy) at height z — the platform the objects stand on. */
export function hex(o: Origin, cx: number, cy: number, z: number, r: number): Point[] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return project(o, cx + r * Math.cos(a), cy + r * Math.sin(a), z);
  });
}

/**
 * A dome of radius `r` over (cx, cy, z): the base ellipse a circle of the floor becomes, and the cap above it. The
 * silhouette is drawn as an elliptical arc as tall as the radius — close enough to a sphere at this scale.
 */
export function dome(o: Origin, cx: number, cy: number, z: number, r: number) {
  const [x, y] = project(o, cx, cy, z);
  const rx = r * Math.SQRT2 * COS * UNIT;
  const ry = r * Math.SQRT2 * 0.5 * UNIT;
  const top = r * UNIT * 1.05;
  const f = (n: number) => n.toFixed(1);
  return {
    /** The whole glass: cap, then the front half of the base. */
    shell: `M${f(x - rx)},${f(y)} A${f(rx)},${f(top)} 0 0 1 ${f(x + rx)},${f(y)} A${f(rx)},${f(ry)} 0 0 1 ${f(x - rx)},${f(y)} Z`,
    /** The back half of the base, seen through the glass. */
    back: `M${f(x - rx)},${f(y)} A${f(rx)},${f(ry)} 0 0 0 ${f(x + rx)},${f(y)}`,
    centre: [x, y] as Point,
    rx,
    ry,
    top,
  };
}
