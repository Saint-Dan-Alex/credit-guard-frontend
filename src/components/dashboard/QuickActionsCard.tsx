import * as React from "react";
import Link from "next/link";
import {
  FilePlus,
  UserPlus,
  Calculator,
  ScanText,
  AlertOctagon,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const QUICK_ACTIONS = [
  {
    title: "Nouvelle Demande",
    desc: "Origination & scoring instantané",
    href: "/applications/new",
    icon: FilePlus,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    title: "Nouveau Client",
    desc: "Créer un profil emprunteur",
    href: "/clients/new",
    icon: UserPlus,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-300",
  },
  {
    title: "Audit IA & OCR",
    desc: "Contrôle d'authenticité & fraude",
    href: "/ai-assistant",
    icon: ScanText,
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  {
    title: "Recouvrement & PAR",
    desc: "Gestion des relances & contentieux",
    href: "/recovery",
    icon: AlertOctagon,
    color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300",
  },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Actions Rapides Métier</CardTitle>
        <CardDescription className="text-xs">
          Raccourcis vers les opérations les plus fréquentes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-border hover:shadow-xs transition-all group"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${action.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
