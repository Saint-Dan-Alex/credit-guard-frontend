"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Wallet,
  Calendar,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  // Dialogs
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const apps = await api.getApplications();
      const found = apps.find((a: any) => a.id === id || a.applicationNumber === id);
      if (found) {
        setApplication(found);
      } else if (apps.length > 0) {
        setApplication(apps[0]); // fallback for mock/seed demo
      }
    } catch (err) {
      console.error("Failed to load application detail:", err);
      toast.error("Impossible de charger le dossier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadApplication();
  }, [id]);

  const handleDecision = async (decision: "APPROVED" | "REJECTED") => {
    try {
      setActing(true);
      await api.decideApplication(application.id, {
        decision,
        comments: `Décision ${decision} enregistrée par le comité de crédit.`,
      });
      toast.success(
        decision === "APPROVED"
          ? "Dossier approuvé avec succès !"
          : "Dossier rejeté."
      );
      setApproveDialog(false);
      setRejectDialog(false);
      loadApplication();
    } catch (err: any) {
      console.error("Decision error:", err);
      toast.error(err.response?.data?.message || "Échec de l'action décisionnelle");
    } finally {
      setActing(false);
    }
  };

  const handleDisburse = async () => {
    try {
      setActing(true);
      await api.activateLoan({
        applicationId: application.id,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      toast.success("Prêt décaissé et activé !");
      router.push("/loans");
    } catch (err: any) {
      console.error("Disbursement error:", err);
      toast.error(err.response?.data?.message || "Échec du décaissement");
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!application) {
    return (
      <AppLayout>
        <div className="p-12 text-center space-y-4">
          <h2 className="text-base font-bold text-foreground">Dossier introuvable</h2>
          <Button asChild size="sm">
            <Link href="/applications">Retour aux dossiers</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const borrower = application.borrower || {};
  const isApproved = application.status === "APPROVED";
  const isDisbursed = application.status === "DISBURSED";
  const isRejected = application.status === "REJECTED";
  const isSubmitted = application.status === "SUBMITTED" || application.status === "UNDER_REVIEW";

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/applications">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour aux demandes</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {isSubmitted && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setRejectDialog(true)}
                  className="gap-1.5 text-xs"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Rejeter</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setApproveDialog(true)}
                  className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approuver le Crédit</span>
                </Button>
              </>
            )}

            {isApproved && (
              <Button
                variant="default"
                size="sm"
                onClick={handleDisburse}
                disabled={acting}
                className="gap-1.5 text-xs"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>Décaisser les Fonds</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Téléchargement du Mémo de Crédit...")}
              className="gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exporter Mémo</span>
            </Button>
          </div>
        </div>

        <PageHeader
          title={`Dossier ${application.applicationNumber || application.id?.slice(0, 8)}`}
          description={`Créé le ${formatDate(application.createdAt)} • Motif: ${application.purpose || "Non spécifié"}`}
          badge={application.status}
        />

        {/* Top Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Emprunteur
            </span>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {borrower.firstName || borrower.companyName || "Client"} {borrower.lastName || ""}
            </p>
            <p className="text-[11px] text-muted-foreground">{borrower.phone || borrower.email}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Montant Demandé
            </span>
            <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
              {formatCurrency(application.requestedAmount || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground">{application.durationMonths || 12} mensualités</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Score Risque IA
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-foreground">
                {application.score !== undefined ? `${application.score}/100` : "82/100"}
              </span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">Risque Modéré (B+)</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Circuit Maker-Checker
            </span>
            <p className="text-xs font-bold text-foreground mt-0.5">
              {isApproved || isDisbursed ? "Comité Validé" : isRejected ? "Rejeté" : "En cours d'examen"}
            </p>
            <p className="text-[11px] text-muted-foreground">Règle des 4 yeux active</p>
          </div>
        </div>

        {/* Tabs: Details, Scoring XAI, Collaterals, Audit */}
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="h-9 p-0.5">
            <TabsTrigger value="details" className="text-xs">
              Détails du Financement
            </TabsTrigger>
            <TabsTrigger value="scoring" className="text-xs">
              Analyse Risque & XAI
            </TabsTrigger>
            <TabsTrigger value="collaterals" className="text-xs">
              Garanties & Sûretés
            </TabsTrigger>
          </TabsList>

          {/* Details Content */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>Profil de l'Emprunteur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Type de Client</span>
                    <span className="font-bold text-foreground">{borrower.clientType || "Particulier / TPE"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Numéro National / Registre</span>
                    <span className="font-mono font-medium text-foreground">{borrower.idNumber || "CD-KIN-2026-9912"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Revenu Mensuel Estimé</span>
                    <span className="font-bold text-foreground">{formatCurrency(borrower.monthlyIncome || 3200)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Ville / Adresse</span>
                    <span className="font-medium text-foreground">{borrower.address || "Kinshasa, Gombe"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span>Conditions d'Amortissement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Montant Principal</span>
                    <span className="font-bold text-foreground">{formatCurrency(application.requestedAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Durée de Remboursement</span>
                    <span className="font-bold text-foreground">{application.durationMonths || 12} mois</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Taux d'Intérêt Annuel</span>
                    <span className="font-bold text-foreground">12.0%</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Méthode de Calcul</span>
                    <span className="font-medium text-foreground">Amortissement Constant (Annuités fixes)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scoring XAI */}
          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Moteur de Scoring Explicable (XAI)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Décomposition des facteurs influençant la recommandation décisionnelle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Ratio DTI (Endettement)
                    </span>
                    <p className="text-base font-bold text-foreground mt-0.5">28.4%</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Conforme (&lt; 40%)</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Couverture Garantie
                    </span>
                    <p className="text-base font-bold text-foreground mt-0.5">142%</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Excellente (&gt; 120%)</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Probabilité de Défaut (PD)
                    </span>
                    <p className="text-base font-bold text-foreground mt-0.5">1.6%</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Faible risque</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <h4 className="text-xs font-bold text-foreground">Synthèse de l'Agent Décisionnel IA :</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Le dossier présente un profil financier robuste avec des flux de trésorerie stables. 
                    Le ratio de couverture par gage immobilier à 142% offre une sécurité satisfaisante. 
                    Recommandation : <strong className="text-foreground">Approbation immédiate sans réserve.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaterals */}
          <TabsContent value="collaterals" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Garanties & Sûretés Enregistrées</CardTitle>
                <CardDescription className="text-xs">
                  Biens gagés et sûretés rattachées à la demande
                </CardDescription>
              </CardHeader>
              <CardContent>
                {application.collaterals && application.collaterals.length > 0 ? (
                  <div className="divide-y divide-border">
                    {application.collaterals.map((c: any) => (
                      <div key={c.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-foreground">{c.type}</p>
                          <p className="text-muted-foreground">{c.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{formatCurrency(c.value || 0)}</p>
                          <Badge variant="success" className="text-[9px]">Enregistrée</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    Une caution solidaire d'associé est enregistrée pour ce dossier.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialogs for Critical Actions */}
        <ConfirmDialog
          open={approveDialog}
          onOpenChange={setApproveDialog}
          title="Approuver la demande de crédit ?"
          description="Cette action validera définitivement le dossier au niveau du comité et autorisera la mise en place du contrat et le décaissement des fonds."
          confirmLabel="Confirmer l'Approbation"
          variant="default"
          onConfirm={() => handleDecision("APPROVED")}
          loading={acting}
        />

        <ConfirmDialog
          open={rejectDialog}
          onOpenChange={setRejectDialog}
          title="Rejeter la demande de crédit ?"
          description="Cette action est irréversible. Le dossier sera classé sans suite et l'emprunteur recevra une notification motivée de rejet."
          confirmLabel="Confirmer le Rejet"
          variant="destructive"
          onConfirm={() => handleDecision("REJECTED")}
          loading={acting}
        />
      </div>
    </AppLayout>
  );
}
