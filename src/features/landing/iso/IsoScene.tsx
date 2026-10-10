import * as React from "react";
import { AgentIcon, KnowledgeIcon, LocalIcon, ShieldIcon, type IconProps } from "@krizaka/icons";
import { cn } from "@krizaka/ui/cn";
import { project, pts, type Origin } from "@/features/landing/iso/iso";
import { IsoBox, IsoCard, IsoDefs, IsoDome, IsoFlow, IsoNode, IsoPlatform, IsoServer } from "@/features/landing/iso/IsoPrimitives";

/** The four original scenes: the home (the sovereign stack under its dome) and one per feature page. */
export const ISO_SCENES = ["home", "privacy", "engine", "reach"] as const;
export type IsoSceneName = (typeof ISO_SCENES)[number];

const O: Origin = { ox: 320, oy: 262 };

/** A luminous badge floating above an object: a flat hexagon carrying a signature icon. */
function Badge({ at, Icon }: { at: readonly [number, number]; Icon: React.ComponentType<IconProps> }) {
  const [x, y] = at;
  const r = 22;
  const hexagon = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return [x + r * Math.cos(a), y + r * Math.sin(a)] as const;
  });
  return (
    <g className="iso-float">
      <polygon points={pts(hexagon)} className="fill-surface-1 iso-badge" />
      <Icon x={x - 11} y={y - 11} size={22} className="text-fg-accent" nodeColor="var(--kz-accent)" />
    </g>
  );
}

/** The glow on the floor, under whatever stands in the middle. */
function Glow({ id, rx = 210, ry = 92 }: { id: string; rx?: number; ry?: number }) {
  return <ellipse cx={O.ox} cy={O.oy} rx={rx} ry={ry} fill={`url(#${id}-glow)`} className="iso-glow" />;
}

function Home({ id }: { id: string }) {
  return (
    <>
      <Glow id={id} />
      <IsoPlatform o={O} x={0} y={0} r={6.2} />
      <IsoFlow o={O} path={[[0, 1.3], [0, 2.4], [2.4, 2.4]]} />
      <IsoFlow o={O} path={[[-1.3, 0], [-2.6, 0], [-2.6, 2.2]]} className="iso-flow-late" />
      <IsoFlow o={O} path={[[1.3, 0], [2.8, 0], [2.8, -2.6]]} className="iso-flow-later" />
      <IsoNode o={O} x={-2.6} y={-2.4} className="iso-float-late" />
      <IsoServer o={O} x={-1.2} y={-1.2} slabs={3} />
      <IsoCard o={O} x={1.9} y={-4} z={1.9} className="iso-float" />
      <IsoCard o={O} x={-4.1} y={1.5} z={1.1} w={1.7} d={2.1} lines={4} className="iso-float-late" />
      <IsoNode o={O} x={2.6} y={2.6} className="iso-float-later" />
      <IsoDome o={O} x={0} y={0} r={5.2} gradientId={`${id}-glass`} />
      <Badge at={project(O, 0, 0, 5.4)} Icon={ShieldIcon} />
    </>
  );
}

function Privacy({ id }: { id: string }) {
  const edge = project(O, 4.4, -0.2, 0);
  return (
    <>
      <Glow id={id} rx={180} />
      <IsoPlatform o={O} x={0} y={0} r={5.4} />
      <IsoFlow o={O} path={[[1.3, 0], [4.4, -0.2]]} className="iso-flow-blocked" />
      <circle cx={edge[0]} cy={edge[1]} r={7} className="iso-stop" />
      <IsoServer o={O} x={-1.2} y={-1.2} slabs={3} />
      <IsoCard o={O} x={-3.6} y={1.2} z={0.8} w={1.6} d={2} lines={4} className="iso-float-late" />
      <IsoDome o={O} x={0} y={0} r={4.4} gradientId={`${id}-glass`} />
      <Badge at={project(O, 0, 0, 4.9)} Icon={ShieldIcon} />
    </>
  );
}

function Engine({ id }: { id: string }) {
  const layers = [0.7, 1.75, 2.8, 3.85];
  const base = project(O, 0, 0, 0.3);
  const top = project(O, 0, 0, 5.2);
  return (
    <>
      <Glow id={id} rx={170} />
      <IsoPlatform o={O} x={0} y={0} r={4.6} />
      <line x1={base[0]} y1={base[1]} x2={top[0]} y2={top[1]} className="iso-beam" />
      {layers.map((z, i) => (
        <IsoBox key={z} o={O} x={-1.9} y={-1.9} z={z} w={3.8} d={3.8} h={0.18} lit className={cn("iso-float", i % 2 === 1 && "iso-float-late")} />
      ))}
      <IsoNode o={O} x={0} y={0} z={4.4} r={0.6} />
      <Badge at={project(O, 0, 0, 6.6)} Icon={KnowledgeIcon} />
    </>
  );
}

function Reach({ id }: { id: string }) {
  // The workspace server under its dome (left), the person's machine with the agent (right), and the one link
  // between them: outbound, from the machine to the server.
  const lx = 1.9;
  const ly = -2.4;
  const screen = [project(O, lx, ly, 0.16), project(O, lx + 2.2, ly, 0.16), project(O, lx + 2.2, ly - 0.4, 1.6), project(O, lx, ly - 0.4, 1.6)];
  return (
    <>
      <Glow id={id} rx={220} />
      <IsoPlatform o={O} x={3} y={-1.6} r={2.5} />
      <IsoPlatform o={O} x={-1} y={2.5} r={3.4} />
      <IsoFlow o={O} path={[[3, -0.6], [3, 1.2], [0.5, 1.2]]} className="iso-flow-out" />
      <polygon points={pts(screen)} className="fill-surface-3 stroke-border-strong iso-screen" strokeWidth={1} />
      <IsoBox o={O} x={lx} y={ly} w={2.2} d={1.6} h={0.16} lit />
      <IsoServer o={O} x={-2.2} y={1.3} slabs={2} />
      <IsoDome o={O} x={-1} y={2.5} r={2.9} gradientId={`${id}-glass`} />
      <Badge at={project(O, 3, -1.6, 2.9)} Icon={AgentIcon} />
      <Badge at={project(O, -1, 2.5, 4)} Icon={LocalIcon} />
    </>
  );
}

const SCENES: Record<IsoSceneName, (p: { id: string }) => React.JSX.Element> = {
  home: Home,
  privacy: Privacy,
  engine: Engine,
  reach: Reach,
};

/**
 * An original isometric illustration (BRAND.md §4): our own objects lit from inside in the brand accent, standing
 * on the perspective grid of the section. Decorative: the section's text says what it shows.
 */
export function IsoScene({ scene, className }: Readonly<{ scene: IsoSceneName; className?: string }>) {
  const id = `iso-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const Scene = SCENES[scene];
  return (
    <svg viewBox="0 0 640 480" aria-hidden="true" focusable="false" className={cn("iso-scene h-auto w-full", className)}>
      <IsoDefs id={id} />
      <Scene id={id} />
    </svg>
  );
}
