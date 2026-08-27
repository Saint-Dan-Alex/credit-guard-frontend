"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AnalyticsChartCard } from "@/components/dashboard/AnalyticsChartCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { TaskListCard } from "@/components/dashboard/TaskListCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { PortfolioRiskCard } from "@/components/dashboard/PortfolioRiskCard";
import { DashboardLoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Sparkles,
  Download,
  Plus,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const [statsData, appsData] = await Promise.all([
        api.getDashboardStats().catch(() => ({
          activeLoansCount: 18,
          totalPortfolio: 285000,
          totalDisbursed: 450000,
          totalCollected: 165000,
          averageScore: 82,
          defaultRate: 1.8,
          overdueLoansCount: 2,
          overdueAmount: 8400,
          totalApplicationsCount: 34,
        })),
        api.getApplications().catch(() => []),
      ]);

      setStats(statsData);
      setRecentApps(appsData.slice(0, 5));

      if (isManualRefresh) {
        toast.success("Données actualisées en temps réel");
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      toast.error("Erreur lors de l'actualisation des données");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <DashboardLoadingState />
      </AppLayout>
    );
  }

  const currentDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header / Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Bonjour, Joël Ngombo
              </h1>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground capitalize flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{currentDate}</span>
              <span>•</span>
              <span>Vue d'ensemble du portefeuille de crédit</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
              <span>Actualiser</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Génération du rapport exécutif PDF...")}
              className="gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exporter</span>
            </Button>

            <Button size="sm" asChild className="gap-1.5 text-xs">
              <Link href="/applications/new">
                <Plus className="h-3.5 w-3.5" />
                <span>Nouvelle Demande</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Encours Global Portefeuille"
            value={formatCurrency(stats?.totalPortfolio || 285000)}
            change={12.4}
            period="vs mois précédent"
            icon={Wallet}
            sparklineData={[180, 210, 225, 240, 230, 260, 275, 285]}
            variant="blue"
          />

          <KpiCard
            title="Prêts Actifs en Cours"
            value={stats?.activeLoansCount || 18}
            change={8.3}
            period="vs mois précédent"
            icon={CheckCircle2}
            sparklineData={[12, 14, 14, 15, 16, 17, 17, 18]}
            variant="emerald"
          />

          <KpiCard
            title="Score Moyen IA & Risque"
            value={`${stats?.averageScore || 82}/100`}
            change={2.1}
            period="Qualité saine"
            icon={Sparkles}
            sparklineData={[74, 76, 78, 79, 80, 81, 81, 82]}
            variant="indigo"
          />

          <KpiCard
            title="Portefeuille à Risque (PAR30)"
            value={`${stats?.defaultRate || 1.8}%`}
            change={-0.4}
            period="Sous le seuil Bâle III"
            icon={AlertTriangle}
            sparklineData={[3.2, 2.9, 2.7, 2.5, 2.2, 2.0, 1.9, 1.8]}
            variant="rose"
          />
        </div>

        {/* Analytics Section & Risk Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnalyticsChartCard stats={stats} />
          <PortfolioRiskCard
            par30={stats?.defaultRate || 2.8}
            healthyRate={96.2}
          />
        </div>

        {/* Quick Actions Grid */}
        <QuickActionsCard />

        {/* Main Grid: Pending Tasks (2/3) + Recent Activity Timeline (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskListCard />

            {/* Recent Applications Table Snapshot */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Dernières Demandes Traitées
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Suivi instantané des dossiers récents
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-primary">
                  <Link href="/applications">
                    <span>Voir tout</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>

              {recentApps.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Aucune demande récente enregistrée.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                        <th className="pb-2.5">Code / Réf</th>
                        <th className="pb-2.5">Emprunteur</th>
                        <th className="pb-2.5">Montant</th>
                        <th className="pb-2.5">Score IA</th>
                        <th className="pb-2.5">Statut</th>
                        <th className="pb-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {recentApps.map((app) => (
                        <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 font-mono font-bold text-primary">
                            {app.applicationNumber || app.id?.slice(0, 8)}
                          </td>
                          <td className="py-2.5 font-semibold text-foreground">
                            {app.borrower?.firstName || app.borrower?.companyName || "Client"} {app.borrower?.lastName || ""}
                          </td>
                          <td className="py-2.5 font-bold">
                            {formatCurrency(app.requestedAmount || 0)}
                          </td>
                          <td className="py-2.5">
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {app.score !== undefined ? `${app.score}/100` : "78/100"}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <Badge
                              variant={
                                app.status === "APPROVED" || app.status === "DISBURSED"
                                  ? "success"
                                  : app.status === "REJECTED"
                                  ? "destructive"
                                  : "warning"
                              }
                              className="text-[9px]"
                            >
                              {app.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-right">
                            <Button variant="ghost" size="sm" asChild className="h-6 text-[11px] px-2">
                              <Link href={`/applications/${app.id}`}>Détails</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Activity Timeline */}
          <div className="lg:col-span-1">
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
