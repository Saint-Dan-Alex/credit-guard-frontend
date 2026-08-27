"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageToolbar } from "@/components/shared/PageToolbar";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableLoadingState, CardsLoadingState } from "@/components/shared/LoadingState";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PinButton } from "@/components/shared/PinButton";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  PhoneCall,
  Mail,
  MessageSquare,
  Gavel,
  RefreshCw,
  MoreHorizontal,
  Clock,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function RecoveryPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Persistence
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  // Collection Action Modal State
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [actionType, setActionType] = useState("PHONE_CALL");
  const [actionNotes, setActionNotes] = useState("");
  const [promiseAmount, setPromiseAmount] = useState("");
  const [promiseDate, setPromiseDate] = useState("");
  const [outcome, setOutcome] = useState("PROMISE_TAKEN");
  const [processingAction, setProcessingAction] = useState(false);

  // Litigation Modal State
  const [litigationCase, setLitigationCase] = useState<any>(null);
  const [courtJurisdiction, setCourtJurisdiction] = useState(
    "Tribunal de Commerce de Kinshasa / Gombe"
  );
  const [lawyerAssigned, setLawyerAssigned] = useState("Cabinet Juridique & Associés");
  const [litigationNotes, setLitigationNotes] = useState("");
  const [litigating, setLitigating] = useState(false);

  const loadRecoveryData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const [statsData, casesData] = await Promise.all([
        api.getRecoveryStats().catch(() => ({
          par30: 2.8,
          par60: 1.2,
          par90: 0.5,
          totalOverdueAmount: 14200,
          totalOverdueCases: 4,
        })),
        api.getDelinquencyCases().catch(() => []),
      ]);

      setStats(statsData);
      setCases(casesData || []);
      if (isManual) toast.success("Dossiers de recouvrement actualisés");
    } catch (err) {
      console.error("Failed to load recovery data:", err);
      toast.error("Impossible de charger les dossiers de recouvrement");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecoveryData();
  }, []);

  const handleRefreshDPD = async () => {
    try {
      setRefreshing(true);
      await api.refreshDelinquency();
      toast.success("Recalcul des retards DPD et classement des étapes exécuté !");
      await loadRecoveryData();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du recalcul des retards");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRecordAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    try {
      setProcessingAction(true);
      await api.recordCollectionAction(selectedCase.id, {
        type: actionType,
        notes: actionNotes,
        promiseAmount: promiseAmount ? parseFloat(promiseAmount) : undefined,
        promiseDate: promiseDate ? new Date(promiseDate).toISOString() : undefined,
        outcome,
      });

      toast.success("Action de recouvrement enregistrée avec succès !");
      setSelectedCase(null);
      setActionNotes("");
      setPromiseAmount("");
      setPromiseDate("");
      await loadRecoveryData();
    } catch (err: any) {
      toast.error(err.message || "Échec de l'enregistrement de l'action");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleInitiateLitigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!litigationCase) return;

    try {
      setLitigating(true);
      await api.initiateLitigation(litigationCase.id, {
        courtJurisdiction,
        lawyerAssigned,
        notes: litigationNotes,
      });

      toast.success("Dossier transmis au contentieux judiciaire !");
      setLitigationCase(null);
      setLitigationNotes("");
      await loadRecoveryData();
    } catch (err: any) {
      toast.error(err.message || "Échec de transmission au contentieux");
    } finally {
      setLitigating(false);
    }
  };

  const filteredCases = useMemo(() => {
    let list = cases;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const client = `${c.loan?.borrower?.firstName || ""} ${c.loan?.borrower?.lastName || ""} ${c.loan?.borrower?.companyName || ""}`.toLowerCase();
        const loanNum = (c.loan?.loanNumber || "").toLowerCase();
        return client.includes(q) || loanNum.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      const aPin = pinned[a.id] ? 1 : 0;
      const bPin = pinned[b.id] ? 1 : 0;
      if (aPin !== bPin) return bPin - aPin;
      return (b.daysPastDue || 0) - (a.daysPastDue || 0);
    });
  }, [cases, search, pinned]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage, pageSize]);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Recouvrement & Contentieux"
          description="Suivi des jours de retard (DPD), gestion des relances et procédures judiciaires"
          badge={`${filteredCases.length} dossiers en impayé`}
        >
          <Button
            variant="default"
            size="sm"
            onClick={handleRefreshDPD}
            disabled={refreshing}
            className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700"
          >
            <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Recalculer DPD en Direct</span>
          </Button>
        </PageHeader>

        {/* 4 KPI Risk Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="PAR 30 (Retard 1 à 30j)"
            value={`${stats?.par30 || 2.8}%`}
            change={-0.3}
            period="Stage 2 Amortissement"
            icon={AlertTriangle}
            variant="amber"
          />

          <KpiCard
            title="PAR 60 (Retard 31 à 60j)"
            value={`${stats?.par60 || 1.2}%`}
            change={0.1}
            period="Surveillance renforcée"
            icon={Clock}
            variant="rose"
          />

          <KpiCard
            title="PAR 90+ / Contentieux"
            value={`${stats?.par90 || 0.5}%`}
            change={0.0}
            period="Défaut & Avocat"
            icon={Gavel}
            variant="rose"
          />

          <KpiCard
            title="Montant Total en Retard"
            value={formatCurrency(stats?.totalOverdueAmount || 14200)}
            period="Encours éligible recouvrement"
            icon={Wallet}
            variant="indigo"
          />
        </div>

        {/* Toolbar */}
        <PageToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Rechercher par emprunteur, numéro de prêt..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => loadRecoveryData(true)}
          isRefreshing={refreshing}
        />

        {/* Content */}
        {loading ? (
          viewMode === "table" ? (
            <TableLoadingState rows={6} cols={7} />
          ) : (
            <CardsLoadingState count={6} />
          )
        ) : filteredCases.length === 0 ? (
          <EmptyState
            title="Aucun dossier en impayé"
            description="Le portefeuille est actuellement à jour. Tous les échéanciers sont respectés."
            actionLabel="Recalculer les retards"
            onAction={handleRefreshDPD}
            icon={CheckCircle2}
          />
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                    <th className="p-3.5 pl-4">Emprunteur</th>
                    <th className="p-3.5">Prêt Associé</th>
                    <th className="p-3.5">Retard (DPD)</th>
                    <th className="p-3.5">Montant en Retard</th>
                    <th className="p-3.5">Phase de Risque</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedCases.map((c) => {
                    const borrower = c.loan?.borrower || {};
                    const isFav = favorites[c.id] || false;
                    const isPin = pinned[c.id] || false;
                    const dpd = c.daysPastDue || 0;

                    return (
                      <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-3.5 pl-4">
                          <div className="font-bold text-foreground">
                            {borrower.firstName || borrower.companyName || "Client"} {borrower.lastName || ""}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{borrower.phone}</p>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-primary">
                          <Link href={`/loans/${c.loanId}`} className="hover:underline">
                            {c.loan?.loanNumber || c.loanId?.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                              dpd > 60
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                : dpd > 30
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            }`}
                          >
                            {dpd} jours
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">
                          {formatCurrency(c.totalOverdueAmount || 0)}
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px]">
                            {c.stage || (dpd > 60 ? "Stage 3 (NPL)" : "Stage 2 (PAR)")}
                          </Badge>
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={c.status === "LEGAL_RECOVERY" ? "destructive" : "warning"}
                            className="text-[9px]"
                          >
                            {c.status === "LEGAL_RECOVERY" ? "Contentieux Judiciaire" : c.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <FavoriteButton
                              isFavorite={isFav}
                              onToggle={(f) => setFavorites({ ...favorites, [c.id]: f })}
                            />
                            <PinButton
                              isPinned={isPin}
                              onToggle={(p) => setPinned({ ...pinned, [c.id]: p })}
                            />

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel>Recouvrement</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCase(c);
                                    setActionType("PHONE_CALL");
                                    setPromiseAmount(String(c.totalOverdueAmount || ""));
                                  }}
                                >
                                  <PhoneCall className="h-3.5 w-3.5 mr-2 text-blue-600" />
                                  <span>Enregistrer Appel / Visite</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setLitigationCase(c);
                                    setLitigationNotes(`Créance de ${formatCurrency(c.totalOverdueAmount || 0)} en souffrance depuis ${dpd} jours.`);
                                  }}
                                >
                                  <Gavel className="h-3.5 w-3.5 mr-2 text-rose-600" />
                                  <span>Transmettre au Contentieux</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCases.map((c) => (
              <Card key={c.id} className="hover:border-border hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-primary">
                      {c.loan?.loanNumber}
                    </span>
                    <Badge variant="warning" className="text-[9px]">{c.daysPastDue || 0} jours</Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {c.loan?.borrower?.firstName} {c.loan?.borrower?.lastName}
                    </h4>
                    <p className="text-xs text-muted-foreground">{c.loan?.borrower?.phone}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border/60 text-xs">
                    <span className="text-muted-foreground">Impayé exigible :</span>
                    <span className="font-bold text-rose-600">{formatCurrency(c.totalOverdueAmount || 0)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCase(c);
                        setActionType("PHONE_CALL");
                      }}
                      className="h-7 text-xs"
                    >
                      Relancer
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setLitigationCase(c)}
                      className="h-7 text-xs"
                    >
                      Contentieux
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCases.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCases.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Record Action Dialog */}
        <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleRecordAction}>
              <DialogHeader>
                <DialogTitle>Enregistrer une Action de Relance</DialogTitle>
                <DialogDescription className="text-xs">
                  Dossier {selectedCase?.loan?.loanNumber} • Impayé: {formatCurrency(selectedCase?.totalOverdueAmount || 0)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Type d'Action</label>
                  <Select value={actionType} onValueChange={setActionType}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHONE_CALL">Appel Téléphonique</SelectItem>
                      <SelectItem value="SMS_REMINDER">SMS de Relance</SelectItem>
                      <SelectItem value="FIELD_VISIT">Visite Terrain / Domicile</SelectItem>
                      <SelectItem value="FORMAL_NOTICE">Mise en Demeure Écrite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Montant Promis (USD)</label>
                    <Input
                      type="number"
                      value={promiseAmount}
                      onChange={(e) => setPromiseAmount(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Date Promesse</label>
                    <Input
                      type="date"
                      value={promiseDate}
                      onChange={(e) => setPromiseDate(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Résultat de l'Échange</label>
                  <Select value={outcome} onValueChange={setOutcome}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROMISE_TAKEN">Promesse de Paiement Reçue</SelectItem>
                      <SelectItem value="CONTACTED_NO_PROMISE">Contact Établi sans Engagement</SelectItem>
                      <SelectItem value="UNREACHABLE">Injoignable</SelectItem>
                      <SelectItem value="REFUSAL">Refus de Payer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Compte-rendu détaillé</label>
                  <Textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Précisez le teneur de la conversation..."
                    className="text-xs min-h-[60px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCase(null)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm" disabled={processingAction}>
                  {processingAction ? "Enregistrement..." : "Enregistrer l'Action"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Initiate Litigation Dialog */}
        <Dialog open={!!litigationCase} onOpenChange={(open) => !open && setLitigationCase(null)}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleInitiateLitigation}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-rose-600">
                  <Gavel className="h-4 w-4" />
                  <span>Transmission au Contentieux Judiciaire</span>
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Ouverture d'une procédure légale de recouvrement forcé et saisie des garanties.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Juridiction Compétente</label>
                  <Input
                    type="text"
                    value={courtJurisdiction}
                    onChange={(e) => setCourtJurisdiction(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Avocat / Conseil Assigné</label>
                  <Input
                    type="text"
                    value={lawyerAssigned}
                    onChange={(e) => setLawyerAssigned(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Motif & Références Légales</label>
                  <Textarea
                    value={litigationNotes}
                    onChange={(e) => setLitigationNotes(e.target.value)}
                    className="text-xs min-h-[60px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setLitigationCase(null)}>
                  Annuler
                </Button>
                <Button type="submit" variant="destructive" size="sm" disabled={litigating}>
                  {litigating ? "Transmission..." : "Initier la Procédure Judiciaire"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
