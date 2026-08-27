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
import { BulkActions } from "@/components/shared/BulkActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Wallet,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Download,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection & persistence
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  // Repayment Dialog State
  const [repayTarget, setRepayTarget] = useState<any>(null);
  const [repayAmount, setRepayAmount] = useState("");
  const [repayMethod, setRepayMethod] = useState("MOBILE_MONEY");
  const [transRef, setTransRef] = useState("");
  const [repaying, setRepaying] = useState(false);

  // Restructure Dialog State
  const [restructureTarget, setRestructureTarget] = useState<any>(null);
  const [newDuration, setNewDuration] = useState("18");
  const [newRate, setNewRate] = useState("12.0");
  const [restructureReason, setRestructureReason] = useState("");
  const [restructuring, setRestructuring] = useState(false);

  const loadLoans = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await api.getLoans(statusFilter !== "ALL" ? statusFilter : undefined);
      setLoans(data || []);
      if (isManual) toast.success("Encours et prêts actualisés");
    } catch (err) {
      console.error("Failed to load loans:", err);
      toast.error("Impossible de récupérer les prêts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [statusFilter]);

  const filteredLoans = useMemo(() => {
    let list = loans;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) => {
        const num = (l.loanNumber || l.id || "").toLowerCase();
        const client = `${l.borrower?.firstName || ""} ${l.borrower?.lastName || ""} ${l.borrower?.companyName || ""}`.toLowerCase();
        return num.includes(q) || client.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      const aPin = pinned[a.id] ? 1 : 0;
      const bPin = pinned[b.id] ? 1 : 0;
      if (aPin !== bPin) return bPin - aPin;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [loans, search, pinned]);

  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLoans.slice(start, start + pageSize);
  }, [filteredLoans, currentPage, pageSize]);

  const handleRepaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayTarget || !repayAmount) return;

    try {
      setRepaying(true);
      await api.createRepayment({
        loanId: repayTarget.id,
        amount: parseFloat(repayAmount),
        method: repayMethod,
        transactionRef: transRef || undefined,
      });
      toast.success("Remboursement encaissé avec succès !");
      setRepayTarget(null);
      setRepayAmount("");
      setTransRef("");
      loadLoans();
    } catch (err: any) {
      toast.error(err.message || "Échec de l'encaissement");
    } finally {
      setRepaying(false);
    }
  };

  const handleRestructureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restructureTarget) return;

    try {
      setRestructuring(true);
      await api.restructureLoan(restructureTarget.id, {
        newDurationMonths: parseInt(newDuration),
        newInterestRate: parseFloat(newRate),
        reason: restructureReason || "Rééchelonnement amiable de la dette",
      });
      toast.success("Prêt restructuré ! Nouvel échéancier généré.");
      setRestructureTarget(null);
      setRestructureReason("");
      loadLoans();
    } catch (err: any) {
      toast.error(err.message || "Échec de la restructuration");
    } finally {
      setRestructuring(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Actif</Badge>;
      case "RESTRUCTURED":
        return <Badge variant="purple">Restructuré</Badge>;
      case "OVERDUE":
        return <Badge variant="warning">En Retard</Badge>;
      case "DEFAULTED":
        return <Badge variant="destructive">Défaut / Contentieux</Badge>;
      case "CLOSED":
        return <Badge variant="secondary">Clôturé / Soldé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Prêts & Échéanciers"
          description="Gestion des crédits actifs, suivi des amortissements, encaissements et restructurations"
          badge={`${filteredLoans.length} prêts`}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exportation de l'état du portefeuille...")}
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exporter Portefeuille</span>
          </Button>
        </PageHeader>

        {/* Toolbar */}
        <PageToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Rechercher par numéro de prêt, emprunteur..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => loadLoans(true)}
          isRefreshing={refreshing}
          activeFilterCount={statusFilter !== "ALL" ? 1 : 0}
          onResetFilters={() => {
            setStatusFilter("ALL");
            setSearch("");
          }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
                <Filter className="h-3.5 w-3.5" />
                <span>Statut ({statusFilter === "ALL" ? "Tous" : statusFilter})</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="space-y-1">
                {[
                  { id: "ALL", label: "Tous les prêts" },
                  { id: "ACTIVE", label: "Actifs" },
                  { id: "RESTRUCTURED", label: "Restructurés" },
                  { id: "OVERDUE", label: "En Retard" },
                  { id: "CLOSED", label: "Soldés" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStatusFilter(s.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      statusFilter === s.id
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </PageToolbar>

        {/* Content */}
        {loading ? (
          viewMode === "table" ? (
            <TableLoadingState rows={6} cols={7} />
          ) : (
            <CardsLoadingState count={6} />
          )
        ) : filteredLoans.length === 0 ? (
          <EmptyState
            type={search || statusFilter !== "ALL" ? "no-results" : "empty"}
            title={
              search || statusFilter !== "ALL"
                ? "Aucun prêt ne correspond à vos filtres"
                : "Aucun prêt actif enregistré"
            }
            description="Les prêts sont générés automatiquement lors de la validation et du décaissement d'une demande de financement."
            actionLabel="Voir les demandes"
            onAction={() => (window.location.href = "/applications")}
          />
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                    <th className="p-3.5 pl-4 w-10">
                      <Checkbox
                        checked={
                          paginatedLoans.length > 0 &&
                          selectedIds.length === paginatedLoans.length
                        }
                        onCheckedChange={() => {
                          if (selectedIds.length === paginatedLoans.length) {
                            setSelectedIds([]);
                          } else {
                            setSelectedIds(paginatedLoans.map((l) => l.id));
                          }
                        }}
                      />
                    </th>
                    <th className="p-3.5">Numéro Prêt</th>
                    <th className="p-3.5">Emprunteur</th>
                    <th className="p-3.5">Principal Initial</th>
                    <th className="p-3.5">Capital Restant</th>
                    <th className="p-3.5">Taux</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedLoans.map((loan) => {
                    const isSelected = selectedIds.includes(loan.id);
                    const isFav = favorites[loan.id] || false;
                    const isPin = pinned[loan.id] || false;
                    const borrower = loan.borrower || {};

                    return (
                      <tr
                        key={loan.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          isSelected ? "bg-muted/50" : ""
                        }`}
                      >
                        <td className="p-3.5 pl-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              setSelectedIds((prev) =>
                                prev.includes(loan.id)
                                  ? prev.filter((i) => i !== loan.id)
                                  : [...prev, loan.id]
                              )
                            }
                          />
                        </td>
                        <td className="p-3.5 font-mono font-bold text-primary">
                          <Link href={`/loans/${loan.id}`} className="hover:underline">
                            {loan.loanNumber || loan.id?.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-foreground">
                            {borrower.firstName || borrower.companyName || "Client"} {borrower.lastName || ""}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-foreground">
                          {formatCurrency(loan.principalAmount || 0)}
                        </td>
                        <td className="p-3.5 font-extrabold text-blue-600 dark:text-blue-400">
                          {formatCurrency(loan.remainingPrincipal || 0)}
                        </td>
                        <td className="p-3.5 text-muted-foreground font-medium">
                          {loan.interestRate || 12.0}% / an
                        </td>
                        <td className="p-3.5">{getStatusBadge(loan.status)}</td>
                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <FavoriteButton
                              isFavorite={isFav}
                              onToggle={(f) => setFavorites({ ...favorites, [loan.id]: f })}
                              itemName={loan.loanNumber || "Prêt"}
                            />
                            <PinButton
                              isPinned={isPin}
                              onToggle={(p) => setPinned({ ...pinned, [loan.id]: p })}
                              itemName={loan.loanNumber || "Prêt"}
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
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Opérations</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/loans/${loan.id}`}>
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    <span>Consulter Échéancier</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setRepayTarget(loan);
                                    setRepayAmount(String(loan.remainingPrincipal ? Math.min(loan.remainingPrincipal, 500) : 500));
                                  }}
                                >
                                  <Wallet className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                                  <span>Encaisser Remboursement</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setRestructureTarget(loan)}
                                >
                                  <RotateCcw className="h-3.5 w-3.5 mr-2 text-purple-600" />
                                  <span>Restructurer le Prêt</span>
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
            {paginatedLoans.map((loan) => (
              <Card key={loan.id} className="hover:border-border hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-primary">
                      {loan.loanNumber || loan.id?.slice(0, 8)}
                    </span>
                    {getStatusBadge(loan.status)}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {loan.borrower?.firstName || loan.borrower?.companyName || "Client"} {loan.borrower?.lastName || ""}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Décaissé le {formatDate(loan.disbursementDate || loan.createdAt)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Initial
                      </span>
                      <p className="font-bold">{formatCurrency(loan.principalAmount || 0)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Restant
                      </span>
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(loan.remainingPrincipal || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRepayTarget(loan);
                        setRepayAmount("500");
                      }}
                      className="h-7 text-xs"
                    >
                      Encaisser
                    </Button>

                    <Button size="sm" variant="subtle" asChild className="h-7 text-xs">
                      <Link href={`/loans/${loan.id}`}>Échéancier</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredLoans.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredLoans.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Repayment Dialog */}
        <Dialog open={!!repayTarget} onOpenChange={(open) => !open && setRepayTarget(null)}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleRepaymentSubmit}>
              <DialogHeader>
                <DialogTitle>Enregistrer un Remboursement</DialogTitle>
                <DialogDescription className="text-xs">
                  Prêt {repayTarget?.loanNumber} • Capital restant: {formatCurrency(repayTarget?.remainingPrincipal || 0)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Montant Encaissé (USD) *</label>
                  <Input
                    type="number"
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Canal de Règlement</label>
                  <Select value={repayMethod} onValueChange={setRepayMethod}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOBILE_MONEY">Mobile Money (M-Pesa, Orange, Airtel)</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Virement Bancaire</SelectItem>
                      <SelectItem value="CASH">Espèces / Guichet</SelectItem>
                      <SelectItem value="CHECK">Chèque Certifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Référence de Transaction</label>
                  <Input
                    type="text"
                    value={transRef}
                    onChange={(e) => setTransRef(e.target.value)}
                    placeholder="Ex: MPESA-8921893"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setRepayTarget(null)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm" disabled={repaying}>
                  {repaying ? "Validation..." : "Valider l'Encaissement"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Restructuring Dialog */}
        <Dialog open={!!restructureTarget} onOpenChange={(open) => !open && setRestructureTarget(null)}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleRestructureSubmit}>
              <DialogHeader>
                <DialogTitle>Restructuration du Prêt</DialogTitle>
                <DialogDescription className="text-xs">
                  Rééchelonnement du capital restant ({formatCurrency(restructureTarget?.remainingPrincipal || 0)})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Nouvelle Durée (Mois)</label>
                    <Input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      min="1"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Nouveau Taux (%)</label>
                    <Input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      step="0.1"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Motif de Restructuration</label>
                  <Textarea
                    value={restructureReason}
                    onChange={(e) => setRestructureReason(e.target.value)}
                    placeholder="Ex: Baisse temporaire de trésorerie, accord de rééchelonnement amiable"
                    className="text-xs min-h-[60px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setRestructureTarget(null)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm" disabled={restructuring} className="bg-purple-600 hover:bg-purple-700">
                  {restructuring ? "Restructuration..." : "Confirmer la Restructuration"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
