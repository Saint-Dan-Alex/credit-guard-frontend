import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage, e.g. +12.5 or -3.2
  period?: string;
  icon: React.ComponentType<{ className?: string }>;
  sparklineData?: number[];
  variant?: "blue" | "indigo" | "emerald" | "amber" | "rose";
  prefix?: string;
  suffix?: string;
}

export function KpiCard({
  title,
  value,
  change,
  period = "vs mois précédent",
  icon: Icon,
  sparklineData = [35, 42, 45, 52, 48, 59, 65, 72],
  variant = "blue",
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  // Generate SVG path for sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 100;
  const height = 28;

  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  const strokeColor =
    variant === "emerald" || (change && change > 0)
      ? "#10B981"
      : variant === "rose" || (change && change < 0)
      ? "#EF4444"
      : "#3B82F6";

  return (
    <Card className="hover:border-border hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 space-y-3">
        {/* Row 1: Icon + Title */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground tracking-tight truncate">
            {title}
          </span>
          <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        {/* Row 2: Prominent Value */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </span>
        </div>

        {/* Row 3: Delta Variation + Sparkline */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          {change !== undefined ? (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={cn(
                  "inline-flex items-center font-bold px-1.5 py-0.5 rounded",
                  isPositive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                  isNegative && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                  isNeutral && "bg-muted text-muted-foreground"
                )}
              >
                {isPositive && <TrendingUp className="h-3 w-3 mr-0.5" />}
                {isNegative && <TrendingDown className="h-3 w-3 mr-0.5" />}
                {isNeutral && <Minus className="h-3 w-3 mr-0.5" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </span>
              <span className="text-muted-foreground text-[10px] truncate max-w-[100px]">
                {period}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-muted-foreground">{period}</span>
          )}

          {/* Mini Sparkline Chart */}
          <div className="w-20 h-7 shrink-0">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
