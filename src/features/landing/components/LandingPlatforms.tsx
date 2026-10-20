"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { AutomationIcon, DownloadIcon, GlobeIcon, LocalIcon, type IconProps } from "@krizaka/icons";
import { Section } from "@krizaka/ui/page";
import { useTranslation } from "@/core/context/LocaleContext";

const PLATFORMS: readonly { id: "web" | "mac" | "mobile" | "cli"; href: string; Icon: ComponentType<IconProps> }[] = [
  { id: "web", href: "/login", Icon: GlobeIcon },
  { id: "mac", href: "/desktop", Icon: LocalIcon },
  { id: "mobile", href: "/docs/mobile", Icon: DownloadIcon },
  { id: "cli", href: "/docs/cli", Icon: AutomationIcon },
];

/** « Runs on your machines »: the four ways in, as a quiet strip — a name and a line each, the whole item one link. */
export function LandingPlatforms() {
  const { t } = useTranslation();
  const p = t.landing.platforms;
  return (
    <Section id="platforms" eyebrow={p.eyebrow} title={p.title} headingSize="sm" spacing="sm" reveal divider>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map(({ id, href, Icon }) => (
          <li key={id}>
            <Link href={href} className="group flex items-start gap-3 rounded-lg py-1 text-fg outline-offset-4">
              <Icon size={22} className="mt-0.5 shrink-0 text-fg-accent" nodeColor="var(--kz-accent)" />
              <span className="flex flex-col">
                <span className="font-semibold group-hover:underline">{p.items[id].name}</span>
                <span className="text-sm text-fg-secondary">{p.items[id].line}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
