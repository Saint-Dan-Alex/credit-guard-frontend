"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageToolbar } from "@/components/shared/PageToolbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Layers,
  Check,
  X,
  RefreshCw,
  Search,
  Lock,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function RolesMatrixPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const loadData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const [rolesData, permsData] = await Promise.all([
        api.getRoles().catch(() => []),
        api.getPermissions().catch(() => []),
      ]);
      setRoles(rolesData || []);
      setPermissions(permsData || []);
      if (isManual) toast.success("Matrice des rôles actualisée");
    } catch (err) {
      console.error("Failed to load matrix data:", err);
      toast.error("Impossible de charger la matrice des permissions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = [
    "ALL",
    "application",
    "loan",
    "client",
    "recovery",
    "report",
    "user",
    "product",
    "stock",
  ];

  const filteredPermissions = permissions.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === "ALL" ||
      p.name.toLowerCase().startsWith(selectedCategory) ||
      (p.slug && p.slug.toLowerCase().startsWith(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Matrice des Rôles & Permissions HRBAC"
          description="Cartographie exhaustive des droits CRUD et fonctions métiers additives (RPBAC+) attribués à chaque rôle"
          badge="Modèle 4 Niveaux"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Actualiser</span>
          </Button>
        </PageHeader>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat === "ALL" ? "Toutes les permissions" : `Module : ${cat}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <PageToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Rechercher une permission par nom ou code slug..."
        />

        {/* Matrix Table */}
        {loading ? (
          <TableLoadingState rows={8} cols={roles.length + 2} />
        ) : filteredPermissions.length === 0 ? (
          <EmptyState
            type="no-results"
            title="Aucune permission trouvée"
            description="Aucune permission ne correspond au filtre sélectionné."
            actionLabel="Réinitialiser le filtre"
            onAction={() => {
              setSelectedCategory("ALL");
              setSearch("");
            }}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                    <th className="p-3.5 pl-4 min-w-[220px]">Permission Métier</th>
                    <th className="p-3.5 min-w-[140px]">Code Slug</th>
                    {roles.map((r) => (
                      <th key={r.id} className="p-3.5 text-center min-w-[110px]">
                        <span className="font-bold text-foreground">{r.name}</span>
                        {r.isSuperAdmin && (
                          <span className="block text-[9px] text-blue-600 font-semibold">(Super Admin)</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPermissions.map((perm) => (
                    <tr key={perm.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 pl-4">
                        <p className="font-bold text-foreground">{perm.name}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{perm.description}</p>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                        {perm.slug || perm.name}
                      </td>
                      {roles.map((role) => {
                        const hasPerm =
                          role.isSuperAdmin ||
                          role.rolePermissions?.some(
                            (rp: any) =>
                              rp.permissionId === perm.id ||
                              rp.permission?.id === perm.id
                          );

                        return (
                          <td key={role.id} className="p-3.5 text-center">
                            {hasPerm ? (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                                <X className="h-3 w-3" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
