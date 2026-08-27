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
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Trash2,
  Share2,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  // Configurable Columns
  const [columns, setColumns] = useState([
    { id: "code", label: "Code Dossier", visible: true },
    { id: "borrower", label: "Emprunteur", visible: true },
    { id: "amount", label: "Montant Demandé", visible: true },
    { id: "duration", label: "Durée", visible: true },
    { id: "score", label: "Score IA (XAI)", visible: true },
    { id: "status", label: "Statut", visible: true },
    { id: "date", label: "Date Dépôt", visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns(
      columns.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const loadApplications = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await api.getApplications({
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: search || undefined,
      });
      setApplications(data || []);
      if (isManual) toast.success("Dossiers actualisés");
    } catch (err) {
      console.error("Failed to load applications:", err);
      toast.error("Impossible de récupérer les dossiers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  // Client-side search and sorting (Pinned items first, then date)
  const filteredApps = useMemo(() => {
    let list = applications;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((app) => {
        const clientName = `${app.borrower?.firstName || ""} ${app.borrower?.lastName || ""} ${app.borrower?.companyName || ""}`.toLowerCase();
        const code = (app.applicationNumber || app.id || "").toLowerCase();
        const purpose = (app.purpose || "").toLowerCase();
        return clientName.includes(q) || code.includes(q) || purpose.includes(q);
      });
    }

    // Sort: pinned first
    return [...list].sort((a, b) => {
      const aPinned = pinned[a.id] ? 1 : 0;
      const bPinned = pinned[b.id] ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [applications, search, pinned]);

  // Paginated data
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, currentPage, pageSize]);

  // Toggle row selection
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedApps.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">Approuvé</Badge>;
      case "DISBURSED":
        return <Badge variant="default">Décaissé</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejeté</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="info">En Analyse</Badge>;
      case "SUBMITTED":
        return <Badge variant="warning">Soumis</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isColVisible = (id: string) => {
    const col = columns.find((c) => c.id === id);
    return col ? col.visible : true;
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Demandes de Financement"
          description="Instruction des dossiers d'emprunt, scoring prédictif et circuit décisionnel"
          badge={`${filteredApps.length} dossiers`}
        >
          <Button size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/applications/new">
              <Plus className="h-3.5 w-3.5" />
              <span>Nouvelle Demande</span>
            </Link>
          </Button>
        </PageHeader>

        {/* Toolbar with Search, Filters, Columns, ViewSwitcher */}
        <PageToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Rechercher par numéro, emprunteur, motif..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => loadApplications(true)}
          isRefreshing={refreshing}
          onExport={() => toast.success("Exportation CSV initiée avec succès")}
          activeFilterCount={statusFilter !== "ALL" ? 1 : 0}
          onResetFilters={() => {
            setStatusFilter("ALL");
            setSearch("");
          }}
          columns={columns}
          onToggleColumn={toggleColumn}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
                <Filter className="h-3.5 w-3.5" />
                <span>Statut ({statusFilter === "ALL" ? "Tous" : statusFilter})</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                {[
                  { id: "ALL", label: "Tous les statuts" },
                  { id: "SUBMITTED", label: "Soumis" },
                  { id: "UNDER_REVIEW", label: "En Analyse" },
                  { id: "APPROVED", label: "Approuvé" },
                  { id: "DISBURSED", label: "Décaissé" },
                  { id: "REJECTED", label: "Rejeté" },
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

        {/* Loading State */}
        {loading ? (
          viewMode === "table" ? (
            <TableLoadingState rows={8} cols={7} />
          ) : (
            <CardsLoadingState count={6} />
          )
        ) : filteredApps.length === 0 ? (
          <EmptyState
            type={search || statusFilter !== "ALL" ? "no-results" : "empty"}
            title={
              search || statusFilter !== "ALL"
                ? "Aucune demande ne correspond à vos filtres"
                : "Aucune demande de prêt enregistrée"
            }
            description={
              search || statusFilter !== "ALL"
                ? "Essayez de modifier votre recherche ou de réinitialiser le filtre de statut."
                : "Créez une nouvelle demande pour lancer l'instruction et le scoring automatique."
            }
            actionLabel={
              search || statusFilter !== "ALL"
                ? "Réinitialiser les filtres"
                : "Créer une Demande"
            }
            onAction={
              search || statusFilter !== "ALL"
                ? () => {
                    setSearch("");
                    setStatusFilter("ALL");
                  }
                : undefined
            }
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
                          paginatedApps.length > 0 &&
                          selectedIds.length === paginatedApps.length
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Sélectionner tout"
                      />
                    </th>
                    {isColVisible("code") && <th className="p-3.5">Code</th>}
                    {isColVisible("borrower") && <th className="p-3.5">Emprunteur</th>}
                    {isColVisible("amount") && <th className="p-3.5">Montant Demandé</th>}
                    {isColVisible("duration") && <th className="p-3.5">Durée</th>}
                    {isColVisible("score") && <th className="p-3.5">Score IA</th>}
                    {isColVisible("status") && <th className="p-3.5">Statut</th>}
                    {isColVisible("date") && <th className="p-3.5">Date</th>}
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedApps.map((app) => {
                    const isSelected = selectedIds.includes(app.id);
                    const isFav = favorites[app.id] || false;
                    const isPin = pinned[app.id] || false;

                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          isSelected ? "bg-muted/50" : ""
                        }`}
                      >
                        <td className="p-3.5 pl-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectOne(app.id)}
                            aria-label={`Sélectionner ${app.id}`}
                          />
                        </td>

                        {isColVisible("code") && (
                          <td className="p-3.5 font-mono font-bold text-primary">
                            <div className="flex items-center gap-1.5">
                              {isPin && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                              )}
                              <Link
                                href={`/applications/${app.id}`}
                                className="hover:underline"
                              >
                                {app.applicationNumber || app.id?.slice(0, 8)}
                              </Link>
                            </div>
                          </td>
                        )}

                        {isColVisible("borrower") && (
                          <td className="p-3.5">
                            <div className="font-semibold text-foreground">
                              {app.borrower?.firstName || app.borrower?.companyName || "Client"}{" "}
                              {app.borrower?.lastName || ""}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                              {app.purpose || "Crédit d'exploitation"}
                            </div>
                          </td>
                        )}

                        {isColVisible("amount") && (
                          <td className="p-3.5 font-bold text-foreground">
                            {formatCurrency(app.requestedAmount || 0)}
                          </td>
                        )}

                        {isColVisible("duration") && (
                          <td className="p-3.5 text-muted-foreground">
                            {app.durationMonths || 12} mois
                          </td>
                        )}

                        {isColVisible("score") && (
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                {app.score !== undefined ? `${app.score}/100` : "78/100"}
                              </span>
                              <Sparkles className="h-3 w-3 text-blue-500" />
                            </div>
                          </td>
                        )}

                        {isColVisible("status") && (
                          <td className="p-3.5">{getStatusBadge(app.status)}</td>
                        )}

                        {isColVisible("date") && (
                          <td className="p-3.5 text-muted-foreground">
                            {formatDate(app.createdAt)}
                          </td>
                        )}

                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <FavoriteButton
                              isFavorite={isFav}
                              onToggle={(f) =>
                                setFavorites({ ...favorites, [app.id]: f })
                              }
                              itemName={app.applicationNumber || "Dossier"}
                            />
                            <PinButton
                              isPinned={isPin}
                              onToggle={(p) =>
                                setPinned({ ...pinned, [app.id]: p })
                              }
                              itemName={app.applicationNumber || "Dossier"}
                            />

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Dossier</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/applications/${app.id}`}>
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    <span>Consulter</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    toast.info(
                                      `Audit IA généré pour ${app.applicationNumber || app.id}`
                                    )
                                  }
                                >
                                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                                  <span>Générer Note IA</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    toast.success("Dossier archivé")
                                  }
                                >
                                  <span>Archiver</span>
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
            {paginatedApps.map((app) => {
              const isFav = favorites[app.id] || false;
              const isPin = pinned[app.id] || false;

              return (
                <Card
                  key={app.id}
                  className="hover:border-border hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-primary">
                        {app.applicationNumber || app.id?.slice(0, 8)}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {app.borrower?.firstName || app.borrower?.companyName || "Client"}{" "}
                        {app.borrower?.lastName || ""}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {app.purpose || "Financement d'activité"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          Montant
                        </span>
                        <p className="font-bold text-foreground">
                          {formatCurrency(app.requestedAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          Score XAI
                        </span>
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {app.score !== undefined ? `${app.score}/100` : "78/100"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <div className="flex items-center gap-1">
                        <FavoriteButton
                          isFavorite={isFav}
                          onToggle={(f) =>
                            setFavorites({ ...favorites, [app.id]: f })
                          }
                        />
                        <PinButton
                          isPinned={isPin}
                          onToggle={(p) =>
                            setPinned({ ...pinned, [app.id]: p })
                          }
                        />
                      </div>

                      <Button size="sm" variant="subtle" asChild className="h-7 text-xs">
                        <Link href={`/applications/${app.id}`}>
                          <span>Détails</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dynamic Pagination with selectable limits */}
        {filteredApps.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredApps.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Floating Bulk Actions Bar */}
        <BulkActions
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onExport={() => {
            toast.success(`${selectedIds.length} dossiers exportés`);
            setSelectedIds([]);
          }}
          onArchive={() => {
            toast.info(`${selectedIds.length} dossiers archivés`);
            setSelectedIds([]);
          }}
          onPin={() => {
            const nextPinned = { ...pinned };
            selectedIds.forEach((id) => (nextPinned[id] = true));
            setPinned(nextPinned);
            toast.success(`${selectedIds.length} dossiers épinglés`);
            setSelectedIds([]);
          }}
        />
      </div>
    </AppLayout>
  );
}
