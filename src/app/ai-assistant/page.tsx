"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Bot,
  Send,
  FileText,
  Scan,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Download,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState<"copilot" | "memo" | "ocr">("copilot");

  // Chat Copilot State
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; actions?: string[] }>
  >([
    {
      sender: "ai",
      text: "Bonjour ! Je suis CreditGuard AI Copilot. Je peux analyser vos dossiers de prêt, évaluer le risque de crédit en direct, auditer la conformité des garanties et détecter la fraude documentaire.",
      actions: [
        "Explique le modèle de scoring",
        "Règles prudentielles IFRS 9",
        "Stratégie de restructuration",
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Credit Memo State
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [memoData, setMemoData] = useState<any>(null);
  const [loadingMemo, setLoadingMemo] = useState(false);

  // OCR State
  const [ocrDocType, setOcrDocType] = useState("IDENTITY");
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [loadingOcr, setLoadingOcr] = useState(false);

  useEffect(() => {
    api
      .getApplications()
      .then((res) => {
        setApplications(res || []);
        if (res && res.length > 0) setSelectedAppId(res[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: "user" as const, text }];
    setMessages(newMsgs);
    if (!textToSend) setInputText("");
    setIsSending(true);

    try {
      const res = await api.chatWithAiCopilot(text);
      setMessages([
        ...newMsgs,
        {
          sender: "ai",
          text: res.reply,
          actions: res.suggestedActions,
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMsgs,
        {
          sender: "ai",
          text: "Désolé, une erreur est survenue lors de l'analyse avec l'agent Copilot.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateMemo = async () => {
    if (!selectedAppId) return;
    try {
      setLoadingMemo(true);
      const res = await api.getCreditMemo(selectedAppId);
      setMemoData(res);
      toast.success("Note de crédit IA générée avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la génération du mémo");
    } finally {
      setLoadingMemo(false);
    }
  };

  const handleRunOcr = async () => {
    try {
      setLoadingOcr(true);
      const res = await api.runDocumentOCR({
        documentType: ocrDocType,
      });
      setOcrResult(res);
      toast.success("Document analysé avec succès par le moteur OCR !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'analyse OCR");
    } finally {
      setLoadingOcr(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        <PageHeader
          title="Intelligence Artificielle & Hub OCR"
          description="Copilot conversationnel de décision de crédit, notes de synthèse automatisées et détection de fraude"
          badge="Modèle XAI"
        />

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="space-y-6"
        >
          <TabsList className="h-10 p-1 bg-muted/60">
            <TabsTrigger value="copilot" className="text-xs gap-2">
              <Bot className="h-3.5 w-3.5" />
              <span>Credit Copilot</span>
            </TabsTrigger>
            <TabsTrigger value="memo" className="text-xs gap-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Générateur de Note de Crédit</span>
            </TabsTrigger>
            <TabsTrigger value="ocr" className="text-xs gap-2">
              <Scan className="h-3.5 w-3.5" />
              <span>Audit OCR & Anti-Fraude</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: COPILOT CHAT */}
          <TabsContent value="copilot">
            <Card className="h-[600px] flex flex-col shadow-md">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">
                        Assistant d'Analyse Financière
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Interrogez l'IA sur le scoring, la viabilité d'un emprunteur ou les ratios Bâle III
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Modèle Connecté
                  </Badge>
                </div>
              </CardHeader>

              {/* Chat messages */}
              <ScrollArea className="flex-1 p-4 space-y-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 text-xs ${
                        m.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {m.sender === "ai" && (
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div className="max-w-[80%] space-y-2">
                        <div
                          className={`p-3.5 rounded-2xl ${
                            m.sender === "user"
                              ? "bg-primary text-primary-foreground font-medium rounded-br-none"
                              : "bg-muted/60 text-foreground border border-border/80 rounded-bl-none leading-relaxed"
                          }`}
                        >
                          {m.text}
                        </div>

                        {/* Suggested actions chips */}
                        {m.actions && m.actions.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {m.actions.map((act, i) => (
                              <button
                                key={i}
                                onClick={() => handleSendMessage(act)}
                                className="px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {act}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="flex gap-3 text-xs">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="p-3 rounded-2xl bg-muted/60 border border-border/80 text-muted-foreground animate-pulse">
                        Génération de l'analyse en cours...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input prompt footer */}
              <div className="p-3 border-t border-border bg-muted/20">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 max-w-3xl mx-auto"
                >
                  <Input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Posez une question à l'IA de crédit..."
                    className="h-10 text-xs"
                  />
                  <Button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="h-10 px-4 gap-1.5 text-xs shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Envoyer</span>
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: CREDIT MEMO GENERATOR */}
          <TabsContent value="memo" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold">
                  Génération Automatisée de Note de Crédit
                </CardTitle>
                <CardDescription className="text-xs">
                  Synthèse complète avec DTI, couverture de garantie et décision motivée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Sélectionner un dossier" />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.map((app) => (
                          <SelectItem key={app.id} value={app.id} className="text-xs">
                            {app.applicationNumber || app.id?.slice(0, 8)} - {app.borrower?.firstName} {app.borrower?.lastName} ({formatCurrency(app.requestedAmount || 0)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerateMemo}
                    disabled={loadingMemo || !selectedAppId}
                    className="gap-2 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{loadingMemo ? "Analyse en cours..." : "Générer la Note IA"}</span>
                  </Button>
                </div>

                {memoData && (
                  <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-300">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {memoData.applicationSummary?.applicantName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Montant : {formatCurrency(memoData.applicationSummary?.requestedAmount || 0)} • {memoData.applicationSummary?.durationMonths} mois
                        </p>
                      </div>
                      <Badge
                        variant={memoData.aiRecommendation?.decision === "APPROVE" ? "success" : "destructive"}
                        className="text-xs px-2.5 py-1"
                      >
                        Recommandation : {memoData.aiRecommendation?.decision === "APPROVE" ? "Approbation" : "Rejet"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Ratio DTI</span>
                        <p className="text-xl font-bold text-foreground mt-1">
                          {memoData.financialRatios?.debtToIncomeRatio}%
                        </p>
                        <p className="text-[11px] text-emerald-600 mt-0.5">Capacité de remboursement saine</p>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-card">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Couverture Garantie</span>
                        <p className="text-xl font-bold text-foreground mt-1">
                          {memoData.financialRatios?.collateralCoverageRatio}%
                        </p>
                        <p className="text-[11px] text-emerald-600 mt-0.5">Garantie excédentaire</p>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-card">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Score Risque</span>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                          {memoData.financialRatios?.calculatedScore}/100
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Classe A (Faible risque)</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                      <h4 className="text-xs font-bold text-foreground">Motivation & Explicabilité IA :</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {memoData.aiRecommendation?.rationale}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: OCR & FRAUD DETECTOR */}
          <TabsContent value="ocr" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold">
                  Scanner OCR & Détection de Fraude Documentaire
                </CardTitle>
                <CardDescription className="text-xs">
                  Extraction automatique des métadonnées, contrôle des filigranes et validation d'authenticité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Type de Document à Analyser
                    </label>
                    <Select value={ocrDocType} onValueChange={setOcrDocType}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDENTITY">Pièce d'Identité / Passeport</SelectItem>
                        <SelectItem value="COLLATERAL_TITLE">Titre de Propriété Immobilière</SelectItem>
                        <SelectItem value="BANK_STATEMENT">Relevé Bancaire (6 mois)</SelectItem>
                        <SelectItem value="TAX_DECLARATION">Attestation Fiscale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleRunOcr}
                      disabled={loadingOcr}
                      className="w-full h-9 gap-2 text-xs"
                    >
                      <Scan className="h-3.5 w-3.5" />
                      <span>{loadingOcr ? "Numérisation & Audit..." : "Lancer le Scanner OCR"}</span>
                    </Button>
                  </div>
                </div>

                {ocrResult && (
                  <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-300">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            Document Authentifié avec Succès
                          </h4>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                            Score de confiance : {ocrResult.authenticityScore}%
                          </p>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        Conforme Anti-Fraude
                      </Badge>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                      <h4 className="text-xs font-bold text-foreground">Données Extraites par Vision OCR :</h4>
                      <pre className="p-3 rounded-lg bg-muted text-[11px] font-mono text-foreground overflow-x-auto">
                        {JSON.stringify(ocrResult.extractedData, null, 2)}
                      </pre>
                    </div>
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
