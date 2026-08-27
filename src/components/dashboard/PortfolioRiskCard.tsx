import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export function PortfolioRiskCard({
  par30 = 2.8,
  par60 = 1.2,
  par90 = 0.5,
  healthyRate = 95.5,
}: {
  par30?: number;
  par60?: number;
  par90?: number;
  healthyRate?: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <span>Qualité du Portefeuille & Risque IFRS 9</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Segmentation des encours par niveau de risque
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60 text-[10px] font-bold">
          <ShieldCheck className="h-3 w-3" />
          <span>PAR global &lt; 5%</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage 1: Healthy */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Stage 1 — Prêts Sains (Sans retard)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{healthyRate}%</span>
          </div>
          <Progress value={healthyRate} indicatorClassName="bg-emerald-500" />
        </div>

        {/* Stage 2: PAR 30 */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Stage 2 — PAR 30 (Retard 1 à 30j)</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{par30}%</span>
          </div>
          <Progress value={par30 * 10} indicatorClassName="bg-amber-500" />
        </div>

        {/* Stage 2: PAR 60 */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Stage 2 — PAR 60 (Retard 31 à 60j)</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">{par60}%</span>
          </div>
          <Progress value={par60 * 10} indicatorClassName="bg-orange-500" />
        </div>

        {/* Stage 3: PAR 90 / Contentieux */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Stage 3 — NPL / PAR 90+ (Défaut & Contentieux)</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">{par90}%</span>
          </div>
          <Progress value={par90 * 10} indicatorClassName="bg-rose-500" />
        </div>
      </CardContent>
    </Card>
  );
}
