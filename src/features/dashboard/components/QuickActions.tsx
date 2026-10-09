import * as React from "react";
import { Icon, type IconName } from "@krizaka/orazaka-design-system";

import { cn } from "@krizaka/ui/cn";

interface QuickActionsProps {
  onStartNewChat: () => void;
  onResumeProfile: () => void;
  onConfigureSettings: () => void;
  accentClasses: {
    text: string;
    bgSoft: string;
  };
  t: {
    dashboard: {
      quickActions: string;
      startNewChat: string;
      startNewChatDesc: string;
      manageProfile: string;
      manageProfileDesc: string;
      configureSettings: string;
      configureSettingsDesc: string;
    };
  };
}

/**
 * Renders the Quick Actions section of the user dashboard — Calm Obsidian 2026.
 * Clean card grid with icon in accent-soft circle, no shimmer sweep or arrow tricks.
 *
 * @param props - The component properties.
 * @param props.onStartNewChat - Callback triggered to initialize a new chat session.
 * @param props.onResumeProfile - Callback triggered to view or manage the user profile.
 * @param props.onConfigureSettings - Callback triggered to navigate to settings config.
 * @param props.accentClasses - Accent styling configuration mapping text and background colors.
 * @param props.t - The localized translations dictionary for dashboard interface elements.
 * @returns React element representing the quick actions panel.
 */
export function QuickActions({
  onStartNewChat,
  onResumeProfile,
  onConfigureSettings,
  accentClasses,
  t,
}: Readonly<QuickActionsProps>) {
  const actions: { icon: IconName; label: string; desc: string; onClick: () => void }[] = [
    {
      icon: "newChat",
      label: t.dashboard.startNewChat,
      desc: t.dashboard.startNewChatDesc,
      onClick: onStartNewChat,
    },
    {
      icon: "profile",
      label: t.dashboard.manageProfile,
      desc: t.dashboard.manageProfileDesc,
      onClick: onResumeProfile,
    },
    {
      icon: "settings",
      label: t.dashboard.configureSettings,
      desc: t.dashboard.configureSettingsDesc,
      onClick: onConfigureSettings,
    },
  ];

  return (
    <div className="md:col-span-2 space-y-3">
      <h3 className="hud-label px-1">{t.dashboard.quickActions}</h3>

      <div className="grid gap-3">
        {actions.map(({ icon, label, desc, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="glass-card w-full text-left flex items-start gap-4 p-(--orazaka-space-card) rounded-lg border border-border-subtle bg-surface-1 hover:border-accent hover:shadow-md hover-lift transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <div
              className={cn(
                "p-2 rounded-md",
                accentClasses.bgSoft,
                accentClasses.text,
                "flex-shrink-0"
              )}
            >
              <Icon name={icon} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="fluid-sm font-semibold text-fg">
                {label}
              </h4>
              <p className="fluid-xs text-fg-secondary mt-1 leading-relaxed">
                {desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
