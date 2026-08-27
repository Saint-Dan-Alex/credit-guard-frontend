"use client";

import * as React from "react";
import { Trash2, Download, Archive, Pin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}

export function BulkActions({
  selectedCount,
  onClearSelection,
  onExport,
  onArchive,
  onDelete,
  onPin,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-popover/95 border border-border shadow-2xl px-4 py-2.5 rounded-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-border">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="text-xs font-bold text-foreground whitespace-nowrap">
          sélectionné{selectedCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-8 text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        )}

        {onPin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPin}
            className="h-8 text-xs gap-1.5"
          >
            <Pin className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Épingler</span>
          </Button>
        )}

        {onArchive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onArchive}
            className="h-8 text-xs gap-1.5"
          >
            <Archive className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Archiver</span>
          </Button>
        )}

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClearSelection}
          className="h-7 w-7 text-muted-foreground hover:text-foreground ml-1"
          title="Désélectionner tout"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
