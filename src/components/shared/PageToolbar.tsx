"use client";

import * as React from "react";
import {
  Search,
  Filter,
  List,
  Grid2X2,
  Download,
  RefreshCw,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface PageToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  viewMode?: "table" | "cards";
  onViewModeChange?: (mode: "table" | "cards") => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExport?: () => void;
  children?: React.ReactNode;
  activeFilterCount?: number;
  onResetFilters?: () => void;
  columns?: { id: string; label: string; visible: boolean }[];
  onToggleColumn?: (id: string) => void;
}

export function PageToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing = false,
  onExport,
  children,
  activeFilterCount = 0,
  onResetFilters,
  columns,
  onToggleColumn,
}: PageToolbarProps) {
  return (
    <div className="space-y-3 mb-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar with clear */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Custom Filter Popover Slot */}
          {children}

          {/* Column Customizer */}
          {columns && onToggleColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Colonnes</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Affichage des colonnes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.visible}
                    onCheckedChange={() => onToggleColumn(col.id)}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* View Switcher */}
          {viewMode && onViewModeChange && (
            <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
              <Button
                variant={viewMode === "table" ? "subtle" : "ghost"}
                size="icon-sm"
                onClick={() => onViewModeChange("table")}
                className="h-7 w-7"
                title="Vue tableau"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "subtle" : "ghost"}
                size="icon-sm"
                onClick={() => onViewModeChange("cards")}
                className="h-7 w-7"
                title="Vue cartes"
              >
                <Grid2X2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Export button */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Exporter</span>
            </Button>
          )}

          {/* Refresh button */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              title="Actualiser la liste"
            >
              <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin text-primary" : "h-4 w-4"} />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Badges Row */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-muted-foreground">
            Filtres actifs ({activeFilterCount}) :
          </span>
          {onResetFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-6 text-[10px] text-destructive hover:bg-destructive/10 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
