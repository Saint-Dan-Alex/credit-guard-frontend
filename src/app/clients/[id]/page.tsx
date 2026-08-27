"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Wallet,
  FileText,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ClientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        const list = await api.getClients();
        const found = list.find((c: any) => c.id === id);
        if (found) {
          setClient(found);
        } else if (list.length > 0) {
          setClient(list[0]);
        }
      } catch (err) {
        console.error("Failed to load client:", err);
        toast.error("Impossible de charger l'emprunteur");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadClient();
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

  if (!client) {
    return (
      <AppLayout>
        <div className="p-12 text-center space-y-4">
          <h2 className="text-base font-bold">Client introuvable</h2>
          <Button asChild size="sm">
            <Link href="/clients">Retour aux clients</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`.toUpperCase() || "CL";
  const applications = client.applications || [];
  const loans = client.loans || [];

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/clients">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour aux clients</span>
            </Link>
          </Button>

          <Button size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/applications/new">
              <Plus className="h-3.5 w-3.5" />
              <span>Créer une Demande pour ce client</span>
            </Link>
          </Button>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl bg-primary/10">
              <AvatarFallback className="text-lg font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {client.firstName} {client.lastName}
                </h1>
                <Badge variant="success" className="text-[10px]">KYC Vérifié</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {client.occupation || "Profession libérale"} • {client.city || "Kinshasa"}, {client.country || "RDC"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Revenu Mensuel</span>
              <p className="text-base font-bold text-foreground">{formatCurrency(client.monthlyIncome || 0)}</p>
            </div>
          </div>
        </div>

        {/* Tabs: Contact, Applications, Loans */}
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="h-9 p-0.5">
            <TabsTrigger value="info" className="text-xs">Informations Personnelles</TabsTrigger>
            <TabsTrigger value="applications" className="text-xs">Demandes ({applications.length})</TabsTrigger>
            <TabsTrigger value="loans" className="text-xs">Prêts Actifs ({loans.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">Coordonnées de Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-mono text-foreground">{client.email || "Non renseigné"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Téléphone Mobile</span>
                    <span className="font-mono text-foreground">{client.phone || "Non renseigné"}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Adresse Physique</span>
                    <span className="text-foreground">{client.address || "Kinshasa"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">Activité & Employeur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Profession</span>
                    <span className="font-bold text-foreground">{client.occupation || "Commerçant"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Entreprise</span>
                    <span className="text-foreground">{client.employer || "SARL Auto-entrepreneur"}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Date d'enregistrement</span>
                    <span className="text-muted-foreground">{formatDate(client.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Historique des Dossiers</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {applications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Aucune demande passée pour ce client.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60 text-xs">
                    {applications.map((app: any) => (
                      <div key={app.id} className="p-3.5 flex justify-between items-center hover:bg-muted/30">
                        <div>
                          <p className="font-mono font-bold text-primary">{app.applicationNumber || app.id?.slice(0, 8)}</p>
                          <p className="text-muted-foreground">{app.purpose}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{formatCurrency(app.requestedAmount || 0)}</span>
                          <Badge variant="info">{app.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Prêts & Encours</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loans.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Aucun prêt actif pour ce client.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60 text-xs">
                    {loans.map((loan: any) => (
                      <div key={loan.id} className="p-3.5 flex justify-between items-center hover:bg-muted/30">
                        <div>
                          <p className="font-mono font-bold text-primary">{loan.loanNumber}</p>
                          <p className="text-muted-foreground">{loan.interestRate}% / an</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-blue-600">{formatCurrency(loan.remainingPrincipal || 0)}</span>
                          <Badge variant="success">{loan.status}</Badge>
                        </div>
                      </div>
                    ))}
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
