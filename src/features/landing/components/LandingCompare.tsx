"use client";

import type { ComponentType } from "react";
import { AgentIcon, CreditsIcon, GlobeIcon, LocalIcon, ShieldIcon, UsersIcon, type IconProps } from "@krizaka/icons";
import { ComparisonTable } from "@krizaka/ui/comparison-table";
import { Section } from "@krizaka/ui/page";
import { useTranslation } from "@/core/context/LocaleContext";

/** One icon per question, in the order of the copy's ids. */
const ICONS: Record<"where" | "pay" | "decide" | "agents", ComponentType<IconProps>> = { where: ShieldIcon, pay: CreditsIcon, decide: UsersIcon, agents: AgentIcon };

/**
 * Why own it: the same questions asked of a cloud assistant and of Orazaka, on @krizaka/ui's ComparisonTable — one
 * grid whose rows line up, Orazaka's column the highlighted band, the cloud's answers neutral (fair, never struck).
 * Every answer is true of the product today (`t.landing.compare`); one card per question on a phone.
 */
export function LandingCompare() {
  const { t } = useTranslation();
  const c = t.landing.compare;

  return (
    <Section id="why" eyebrow={c.eyebrow} title={c.title} lead={c.lead} reveal divider>
        <ComparisonTable
          label={c.title}
          topicLabel={c.topic}
          highlight="orazaka"
          columns={[
            { id: "cloud", label: c.cloud, icon: <GlobeIcon size={18} /> },
            { id: "orazaka", label: c.orazaka, icon: <LocalIcon size={18} nodeColor="var(--kz-accent)" /> },
          ]}
          rows={c.rows.map((row) => {
            const Icon = ICONS[row.id];
            return {
              id: row.id,
              topic: row.topic,
              icon: <Icon size={16} />,
              answers: { cloud: { key: row.cloud.key, detail: row.cloud.detail || undefined }, orazaka: { key: row.orazaka.key, detail: row.orazaka.detail || undefined } },
            };
          })}
        />
    </Section>
  );
}
