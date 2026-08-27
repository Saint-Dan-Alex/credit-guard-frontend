"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  Wallet,
  Calendar,
  Send,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadTasks = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      const data = await api.getPendingTasks();
      setTasks(data || []);
      if (data && data.length > 0 && !selectedApp) {
        setSelectedApp(data[0]);
      } else if (data && data.length === 0) {
        setSelectedApp(null);
      }
      if (isManual) toast.success("File de tâches actualisée");
    } catch (err) {
      console.error("Failed to load pending tasks:", err);
      toast.error("Erreur lors de la récupération des tâches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDecision = async (action: "APPROVE" | "REJECT" | "SEND_TO_COMMITTEE") => {
    if (!selectedApp) return;
    try {
      setProcessing(true);
      await api.submitDecision(selectedApp.id, {
        action,
        comment: comment || `Décision ${action} prise depuis le tableau Maker-Checker`,
      });
      toast.success(
        action === "APPROVE"
          ? "Dossier validé et transmis à l'étape suivante !"
          : action === "REJECT"
          ? "Dossier rejeté."
          : "Dossier transmis au comité supérieur."
      );
      setComment("");
      await loadTasks();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la soumission");
    } finally {
      setProcessing(false);
    }
  };

  const handleDisburse = async () => {
    if (!selectedApp) return;
    try {
      setProcessing(true);
      await api.activateLoan({
        applicationId: selectedApp.id,
      });
      toast.success("Prêt décaissé avec succès ! Échéancier généré.");
      await loadTasks();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du décaissement");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Tâches & Décisions Comité"
          description="Workflow Maker-Checker (Règle des 4 yeux) : validation et décaissement des crédits"
          badge={`${tasks.length} en attente`}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadTasks(true)}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Actualiser</span>
          </Button>
        </PageHeader>

        {loading ? (
          <TableLoadingState rows={6} cols={5} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="Toutes les tâches sont traitées"
            description="Aucun dossier en attente de validation pour votre rôle. Vous êtes à jour."
            actionLabel="Voir tous les dossiers"
            onAction={() => (window.location.href = "/applications")}
            icon={CheckCircle2}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Task List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                Dossiers en attente ({tasks.length})
              </h3>

              <div className="space-y-2">
                {tasks.map((task) => {
                  const isSelected = selectedApp?.id === task.id;
                  const borrower = task.borrower || {};

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedApp(task)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-primary">
                          {task.applicationNumber || task.id?.slice(0, 8)}
                        </span>
                        <Badge variant="warning" className="text-[9px]">
                          {task.status}
                        </Badge>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs font-bold text-foreground">
                          {borrower.firstName || borrower.companyName || "Client"} {borrower.lastName || ""}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {task.purpose || "Financement"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/60 text-xs">
                        <span className="font-bold text-foreground">
                          {formatCurrency(task.requestedAmount || 0)}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          <Sparkles className="h-3 w-3" />
                          <span>{task.score !== undefined ? `${task.score}/100` : "80/100"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Task Inspector (7 cols) */}
            {selectedApp && (
              <div className="lg:col-span-7">
                <Card className="sticky top-20 shadow-sm">
                  <CardHeader className="pb-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span>Inspection Dossier {selectedApp.applicationNumber || selectedApp.id?.slice(0, 8)}</span>
                          <Badge variant="info" className="text-[10px]">Maker-Checker</Badge>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Examen contradictoire et validation officielle
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
                        <Link href={`/applications/${selectedApp.id}`}>
                          <span>Fiche complète</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-5">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Montant
                        </span>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {formatCurrency(selectedApp.requestedAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Durée
                        </span>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {selectedApp.durationMonths || 12} mois
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Score Risque XAI
                        </span>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {selectedApp.score !== undefined ? `${selectedApp.score}/100` : "80/100"}
                        </p>
                      </div>
                    </div>

                    {/* Borrower snapshot */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>Emprunteur</span>
                      </h4>
                      <p className="text-muted-foreground">
                        {selectedApp.borrower?.firstName} {selectedApp.borrower?.lastName} • {selectedApp.borrower?.phone}
                      </p>
                    </div>

                    {/* Decision Comment Box */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">
                        Motivation / Commentaire de décision (Audit Trail) :
                      </label>
                      <Textarea
                        placeholder="Précisez les motifs de validation, réserves ou conditions suspensives..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="text-xs min-h-[70px]"
                      />
                    </div>

                    {/* Decision Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-border flex-wrap">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDecision("REJECT")}
                        disabled={processing}
                        className="gap-1 text-xs"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Rejeter</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecision("SEND_TO_COMMITTEE")}
                        disabled={processing}
                        className="gap-1 text-xs"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Escalader Comité</span>
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDecision("APPROVE")}
                        disabled={processing}
                        className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Valider le Dossier</span>
                      </Button>

                      {selectedApp.status === "APPROVED" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleDisburse}
                          disabled={processing}
                          className="gap-1 text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          <Wallet className="h-3.5 w-3.5" />
                          <span>Décaisser Immédiatement</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
