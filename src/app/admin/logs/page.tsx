"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageToolbar } from "@/components/shared/PageToolbar";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Shield,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Code,
  Download,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadLogs = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await api.getAuditLogs();
      setLogs(data || []);
      if (isManual) toast.success("Journaux d'audit synchronisés");
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      toast.error("Impossible de récupérer les journaux d'audit");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    let list = logs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) => {
        const action = (l.action || "").toLowerCase();
        const entity = (l.entity || "").toLowerCase();
        const user = (l.user?.name || l.user?.email || "").toLowerCase();
        return action.includes(q) || entity.includes(q) || user.includes(q);
      });
    }
    return list;
  }, [logs, search]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Journaux d'Audit & Sécurité"
          description="Traçabilité immuable des décisions de crédit, des décaissements, des authentifications et modifications de paramètres"
          badge="Audit Trail Immuable"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadLogs(true)}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Actualiser</span>
          </Button>

          <Button
            size="sm"
            onClick={() => toast.success("Exportation de la piste d'audit certifiée CSV")}
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exporter l'Audit</span>
          </Button>
        </PageHeader>

        <PageToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Filtrer par action, entité, utilisateur..."
        />

        {loading ? (
          <TableLoadingState rows={8} cols={5} />
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            type={search ? "no-results" : "empty"}
            title="Aucun journal d'audit enregistré"
            description="Toutes les opérations sensibles apparaîtront ici automatiquement avec leur horodatage exact."
            icon={History}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                    <th className="p-3.5 pl-4">Opération / Action</th>
                    <th className="p-3.5">Entité Cible</th>
                    <th className="p-3.5">Auteur / Agent</th>
                    <th className="p-3.5">Horodatage</th>
                    <th className="p-3.5 pr-4 text-right">Détails (Diff JSON)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 pl-4">
                        <Badge variant="default" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-bold text-foreground">
                        {log.entity} {log.entityId ? <span className="font-mono text-[10px] text-muted-foreground font-normal">({log.entityId?.slice(0, 8)})</span> : ""}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {log.user?.name || log.user?.email || "Système Automatique"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                        {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-3.5 pr-4 text-right">
                        {log.changes ? (
                          <span className="font-mono text-[10px] bg-muted px-2 py-1 rounded text-muted-foreground inline-block max-w-[220px] truncate">
                            {typeof log.changes === "object" ? JSON.stringify(log.changes) : log.changes}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[10px] italic">Aucun diff</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
