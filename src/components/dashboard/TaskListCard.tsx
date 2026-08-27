"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  applicant: string;
  amount: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: string;
  href: string;
}

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Validation Comité Maker-Checker",
    applicant: "Alimentation Générale Lemba",
    amount: "25 000 USD",
    priority: "HIGH",
    status: "EN_ATTENTE_COMITE",
    href: "/applications/tasks",
  },
  {
    id: "task-2",
    title: "Contrôle Garantie Hypothécaire",
    applicant: "Kabuya Dani (Maison Gombe)",
    amount: "80 000 USD",
    priority: "MEDIUM",
    status: "AUDIT_GARANTIE",
    href: "/applications/tasks",
  },
  {
    id: "task-3",
    title: "Examen Restructuration Prêt",
    applicant: "Transport Rapide Express",
    amount: "15 000 USD",
    priority: "HIGH",
    status: "RESTRUCTURATION",
    href: "/loans",
  },
];

export function TaskListCard({ tasks = DEFAULT_TASKS }: { tasks?: TaskItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold">
            Tâches & Décisions en Attente
          </CardTitle>
          <CardDescription className="text-xs">
            Dossiers nécessitant une intervention de votre rôle
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-primary">
          <Link href="/applications/tasks">
            <span>Tout voir</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="space-y-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground truncate">
                  {task.title}
                </span>
                <Badge
                  variant={
                    task.priority === "HIGH"
                      ? "destructive"
                      : task.priority === "MEDIUM"
                      ? "warning"
                      : "secondary"
                  }
                  className="text-[9px] px-1.5 py-0"
                >
                  {task.priority === "HIGH" ? "Urgent" : "Normal"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {task.applicant} • <span className="font-semibold text-foreground">{task.amount}</span>
              </p>
            </div>

            <Button size="sm" variant="subtle" asChild className="shrink-0 text-[11px] h-7 px-2.5">
              <Link href={task.href}>Traiter</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
