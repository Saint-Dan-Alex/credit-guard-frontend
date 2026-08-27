"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Menu,
  ChevronRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NotificationCenter } from "./NotificationCenter";
import { UserNav } from "./UserNav";
import { CommandPalette } from "./CommandPalette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

const PATH_TITLES: Record<string, string> = {
  "/": "Tableau de Bord",
  "/applications": "Demandes de Financement",
  "/applications/new": "Nouvelle Demande",
  "/applications/tasks": "Tâches & Décisions Comité",
  "/loans": "Prêts & Échéanciers",
  "/recovery": "Recouvrement & Impayés",
  "/clients": "Clients Emprunteurs",
  "/clients/new": "Nouvel Emprunteur",
  "/ai-assistant": "Intelligence IA & Copilot",
  "/reports": "Rapports Réglementaires",
  "/admin/users": "Gestion des Utilisateurs",
  "/admin/roles": "Matrice des Rôles HRBAC",
  "/admin/logs": "Journaux d'Audit",
};

export function Header({
  onMobileMenuOpen,
}: {
  onMobileMenuOpen?: () => void;
}) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = React.useState(false);

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [{ label: "Tableau de Bord", href: "/", isLast: true }];
    }

    const breadcrumbs = [{ label: "Accueil", href: "/", isLast: false }];
    let accumulatedPath = "";

    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      const label = PATH_TITLES[accumulatedPath] || seg.charAt(0).toUpperCase() + seg.slice(1);
      breadcrumbs.push({ label, href: accumulatedPath, isLast });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all">
        {/* Left: Mobile Menu Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMobileMenuOpen}
            className="lg:hidden text-muted-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>

          <Breadcrumb className="hidden sm:flex">
            <BreadcrumbList>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={b.href}>
                  {idx > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {b.isLast ? (
                      <BreadcrumbPage>{b.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={b.href}>{b.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Center/Right: Quick Search Command Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted/70 hover:border-border hover:text-foreground w-44 md:w-64 justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Rechercher...</span>
            </div>
            <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Action Icons */}
          <div className="flex items-center gap-1.5">
            <NotificationCenter />
            <ThemeSwitcher />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </>
  );
}
