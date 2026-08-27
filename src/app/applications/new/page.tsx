"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calculator, ShieldCheck, Sparkles, Check, Save } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function NewApplicationPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("10000");
  const [duration, setDuration] = useState("12");
  const [purpose, setPurpose] = useState("Achat de stock et fonds de roulement");
  const [collateralType, setCollateralType] = useState("REAL_ESTATE");
  const [collateralValue, setCollateralValue] = useState("15000");
  const [collateralDesc, setCollateralDesc] = useState("Titre foncier parcelle Gombe");

  // Simulation
  const [simulation, setSimulation] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cData, pData] = await Promise.all([
          api.getClients(),
          api.getProducts(true),
        ]);
        setClients(cData || []);
        setProducts(pData || []);
        if (cData && cData.length > 0) setClientId(cData[0].id);
        if (pData && pData.length > 0) setProductId(pData[0].id);
      } catch (err) {
        console.error("Failed to load aux data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const selectedProd = products.find((p) => p.id === productId);
    const rate = selectedProd ? selectedProd.interestRate : 12.0;
    const numAmount = parseFloat(amount) || 0;
    const numDuration = parseInt(duration) || 12;

    if (numAmount > 0 && numDuration > 0) {
      api
        .simulateLoan({
          amount: numAmount,
          duration: numDuration,
          interestRate: rate,
        })
        .then(setSimulation)
        .catch(() => setSimulation(null));
    }
  }, [amount, duration, productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast.error("Veuillez sélectionner un emprunteur.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createApplication({
        clientId,
        productId: productId || undefined,
        amount: parseFloat(amount),
        duration: parseInt(duration),
        purpose,
        collaterals:
          collateralValue && parseFloat(collateralValue) > 0
            ? [
                {
                  type: collateralType,
                  description: collateralDesc,
                  value: parseFloat(collateralValue),
                },
              ]
            : undefined,
      });

      toast.success("Demande de financement créée avec succès !");
      router.push(`/applications/${res.id || ""}`);
    } catch (err: any) {
      console.error("Create application error:", err);
      toast.error(err.response?.data?.message || "Échec de création du dossier");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/applications">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour aux demandes</span>
            </Link>
          </Button>
        </div>

        <PageHeader
          title="Nouvelle Demande de Financement"
          description="Création d'un dossier de prêt, paramétrage financier et simulation de l'échéancier"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Emprunteur & Produit */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">
                1. Emprunteur & Produit Financier
              </CardTitle>
              <CardDescription className="text-xs">
                Sélectionnez le client demandeur et le type de ligne de crédit
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Client Emprunteur *
                </label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.firstName} {c.lastName} {c.companyName ? `(${c.companyName})` : ""} - {c.phone || c.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Produit de Crédit
                </label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Produit par défaut (Standard)" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name} ({p.interestRate}% / an - {p.repaymentMethod})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Termes Financiers & Simulation */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">
                2. Conditions Financières & Simulation
              </CardTitle>
              <CardDescription className="text-xs">
                Définissez le montant, la durée et l'objet du financement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Montant Demandé (USD) *
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    step="100"
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Durée (Mois) *
                  </label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="120"
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Motif / Objet du Prêt
                  </label>
                  <Input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Ex: Achat équipement, Stock"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Live Amortization simulation preview */}
              {simulation && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <Calculator className="h-4 w-4" />
                    <span>Aperçu de l'Échéancier Prévisionnel</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Mensualité Estimée
                      </span>
                      <p className="text-base font-bold text-foreground">
                        {formatCurrency(simulation.monthlyPayment || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Total Intérêts
                      </span>
                      <p className="text-base font-bold text-foreground">
                        {formatCurrency(simulation.totalInterest || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Coût Global
                      </span>
                      <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(simulation.totalCost || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Taux Annuel
                      </span>
                      <p className="text-base font-bold text-foreground">
                        {simulation.interestRate || 12}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Garanties & Sûretés */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">
                3. Garanties & Sûretés Réelles
              </CardTitle>
              <CardDescription className="text-xs">
                Garanties fournies par l'emprunteur pour couvrir le risque de défaut
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Type de Garantie
                </label>
                <Select value={collateralType} onValueChange={setCollateralType}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REAL_ESTATE">Bien Immobilier / Titre Foncier</SelectItem>
                    <SelectItem value="VEHICLE">Véhicule Automobile</SelectItem>
                    <SelectItem value="EQUIPMENT">Matériel & Équipement</SelectItem>
                    <SelectItem value="GUARANTOR">Caution Personnelle Solidaire</SelectItem>
                    <SelectItem value="DEPOSIT">Dépôt de Garantie / Gage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Valeur Estimée (USD)
                </label>
                <Input
                  type="number"
                  value={collateralValue}
                  onChange={(e) => setCollateralValue(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description de la Sûreté
                </label>
                <Input
                  type="text"
                  value={collateralDesc}
                  onChange={(e) => setCollateralDesc(e.target.value)}
                  placeholder="Ex: Titre foncier vol. 120"
                  className="h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              asChild
              className="text-xs"
            >
              <Link href="/applications">Annuler</Link>
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{submitting ? "Enregistrement en cours..." : "Enregistrer et Calculer le Score"}</span>
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
