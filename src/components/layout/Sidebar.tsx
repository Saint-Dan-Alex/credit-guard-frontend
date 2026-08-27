"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Wallet,
  AlertCircle,
  BarChart3,
  Sparkles,
  Shield,
  Layers,
  History,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Building2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "warning" | "success" | "info";
}

interface NavSection {
  heading?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        title: "Tableau de Bord",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    heading: "Gestion des Crédits",
    items: [
      {
        title: "Demandes de Prêt",
        href: "/applications",
        icon: FileText,
      },
      {
        title: "Tâches & Décisions",
        href: "/applications/tasks",
        icon: ClipboardList,
        badge: "Comité",
        badgeVariant: "info",
      },
      {
        title: "Emprunteurs",
        href: "/clients",
        icon: Users,
      },
      {
        title: "Prêts & Échéanciers",
        href: "/loans",
        icon: Wallet,
      },
      {
        title: "Recouvrement & PAR",
        href: "/recovery",
        icon: AlertCircle,
        badge: "PAR",
        badgeVariant: "warning",
      },
    ],
  },
  {
    heading: "Intelligence & Rapports",
    items: [
      {
        title: "Copilot IA & OCR",
        href: "/ai-assistant",
        icon: Sparkles,
        badge: "XAI",
        badgeVariant: "success",
      },
      {
        title: "Rapports Réglementaires",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    heading: "Administration HRBAC",
    items: [
      {
        title: "Utilisateurs & Overrides",
        href: "/admin/users",
        icon: Shield,
      },
      {
        title: "Matrice des Rôles",
        href: "/admin/roles",
        icon: Layers,
      },
      {
        title: "Journaux d'Audit",
        href: "/admin/logs",
        icon: History,
      },
    ],
  },
];

export function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-200 z-30 select-none",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Workspace Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/80">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-blue-900/20 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold tracking-tight text-foreground truncate">
                  CreditGuard
                </h1>
                <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase truncate">
                  Enterprise SaaS
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-blue-900/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCollapsed(true)}
              className="text-muted-foreground hover:text-foreground h-7 w-7"
              title="Réduire le menu"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6 custom-scrollbar">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && section.heading && (
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1.5">
                  {section.heading}
                </p>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-9 w-9 mx-auto items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors relative group",
                            isActive &&
                              "bg-primary/10 text-primary font-bold hover:bg-primary/15"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {isActive && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1 rounded bg-primary/20 text-primary">
                            {item.badge}
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors relative group",
                      isActive &&
                        "bg-primary/10 text-primary font-bold hover:bg-primary/15"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0",
                          item.badgeVariant === "warning"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : item.badgeVariant === "success"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-border/80 bg-muted/20">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCollapsed(false)}
                  className="mx-auto flex h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Agrandir le menu</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Système Opérationnel</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Centre d'assistance</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
