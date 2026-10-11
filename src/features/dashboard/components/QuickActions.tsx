import type { ComponentType } from "react";
import type { IconProps } from "@krizaka/icons";
import { Card } from "@krizaka/ui/card";

export interface QuickAction {
  /** A signature icon. */
  icon: ComponentType<IconProps>;
  label: string;
  desc: string;
  onClick: () => void;
}

interface QuickActionsProps {
  /** The heading of the section ("Quick actions"). */
  title: string;
  actions: readonly QuickAction[];
}

/**
 * The dashboard's quick actions: one @krizaka/ui card each (interactive: spotlight and lift), a signature icon in the
 * accent, a line of what it opens.
 */
export function QuickActions({ title, actions }: Readonly<QuickActionsProps>) {
  return (
    <div className="space-y-3 md:col-span-2">
      <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">{title}</h3>
      <div className="grid gap-3">
        {actions.map(({ icon: Glyph, label, desc, onClick }, index) => (
          <Card.Root key={label} asChild interactive reveal={index}>
            <button type="button" onClick={onClick} className="text-left">
              <Card.Body className="flex-row items-start gap-4">
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-fg-accent">
                  <Glyph size={20} nodeColor="var(--kz-accent)" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-fg">{label}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-fg-secondary">{desc}</span>
                </span>
              </Card.Body>
            </button>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}
