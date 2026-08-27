"use client";

import * as React from "react";
import { Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PinButton({
  isPinned = false,
  onToggle,
  itemName = "élément",
  className,
}: {
  isPinned?: boolean;
  onToggle?: (pinned: boolean) => void;
  itemName?: string;
  className?: string;
}) {
  const [pinned, setPinned] = React.useState(isPinned);

  React.useEffect(() => {
    setPinned(isPinned);
  }, [isPinned]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !pinned;
    setPinned(next);
    if (onToggle) onToggle(next);
    if (next) {
      toast.success(`"${itemName}" épinglé en haut de la liste.`);
    } else {
      toast.info(`"${itemName}" désépinglé.`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      className={cn(
        "h-7 w-7 text-muted-foreground hover:text-blue-600 transition-colors",
        pinned && "text-blue-600 fill-blue-600 hover:text-blue-700",
        className
      )}
      title={pinned ? "Désépingler" : "Épingler en priorité"}
    >
      <Pin className={cn("h-3.5 w-3.5", pinned && "fill-blue-600 text-blue-600 rotate-45")} />
      <span className="sr-only">Épingler</span>
    </Button>
  );
}
