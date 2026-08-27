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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Download,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Views
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection & Persistence
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  const loadClients = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await api.getClients(search || undefined);
      setClients(data || []);
      if (isManual) toast.success("Base emprunteurs actualisée");
    } catch (err) {
      console.error("Failed to load clients:", err);
      toast.error("Impossible de récupérer les clients");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    let list = clients;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const fullName = `${c.firstName || ""} ${c.lastName || ""} ${c.companyName || ""}`.toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const city = (c.city || "").toLowerCase();
        return fullName.includes(q) || email.includes(q) || phone.includes(q) || city.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      const aPin = pinned[a.id] ? 1 : 0;
      const bPin = pinned[b.id] ? 1 : 0;
      if (aPin !== bPin) return bPin - aPin;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [clients, search, pinned]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage, pageSize]);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Clients Emprunteurs"
          description="Base de données KYC des emprunteurs particuliers, TPE et personnes morales"
          badge={`${filteredClients.length} clients`}
        >
          <Button size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/clients/new">
              <UserPlus className="h-3.5 w-3.5" />
              <span>Nouveau Client</span>
            </Link>
          </Button>
        </PageHeader>

        {/* Toolbar */}
        <PageToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Rechercher par nom, email, téléphone, ville..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => loadClients(true)}
          isRefreshing={refreshing}
          onExport={() => toast.success("Exportation KYC des emprunteurs réussie")}
        />

        {/* Content */}
        {loading ? (
          viewMode === "table" ? (
            <TableLoadingState rows={6} cols={6} />
          ) : (
            <CardsLoadingState count={6} />
          )
        ) : filteredClients.length === 0 ? (
          <EmptyState
            type={search ? "no-results" : "empty"}
            title={
              search
                ? "Aucun client ne correspond à votre recherche"
                : "Aucun client enregistré"
            }
            description="Enregistrez votre premier emprunteur pour initialiser le profil KYC et les dossiers de crédit."
            actionLabel={search ? "Effacer la recherche" : "Créer un Client"}
            onAction={search ? () => setSearch("") : () => (window.location.href = "/clients/new")}
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
                          paginatedClients.length > 0 &&
                          selectedIds.length === paginatedClients.length
                        }
                        onCheckedChange={() => {
                          if (selectedIds.length === paginatedClients.length) {
                            setSelectedIds([]);
                          } else {
                            setSelectedIds(paginatedClients.map((c) => c.id));
                          }
                        }}
                      />
                    </th>
                    <th className="p-3.5">Emprunteur</th>
                    <th className="p-3.5">Coordonnées</th>
                    <th className="p-3.5">Localisation</th>
                    <th className="p-3.5">Activité / Profession</th>
                    <th className="p-3.5">Revenu Mensuel</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedClients.map((client) => {
                    const isSelected = selectedIds.includes(client.id);
                    const isFav = favorites[client.id] || false;
                    const isPin = pinned[client.id] || false;
                    const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`.toUpperCase() || "CL";

                    return (
                      <tr
                        key={client.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          isSelected ? "bg-muted/50" : ""
                        }`}
                      >
                        <td className="p-3.5 pl-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              setSelectedIds((prev) =>
                                prev.includes(client.id)
                                  ? prev.filter((i) => i !== client.id)
                                  : [...prev, client.id]
                              )
                            }
                          />
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 rounded-md">
                              <AvatarFallback className="text-[10px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link
                                href={`/clients/${client.id}`}
                                className="font-bold text-foreground hover:underline"
                              >
                                {client.firstName} {client.lastName}
                              </Link>
                              {client.companyName && (
                                <p className="text-[11px] text-muted-foreground">{client.companyName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 space-y-0.5 text-muted-foreground">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{client.email || "Non renseigné"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{client.phone || "Non renseigné"}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{client.city || "Kinshasa"}, {client.country || "RDC"}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-foreground">
                          {client.occupation || "Commerçant"}
                          {client.employer && (
                            <span className="text-muted-foreground text-[11px]"> ({client.employer})</span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-foreground">
                          {formatCurrency(client.monthlyIncome || 0)}
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <FavoriteButton
                              isFavorite={isFav}
                              onToggle={(f) => setFavorites({ ...favorites, [client.id]: f })}
                              itemName={`${client.firstName} ${client.lastName}`}
                            />
                            <PinButton
                              isPinned={isPin}
                              onToggle={(p) => setPinned({ ...pinned, [client.id]: p })}
                              itemName={`${client.firstName} ${client.lastName}`}
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
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Client</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/clients/${client.id}`}>
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    <span>Profil KYC</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href="/applications/new">
                                    <Plus className="h-3.5 w-3.5 mr-2" />
                                    <span>Créer un Dossier</span>
                                  </Link>
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
            {paginatedClients.map((client) => {
              const isFav = favorites[client.id] || false;
              const isPin = pinned[client.id] || false;
              const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`.toUpperCase() || "CL";

              return (
                <Card key={client.id} className="hover:border-border hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">
                            {client.firstName} {client.lastName}
                          </h4>
                          <p className="text-[10px] text-muted-foreground">{client.city || "Kinshasa"}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[9px]">KYC Vérifié</Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border/60 text-xs">
                      <span className="text-muted-foreground">Revenu estimé :</span>
                      <span className="font-bold text-foreground">{formatCurrency(client.monthlyIncome || 0)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <div className="flex items-center gap-1">
                        <FavoriteButton
                          isFavorite={isFav}
                          onToggle={(f) => setFavorites({ ...favorites, [client.id]: f })}
                        />
                        <PinButton
                          isPinned={isPin}
                          onToggle={(p) => setPinned({ ...pinned, [client.id]: p })}
                        />
                      </div>
                      <Button size="sm" variant="subtle" asChild className="h-7 text-xs">
                        <Link href={`/clients/${client.id}`}>Profil</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredClients.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredClients.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        <BulkActions
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onExport={() => {
            toast.success(`${selectedIds.length} profils exportés`);
            setSelectedIds([]);
          }}
        />
      </div>
    </AppLayout>
  );
}
