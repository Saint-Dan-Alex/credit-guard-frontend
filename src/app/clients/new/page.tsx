"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, UserCheck, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function NewClientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+243");
  const [city, setCity] = useState("Kinshasa");
  const [country, setCountry] = useState("RDC");
  const [monthlyIncome, setMonthlyIncome] = useState("2500");
  const [occupation, setOccupation] = useState("Commerçant");
  const [employer, setEmployer] = useState("SARL Commerce & Co");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      toast.error("Veuillez renseigner le nom, prénom et numéro de téléphone.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createClient({
        firstName,
        lastName,
        email,
        phone,
        city,
        country,
        monthlyIncome: parseFloat(monthlyIncome) || 0,
        occupation,
        employer,
      });

      toast.success("Client emprunteur enregistré avec succès !");
      router.push(`/clients/${res.id || ""}`);
    } catch (err: any) {
      console.error("Create client error:", err);
      toast.error(err.message || "Échec de l'enregistrement de l'emprunteur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
          <Link href="/clients">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux clients</span>
          </Link>
        </Button>

        <PageHeader
          title="Nouveau Client Emprunteur"
          description="Création d'un dossier KYC et enregistrement des coordonnées de l'emprunteur"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identité Personnelle */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">1. État Civil & Identité</CardTitle>
              <CardDescription className="text-xs">
                Informations signalétiques de la personne physique ou du dirigeant
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Prénom *</label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: Dani"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nom / Post-nom *</label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ex: Kabuya"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Adresse Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: contact@client.com"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Téléphone Mobile (OTP) *</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243..."
                  required
                  className="h-9 text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* Situation Professionnelle & Financière */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">2. Situation Professionnelle & Revenus</CardTitle>
              <CardDescription className="text-xs">
                Capacité financière et domiciliation géographique
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Profession / Activité</label>
                <Input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Ex: Directeur Général, Pharmacien"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Employeur / Entreprise</label>
                <Input
                  type="text"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  placeholder="Ex: Auto-entrepreneur, SARL"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Revenu Mensuel Moyen (USD)</label>
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Ville de Résidence</label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" asChild className="text-xs">
              <Link href="/clients">Annuler</Link>
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2 text-xs">
              <Save className="h-3.5 w-3.5" />
              <span>{submitting ? "Création en cours..." : "Enregistrer le Profil Client"}</span>
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
