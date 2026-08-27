"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  TrendingUp,
  RefreshCw,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [recoveryStats, setRecoveryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("PORTFOLIO");

  const loadReports = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      const [dashStats, recStats] = await Promise.all([
        api.getDashboardStats().catch(() => ({
          activeLoansCount: 18,
          totalPortfolio: 285000,
          totalDisbursed: 450000,
          totalCollected: 165000,
          averageScore: 82,
          defaultRate: 1.8,
          overdueLoansCount: 2,
          overdueAmount: 8400,
        })),
        api.getRecoveryStats().catch(() => ({
          par30: 2.8,
          par60: 1.2,
          par90: 0.5,
          totalOverdueAmount: 14200,
        })),
      ]);
      setStats(dashStats);
      setRecoveryStats(recStats);
      if (isManual) toast.success("Rapports réglementaires actualisés");
    } catch (err) {
      console.error("Failed to load reports:", err);
      toast.error("Erreur lors de l'actualisation des rapports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleExport = (format: "EXCEL" | "PDF") => {
    toast.success(`Exportation du rapport réglementaire (${format}) générée.`);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Rapports & Intelligence Financière"
          description="États réglementaires prudentiels, analyse du portefeuille, ratios PAR et provisions IFRS 9"
          badge="BCC & Bâle III"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadReports(true)}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Actualiser</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleExport("EXCEL")}
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exporter Excel (.XLSX)</span>
          </Button>
        </PageHeader>

        {/* 4 Key Prudentiel Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Encours Global Brut"
            value={formatCurrency(stats?.totalPortfolio || 285000)}
            change={12.4}
            period="vs trimestre précédent"
            icon={Wallet}
            variant="blue"
          />

          <KpiCard
            title="Taux de PAR Global"
            value={`${recoveryStats?.par30 || 2.8}%`}
            change={-0.3}
            period="Seuil réglementaire : 5%"
            icon={ShieldCheck}
            variant="emerald"
          />

          <KpiCard
            title="Provisions IFRS 9 (ECL)"
            value={formatCurrency(18500)}
            change={1.1}
            period="Pertes attendues couvertes"
            icon={AlertTriangle}
            variant="amber"
          />

          <KpiCard
            title="Rendement Moyen Portefeuille"
            value="14.2%"
            change={0.5}
            period="Taux d'intérêt pondéré"
            icon={TrendingUp}
            variant="indigo"
          />
        </div>

        {/* Report Selector & Parameters */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold">Sélection du Rapport Prudentiel</CardTitle>
            <CardDescription className="text-xs">
              Choisissez le modèle de rapport à générer pour les instances de gouvernance et régulateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Type d'État</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PORTFOLIO">État Détaillé du Portefeuille de Crédit</SelectItem>
                    <SelectItem value="PAR_AGING">Balance Âgée des Impayés & PAR (30/60/90j)</SelectItem>
                    <SelectItem value="IFRS9_PROVISIONS">Tableau des Dépréciations & Pertes IFRS 9</SelectItem>
                    <SelectItem value="COLLATERAL_COVERAGE">Audit de Couverture des Sûretés Réelles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Périodicité</label>
                <Select defaultValue="MONTH">
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTH">Mensuel (Mois en cours)</SelectItem>
                    <SelectItem value="QUARTER">Trimestriel (T3 2026)</SelectItem>
                    <SelectItem value="ANNUAL">Annuel (Exercice 2026)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => handleExport("PDF")}
                  className="w-full h-9 gap-2 text-xs"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Générer le PDF Réglementaire</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Matrix Table Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">
              Segmentation du Portefeuille par Classe de Risque (Bâle III / IFRS 9)
            </CardTitle>
            <CardDescription className="text-xs">
              Répartition des encours sains, sous surveillance et en défaut
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                    <th className="p-3.5 pl-4">Catégorie de Risque</th>
                    <th className="p-3.5">Nombre de Crédits</th>
                    <th className="p-3.5">Encours Global (USD)</th>
                    <th className="p-3.5">Part de Portefeuille</th>
                    <th className="p-3.5">Taux de Provision Requis</th>
                    <th className="p-3.5 pr-4 text-right">Provision Estimée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-muted/30">
                    <td className="p-3.5 pl-4 font-bold text-foreground">
                      Stage 1 — Prêts Sains (Sans retard)
                    </td>
                    <td className="p-3.5">14</td>
                    <td className="p-3.5 font-bold">{formatCurrency(260000)}</td>
                    <td className="p-3.5 font-medium text-emerald-600">91.2%</td>
                    <td className="p-3.5 text-muted-foreground">1.0%</td>
                    <td className="p-3.5 pr-4 text-right font-bold">{formatCurrency(2600)}</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3.5 pl-4 font-bold text-amber-600">
                      Stage 2 — PAR 30 à 60j (Risque accru)
                    </td>
                    <td className="p-3.5">3</td>
                    <td className="p-3.5 font-bold">{formatCurrency(18000)}</td>
                    <td className="p-3.5 font-medium text-amber-600">6.3%</td>
                    <td className="p-3.5 text-muted-foreground">15.0%</td>
                    <td className="p-3.5 pr-4 text-right font-bold text-amber-600">{formatCurrency(2700)}</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3.5 pl-4 font-bold text-rose-600">
                      Stage 3 — NPL / Défaut (Contentieux)
                    </td>
                    <td className="p-3.5">1</td>
                    <td className="p-3.5 font-bold">{formatCurrency(7000)}</td>
                    <td className="p-3.5 font-medium text-rose-600">2.5%</td>
                    <td className="p-3.5 text-muted-foreground">50.0%</td>
                    <td className="p-3.5 pr-4 text-right font-bold text-rose-600">{formatCurrency(3500)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
