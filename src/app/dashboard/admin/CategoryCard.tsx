"use client";

import * as React from "react";
import { Card, Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { MODEL_CATEGORY } from "@/core/constants/capability.constants";

export interface CatalogModel {
  id?: number;
  modelName: string;
  modelLabel: string;
  category: string;
  options?: string;
  isDefault?: boolean;
  providerName?: string;
}

interface CategoryCardProps {
  category: string;
  models: CatalogModel[];
  onEdit: (model: CatalogModel) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({
  category,
  models,
  onEdit,
  onDelete,
}: Readonly<CategoryCardProps>) {
  const { t } = useTranslation();

  const getCategoryLabel = React.useCallback(
    (cat: string) => {
      switch (cat) {
        case MODEL_CATEGORY.SPEECH:
          return t.admin.optSpeech;
        case MODEL_CATEGORY.IMAGE:
          return t.admin.optImage;
        case MODEL_CATEGORY.VIDEO:
          return t.admin.optVideo;
        case MODEL_CATEGORY.VISION:
          return t.admin.optVision;
        case MODEL_CATEGORY.AUDIO:
          return t.admin.optAudio;
        case "theme":
          return t.admin.optTheme;
        case "code":
          return t.admin.optCode;
        default:
          return cat;
      }
    },
    [t.admin],
  );

  return (
    <Card className="p-6 bg-card-bg/70 border-card-border backdrop-blur-lg flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-bold text-text-primary border-b pb-2 border-border-subtle capitalize flex items-center justify-between">
        <span>
          {getCategoryLabel(category)} {t.admin.modelsSuffix}
        </span>
        <span className="text-xs bg-surface-2 text-text-muted dark:text-text-secondary px-2.5 py-0.5 rounded-full font-bold">
          {models.length}
        </span>
      </h3>
      {models.length === 0 ? (
        <p className="text-sm text-text-secondary py-8 text-center italic">
          {t.admin.noModels}
        </p>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {models.map((model) => (
            <li
              key={model.id}
              className="py-3 flex items-center justify-between group first:pt-0 last:pb-0"
            >
              <article className="space-y-1 pr-4 flex-1 min-w-0">
                <header className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-text-primary truncate">
                    {model.modelLabel}
                  </h4>
                  {model.isDefault && (
                    <span className="text-[10px] bg-status-warning/10 dark:bg-status-warning/20 text-status-warning font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Icon name="checkCircle" className="h-2.5 w-2.5" />
                      {t.admin.activeDefault}
                    </span>
                  )}
                </header>
                <p className="text-xs text-text-muted font-mono truncate">
                  {model.modelName}
                </p>
                {model.options && (
                  <footer className="text-[10px] text-status-warning font-semibold bg-status-warning/5 px-1.5 py-0.5 rounded inline-block">
                    {t.admin.optionsPrefix}
                    {model.options}
                  </footer>
                )}
              </article>
              <section className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(model)}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-secondary dark:hover:text-text-primary hover:bg-surface-1/50 dark:hover:bg-surface-2 transition-colors"
                  title={t.admin.editModelTitle}
                >
                  <Icon name="edit" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => model.id && onDelete(model.id)}
                  className="p-2 rounded-xl text-text-secondary hover:text-status-error hover:bg-status-error dark:hover:bg-status-error/20 transition-colors"
                  title={t.admin.deleteModelTitle}
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </section>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
