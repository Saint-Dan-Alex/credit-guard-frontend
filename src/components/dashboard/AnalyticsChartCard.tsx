"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

interface AnalyticsChartProps {
  stats?: {
    totalLoansAmount?: number;
    activeLoansCount?: number;
    totalInterestAccrued?: number;
  };
}

const DATA_SERIES: Record<string, { label: string; disbursed: number; repaid: number }[]> = {
  "7d": [
    { label: "Lun", disbursed: 12000, repaid: 8500 },
    { label: "Mar", disbursed: 18000, repaid: 12400 },
    { label: "Mer", disbursed: 15000, repaid: 9800 },
    { label: "Jeu", disbursed: 24000, repaid: 16200 },
    { label: "Ven", disbursed: 32000, repaid: 21500 },
    { label: "Sam", disbursed: 9000, repaid: 4500 },
    { label: "Dim", disbursed: 4000, repaid: 2000 },
  ],
  "30d": [
    { label: "Sem 1", disbursed: 65000, repaid: 48000 },
    { label: "Sem 2", disbursed: 92000, repaid: 74000 },
    { label: "Sem 3", disbursed: 110000, repaid: 89000 },
    { label: "Sem 4", disbursed: 145000, repaid: 112000 },
  ],
  "90d": [
    { label: "Mois 1", disbursed: 280000, repaid: 210000 },
    { label: "Mois 2", disbursed: 340000, repaid: 275000 },
    { label: "Mois 3", disbursed: 420000, repaid: 335000 },
  ],
  "1y": [
    { label: "T1", disbursed: 780000, repaid: 620000 },
    { label: "T2", disbursed: 920000, repaid: 780000 },
    { label: "T3", disbursed: 1150000, repaid: 940000 },
    { label: "T4", disbursed: 1420000, repaid: 1180000 },
  ],
};

export function AnalyticsChartCard({ stats }: AnalyticsChartProps) {
  const [period, setPeriod] = React.useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const data = DATA_SERIES[period];
  const maxVal = Math.max(...data.map((d) => Math.max(d.disbursed, d.repaid))) * 1.15;

  const totalDisbursedPeriod = data.reduce((acc, d) => acc + d.disbursed, 0);
  const totalRepaidPeriod = data.reduce((acc, d) => acc + d.repaid, 0);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <span>Performance des Décaissements & Recouvrements</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
              Temps Réel
            </span>
          </CardTitle>
          <CardDescription className="text-xs">
            Volume des crédits décaissés vs flux des remboursements encaissés
          </CardDescription>
        </div>

        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as any)}
          className="w-auto"
        >
          <TabsList className="h-8 p-0.5">
            <TabsTrigger value="7d" className="text-[11px] px-2.5 py-1">
              7 jours
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-[11px] px-2.5 py-1">
              30 jours
            </TabsTrigger>
            <TabsTrigger value="90d" className="text-[11px] px-2.5 py-1">
              90 jours
            </TabsTrigger>
            <TabsTrigger value="1y" className="text-[11px] px-2.5 py-1">
              1 an
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-muted/30 border border-border/60">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Décaissements Période
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {formatCurrency(totalDisbursedPeriod)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Remboursements Encaissés
            </p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(totalRepaidPeriod)}
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Taux de Recouvrement
            </p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {((totalRepaidPeriod / (totalDisbursedPeriod || 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="h-48 flex items-end gap-3 pt-6 px-2">
          {data.map((item, idx) => {
            const disbursedHeight = (item.disbursed / maxVal) * 100;
            const repaidHeight = (item.repaid / maxVal) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-10 z-20 px-2.5 py-1.5 rounded-lg bg-popover border border-border shadow-xl text-[10px] whitespace-nowrap text-foreground pointer-events-none animate-in fade-in zoom-in-95">
                    <div className="font-bold">{item.label}</div>
                    <div className="text-blue-600 font-semibold">
                      Décaissé: {formatCurrency(item.disbursed)}
                    </div>
                    <div className="text-emerald-600 font-semibold">
                      Encaissé: {formatCurrency(item.repaid)}
                    </div>
                  </div>
                )}

                {/* Bars Pair */}
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Disbursed Bar */}
                  <div
                    style={{ height: `${disbursedHeight}%` }}
                    className="w-full max-w-[18px] bg-blue-600 dark:bg-blue-500 rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                  />
                  {/* Repaid Bar */}
                  <div
                    style={{ height: `${repaidHeight}%` }}
                    className="w-full max-w-[18px] bg-emerald-500 dark:bg-emerald-400 rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                  />
                </div>

                {/* Label */}
                <span className="text-[10px] font-semibold text-muted-foreground mt-2 truncate max-w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-600 dark:bg-blue-500" />
            <span className="text-[11px] font-medium">Crédits Décaissés</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
            <span className="text-[11px] font-medium">Flux Encaissés</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
