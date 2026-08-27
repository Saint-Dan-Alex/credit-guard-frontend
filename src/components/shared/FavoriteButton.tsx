"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  isFavorite = false,
  onToggle,
  itemName = "élément",
  className,
}: {
  isFavorite?: boolean;
  onToggle?: (fav: boolean) => void;
  itemName?: string;
  className?: string;
}) {
  const [fav, setFav] = React.useState(isFavorite);

  React.useEffect(() => {
    setFav(isFavorite);
  }, [isFavorite]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    if (onToggle) onToggle(next);
    if (next) {
      toast.success(`"${itemName}" ajouté aux favoris.`);
    } else {
      toast.info(`"${itemName}" retiré des favoris.`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      className={cn(
        "h-7 w-7 text-muted-foreground hover:text-amber-500 transition-colors",
        fav && "text-amber-500 fill-amber-500 hover:text-amber-600",
        className
      )}
      title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Star className={cn("h-3.5 w-3.5", fav && "fill-amber-500 text-amber-500")} />
      <span className="sr-only">Favori</span>
    </Button>
  );
}
