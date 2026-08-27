"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FileCheck,
  Wallet,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "application" | "disbursement" | "repayment" | "recovery" | "ai" | "audit";
  title: string;
  description: string;
  user: string;
  timestamp: string | Date;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "application",
    title: "Dossier validé par le Comité",
    description: "Demande APP-2026-8941 approuvée pour 35 000 USD",
    user: "Marie Kabeya",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "act-2",
    type: "disbursement",
    title: "Décaissement effectué",
    description: "Prêt LN-2026-012 décaissé via Banque Centrale",
    user: "Jean Dupont",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: "act-3",
    type: "ai",
    title: "Audit OCR & Anti-Fraude",
    description: "Contrat hypothécaire certifié avec 99% d'authenticité",
    user: "Copilot IA",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "act-4",
    type: "recovery",
    title: "Action de Recouvrement",
    description: "Mise en demeure envoyée au garant de la SARL Congo Express",
    user: "Admin Recouvrement",
    timestamp: new Date(Date.now() - 180 * 60 * 1000),
  },
];

export function ActivityTimeline({ activities = DEFAULT_ACTIVITIES }: { activities?: ActivityItem[] }) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "application":
        return <FileCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
      case "disbursement":
        return <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "recovery":
        return <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />;
      case "ai":
        return <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Activité Récente</span>
          <span className="text-[10px] text-muted-foreground font-normal">
            En direct
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Derniers événements du cycle de crédit
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Dot Icon Indicator */}
              <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border shadow-xs group-hover:border-primary transition-colors">
                {getIcon(act.type)}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-foreground">
                    {act.title}
                  </p>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {act.description}
                </p>
                <div className="pt-0.5">
                  <span className="text-[9px] font-semibold text-muted-foreground/80 bg-muted px-1.5 py-0.2 rounded">
                    {act.user}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
