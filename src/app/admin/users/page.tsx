"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
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
  Users,
  Shield,
  UserPlus,
  Sliders,
  MoreHorizontal,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Ban,
  Check,
  RefreshCw,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Views
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+243");
  const [roleId, setRoleId] = useState("");
  const [submittingUser, setSubmittingUser] = useState(false);

  // Override Editor State
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<any>(null);
  const [overrideMap, setOverrideMap] = useState<Record<string, "INHERIT" | "ALLOW" | "DENY">>({});
  const [savingOverrides, setSavingOverrides] = useState(false);

  const loadData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const [usersData, rolesData, permsData] = await Promise.all([
        api.getUsers().catch(() => []),
        api.getRoles().catch(() => []),
        api.getPermissions().catch(() => []),
      ]);

      setUsers(usersData || []);
      setRoles(rolesData || []);
      setAllPermissions(permsData || []);
      if (rolesData && rolesData.length > 0) setRoleId(rolesData[0].id);

      if (isManual) toast.success("Utilisateurs et permissions actualisés");
    } catch (err) {
      console.error("Failed to load user management data:", err);
      toast.error("Erreur de chargement des données HRBAC");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openOverrideEditor = (user: any) => {
    setSelectedUserForOverride(user);
    const map: Record<string, "INHERIT" | "ALLOW" | "DENY"> = {};

    for (const p of allPermissions) {
      const userOverride = user.overrides?.find((o: any) => o.permissionId === p.id);
      if (userOverride) {
        map[p.id] = userOverride.type;
      } else {
        map[p.id] = "INHERIT";
      }
    }
    setOverrideMap(map);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !roleId) {
      toast.error("Veuillez renseigner le nom, l'email et le rôle.");
      return;
    }

    try {
      setSubmittingUser(true);
      await api.createUser({
        name,
        email,
        phone,
        roleId,
      });

      toast.success("Utilisateur créé avec succès ! Il recevra son code OTP.");
      setShowCreateModal(false);
      setName("");
      setEmail("");
      setPhone("+243");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création de l'utilisateur");
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleSaveOverrides = async () => {
    if (!selectedUserForOverride) return;

    try {
      setSavingOverrides(true);
      const overridesArray = Object.entries(overrideMap)
        .filter(([_, type]) => type !== "INHERIT")
        .map(([permissionId, type]) => ({
          permissionId,
          type: type as "ALLOW" | "DENY",
        }));

      await api.updateUserOverrides(selectedUserForOverride.id, overridesArray);
      toast.success("Overrides individuels HRBAC appliqués avec succès !");
      setSelectedUserForOverride(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement des overrides");
    } finally {
      setSavingOverrides(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const role = (u.role?.name || "").toLowerCase();
        return name.includes(q) || email.includes(q) || role.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      const aPin = pinned[a.id] ? 1 : 0;
      const bPin = pinned[b.id] ? 1 : 0;
      if (aPin !== bPin) return bPin - aPin;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [users, search, pinned]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Gestion des Utilisateurs & HRBAC"
          description="Contrôle des accès d'entreprise, affectation des rôles et gestion des overrides individuels de permissions"
          badge={`${filteredUsers.length} comptes`}
        >
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-1.5 text-xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Créer un Utilisateur</span>
          </Button>
        </PageHeader>

        {/* Toolbar */}
        <PageToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Rechercher par nom, email, rôle..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => loadData(true)}
          isRefreshing={refreshing}
        />

        {/* Content */}
        {loading ? (
          viewMode === "table" ? (
            <TableLoadingState rows={6} cols={6} />
          ) : (
            <CardsLoadingState count={6} />
          )
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="Aucun utilisateur trouvé"
            description="Créez votre premier compte utilisateur d'entreprise pour autoriser les accès."
            actionLabel="Créer un utilisateur"
            onAction={() => setShowCreateModal(true)}
            icon={Users}
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
                          paginatedUsers.length > 0 &&
                          selectedIds.length === paginatedUsers.length
                        }
                        onCheckedChange={() => {
                          if (selectedIds.length === paginatedUsers.length) {
                            setSelectedIds([]);
                          } else {
                            setSelectedIds(paginatedUsers.map((u) => u.id));
                          }
                        }}
                      />
                    </th>
                    <th className="p-3.5">Utilisateur</th>
                    <th className="p-3.5">Coordonnées (OTP)</th>
                    <th className="p-3.5">Rôle Principal</th>
                    <th className="p-3.5">Overrides HRBAC</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedUsers.map((user) => {
                    const isSelected = selectedIds.includes(user.id);
                    const isFav = favorites[user.id] || false;
                    const isPin = pinned[user.id] || false;
                    const initials = (user.name || "UN")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    const allowCount = user.overrides?.filter((o: any) => o.type === "ALLOW").length || 0;
                    const denyCount = user.overrides?.filter((o: any) => o.type === "DENY").length || 0;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          isSelected ? "bg-muted/50" : ""
                        }`}
                      >
                        <td className="p-3.5 pl-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              setSelectedIds((prev) =>
                                prev.includes(user.id)
                                  ? prev.filter((i) => i !== user.id)
                                  : [...prev, user.id]
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
                            <span className="font-bold text-foreground">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 space-y-0.5 text-muted-foreground font-mono text-[11px]">
                          <div>{user.email}</div>
                          <div>{user.phone || "N/A"}</div>
                        </td>
                        <td className="p-3.5">
                          <Badge variant="default" className="text-[10px]">
                            {user.role?.name || "Employé"}
                          </Badge>
                        </td>
                        <td className="p-3.5">
                          {allowCount === 0 && denyCount === 0 ? (
                            <span className="text-muted-foreground text-[11px]">Hérite du Rôle</span>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold">
                              {allowCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  +{allowCount} Allow
                                </span>
                              )}
                              {denyCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                                  -{denyCount} Deny
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <Badge variant={user.isActive ? "success" : "secondary"} className="text-[9px]">
                            {user.isActive ? "Actif" : "Désactivé"}
                          </Badge>
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="subtle"
                              onClick={() => openOverrideEditor(user)}
                              className="h-7 text-xs gap-1"
                            >
                              <Sliders className="h-3 w-3" />
                              <span>Overrides</span>
                            </Button>
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
            {paginatedUsers.map((user) => (
              <Card key={user.id} className="hover:border-border hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">{user.role?.name || "Employé"}</Badge>
                    <Badge variant={user.isActive ? "success" : "secondary"}>
                      {user.isActive ? "Actif" : "Désactivé"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground">{user.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{user.email}</p>
                    <p className="text-xs text-muted-foreground font-mono">{user.phone}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => openOverrideEditor(user)}
                      className="w-full text-xs gap-1.5"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Éditer les Overrides HRBAC</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* Create User Dialog */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Créer un Compte Utilisateur</DialogTitle>
                <DialogDescription className="text-xs">
                  Création sécurisée réservée à l'administrateur. L'utilisateur se connectera via OTP.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Nom Complet *</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Marie Kabeya"
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Adresse Email Pro *</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@creditguard.com"
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Téléphone Mobile (OTP)</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Rôle Principal *</label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id} className="text-xs">
                          {r.name} {r.isSuperAdmin ? "(Accès Total)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm" disabled={submittingUser}>
                  {submittingUser ? "Création..." : "Créer l'Utilisateur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* HRBAC Override Editor Dialog */}
        <Dialog open={!!selectedUserForOverride} onOpenChange={(open) => !open && setSelectedUserForOverride(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <Sliders className="h-4 w-4 text-primary" />
                <span>Éditeur d'Overrides HRBAC : {selectedUserForOverride?.name}</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Rôle principal : <strong className="text-foreground">{selectedUserForOverride?.role?.name}</strong>. 
                Priorité : User Deny &gt; User Allow &gt; Rôle &gt; Default Deny.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              <div className="space-y-2">
                {allPermissions.map((perm) => {
                  const state = overrideMap[perm.id] || "INHERIT";

                  return (
                    <div
                      key={perm.id}
                      className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-foreground">{perm.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{perm.slug}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{perm.description}</p>
                      </div>

                      <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40 shrink-0">
                        <button
                          type="button"
                          onClick={() => setOverrideMap({ ...overrideMap, [perm.id]: "INHERIT" })}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            state === "INHERIT"
                              ? "bg-background text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Hérité
                        </button>
                        <button
                          type="button"
                          onClick={() => setOverrideMap({ ...overrideMap, [perm.id]: "ALLOW" })}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            state === "ALLOW"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Allow (+)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOverrideMap({ ...overrideMap, [perm.id]: "DENY" })}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            state === "DENY"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Deny (-)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedUserForOverride(null)}>
                Annuler
              </Button>
              <Button type="button" size="sm" onClick={handleSaveOverrides} disabled={savingOverrides}>
                {savingOverrides ? "Enregistrement..." : "Appliquer les Overrides"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
