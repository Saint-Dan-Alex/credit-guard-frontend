"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LoanDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadLoan = async () => {
    try {
      setLoading(true);
      const data = await api.getLoanById(id);
      setLoan(data);
    } catch (err) {
      console.error("Failed to load loan details:", err);
      toast.error("Impossible de charger les détails du prêt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadLoan();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </AppLayout>
    );
  }

  if (!loan) {
    return (
      <AppLayout>
        <div className="p-12 text-center space-y-4">
          <h2 className="text-base font-bold">Prêt introuvable</h2>
          <Button asChild size="sm">
            <Link href="/loans">Retour à la liste des prêts</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const borrower = loan.borrower || {};
  const installments = loan.installments || [];
  const repayments = loan.repayments || [];

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/loans">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour aux prêts</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exportation PDF de l'échéancier...")}
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Télécharger Échéancier</span>
          </Button>
        </div>

        <PageHeader
          title={`Prêt ${loan.loanNumber || loan.id?.slice(0, 8)}`}
          description={`Emprunteur : ${borrower.firstName || borrower.companyName || "Client"} ${borrower.lastName || ""} • Décaissé le ${formatDate(loan.disbursementDate)}`}
          badge={loan.status}
        />

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Principal Décaissé
            </span>
            <p className="text-base font-bold text-foreground mt-0.5">
              {formatCurrency(loan.principalAmount || 0)}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Capital Restant Dû
            </span>
            <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
              {formatCurrency(loan.remainingPrincipal || 0)}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Taux d'Intérêt
            </span>
            <p className="text-base font-bold text-foreground mt-0.5">
              {loan.interestRate || 12.0}% / an
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Échéances Soldées
            </span>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {installments.filter((i: any) => i.status === "PAID").length} / {installments.length}
            </p>
          </div>
        </div>

        {/* Tabs: Amortization Schedule & Repayments History */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="h-9 p-0.5">
            <TabsTrigger value="schedule" className="text-xs">
              Tableau d'Amortissement ({installments.length} échéances)
            </TabsTrigger>
            <TabsTrigger value="repayments" className="text-xs">
              Historique des Règlements ({repayments.length})
            </TabsTrigger>
          </TabsList>

          {/* Schedule Table */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Échéancier Détaillé</CardTitle>
                <CardDescription className="text-xs">
                  Ventilation du capital, des intérêts et du solde après chaque paiement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                        <th className="p-3.5 pl-4">N°</th>
                        <th className="p-3.5">Date Échéance</th>
                        <th className="p-3.5">Principal</th>
                        <th className="p-3.5">Intérêts</th>
                        <th className="p-3.5">Mensualité Totale</th>
                        <th className="p-3.5">Capital Restant</th>
                        <th className="p-3.5 pr-4 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {installments.map((inst: any, idx: number) => (
                        <tr key={inst.id || idx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3.5 pl-4 font-mono font-bold text-muted-foreground">
                            {inst.installmentNumber || idx + 1}
                          </td>
                          <td className="p-3.5 font-medium">{formatDate(inst.dueDate)}</td>
                          <td className="p-3.5">{formatCurrency(inst.principalAmount || 0)}</td>
                          <td className="p-3.5 text-muted-foreground">{formatCurrency(inst.interestAmount || 0)}</td>
                          <td className="p-3.5 font-bold text-foreground">{formatCurrency(inst.totalAmount || 0)}</td>
                          <td className="p-3.5 font-mono">{formatCurrency(inst.remainingBalance || 0)}</td>
                          <td className="p-3.5 pr-4 text-right">
                            <Badge
                              variant={
                                inst.status === "PAID"
                                  ? "success"
                                  : inst.status === "OVERDUE"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-[9px]"
                            >
                              {inst.status === "PAID" ? "Payé" : inst.status === "OVERDUE" ? "En Retard" : "À Échoir"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repayments History */}
          <TabsContent value="repayments">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Encaissements Enregistrés</CardTitle>
                <CardDescription className="text-xs">
                  Historique des paiements effectués par l'emprunteur
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {repayments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Aucun paiement enregistré pour le moment.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                          <th className="p-3.5 pl-4">Date</th>
                          <th className="p-3.5">Montant Encaissé</th>
                          <th className="p-3.5">Canal de Paiement</th>
                          <th className="p-3.5">Référence</th>
                          <th className="p-3.5 pr-4 text-right">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {repayments.map((rep: any) => (
                          <tr key={rep.id} className="hover:bg-muted/30">
                            <td className="p-3.5 pl-4">{formatDate(rep.paymentDate || rep.createdAt)}</td>
                            <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(rep.amount || 0)}
                            </td>
                            <td className="p-3.5">{rep.method}</td>
                            <td className="p-3.5 font-mono text-muted-foreground">
                              {rep.transactionReference || "AUTO-001"}
                            </td>
                            <td className="p-3.5 pr-4 text-right">
                              <Badge variant="success" className="text-[9px]">Validé</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
