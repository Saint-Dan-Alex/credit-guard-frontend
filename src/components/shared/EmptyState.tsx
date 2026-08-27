import * as React from "react";
import { FolderSearch, SearchX, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type?: "empty" | "no-results";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  type = "empty",
  title,
  description,
  actionLabel,
  onAction,
  icon: CustomIcon,
}: EmptyStateProps) {
  const isNoResults = type === "no-results";

  const defaultTitle = isNoResults
    ? "Aucun résultat correspondant"
    : "Aucune donnée disponible";

  const defaultDesc = isNoResults
    ? "Aucun élément ne correspond aux filtres ou aux termes de recherche appliqués."
    : "Commencez par créer votre premier enregistrement pour voir apparaître les données.";

  const Icon = CustomIcon
    ? CustomIcon
    : isNoResults
    ? SearchX
    : FolderSearch;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10 my-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        {title || defaultTitle}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">
        {description || defaultDesc}
      </p>

      {onAction && actionLabel && (
        <div className="mt-5">
          <Button
            size="sm"
            onClick={onAction}
            variant={isNoResults ? "outline" : "default"}
            className="gap-2 text-xs"
          >
            {isNoResults ? (
              <RefreshCw className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>{actionLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
