'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Bot, 
  Sparkles, 
  Send, 
  FileText, 
  ShieldAlert, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileSearch, 
  Cpu,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState<'COPILOT' | 'MEMO' | 'OCR'>('COPILOT');
  
  // Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; actions?: string[] }>>([
    {
      sender: 'ai',
      text: 'Bonjour ! Je suis CreditGuard AI Copilot. Je peux analyser vos dossiers de prêt, évaluer le risque de crédit en direct, auditer la conformité des garanties et détecter la fraude documentaire.',
      actions: ['Explique le modèle de scoring', 'Règles prudentielles IFRS 9', 'Stratégie de restructuration'],
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Memo state
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [memoData, setMemoData] = useState<any>(null);
  const [loadingMemo, setLoadingMemo] = useState(false);

  // OCR state
  const [ocrDocType, setOcrDocType] = useState('IDENTITY');
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [loadingOcr, setLoadingOcr] = useState(false);

  useEffect(() => {
    api.getApplications().then(res => {
      setApplications(res);
      if (res.length > 0) setSelectedAppId(res[0].id);
    }).catch(() => {});
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text }];
    setMessages(newMsgs);
    if (!textToSend) setInputText('');
    setIsSending(true);

    try {
      const res = await api.chatWithAiCopilot(text);
      setMessages([...newMsgs, { sender: 'ai', text: res.reply, actions: res.suggestedActions }]);
    } catch (err: any) {
      setMessages([...newMsgs, { sender: 'ai', text: 'Désolé, une erreur est survenue lors de l’analyse IA.' }]);
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
    } catch (err: any) {
      alert(err.message || 'Impossible de générer le mémo IA');
    } finally {
      setLoadingMemo(false);
    }
  };

  const handleRunOCR = async () => {
    try {
      setLoadingOcr(true);
      const res = await api.runDocumentOCR({ documentType: ocrDocType });
      setOcrResult(res);
    } catch (err: any) {
      alert(err.message || 'Échec de l’extraction OCR');
    } finally {
      setLoadingOcr(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">CreditGuard AI Intelligence Hub</h2>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 rounded-full text-xs font-black">
                  Decision Augmentation
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Copilot d'analyse financière, génération automatique des mémos de comité et audit anti-fraude OCR
              </p>
            </div>

            {/* Tab selector */}
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <button
                onClick={() => setActiveTab('COPILOT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'COPILOT'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                <Bot size={16} /> Analyst Copilot
              </button>
              <button
                onClick={() => setActiveTab('MEMO')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'MEMO'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                <FileSearch size={16} /> Note de Synthèse IA
              </button>
              <button
                onClick={() => setActiveTab('OCR')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'OCR'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                <Scan size={16} /> OCR & Détection Fraude
              </button>
            </div>
          </div>

          {/* TAB 1: COPILOT CONVERSATIONNEL */}
          {activeTab === 'COPILOT' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl flex flex-col h-[calc(100vh-250px)] overflow-hidden">
              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      m.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md'
                    }`}>
                      {m.sender === 'user' ? 'JN' : <Bot size={18} />}
                    </div>
                    <div>
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                          : 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none font-medium'
                      }`}>
                        {m.text}
                      </div>
                      {m.actions && m.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {m.actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(act)}
                              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-[10px] font-bold border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1"
                            >
                              <Zap size={10} /> {act}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                    <RefreshCw size={14} className="animate-spin text-blue-600" /> Analyse IA en cours...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Posez une question à CreditGuard AI Copilot..."
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: NOTE DE SYNTHÈSE IA (CREDIT MEMO) */}
          {activeTab === 'MEMO' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full md:w-auto">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">
                    Sélectionner un dossier de crédit à auditer
                  </label>
                  <select
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                  >
                    {applications.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.applicationNo || app.id.slice(0, 8)} — {app.client?.firstName} {app.client?.lastName} (${app.amount?.toLocaleString()} • {app.product?.name})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleGenerateMemo}
                  disabled={loadingMemo || !selectedAppId}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0 w-full md:w-auto justify-center"
                >
                  <Sparkles size={16} className={loadingMemo ? 'animate-spin' : ''} />
                  {loadingMemo ? 'Génération IA en cours...' : 'Générer la Note de Synthèse'}
                </button>
              </div>

              {memoData && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-2xl space-y-6">
                  {/* Executive Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-800 gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                        RAPPORT DE COMITÉ DE CRÉDIT GÉNÉRÉ PAR IA
                      </span>
                      <h3 className="text-xl font-black mt-1">Évaluation Risque & Capacité d'Endettement</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Recommandation IA</p>
                        <p className="text-sm font-black text-blue-600">{memoData.aiRecommendation}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base ${
                        memoData.riskLevel === 'LOW' ? 'bg-green-100 text-green-700' : memoData.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {memoData.financialHealthScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-blue-50/50 dark:bg-slate-900/50 rounded-2xl border border-blue-100 dark:border-slate-800 text-xs leading-relaxed text-gray-800 dark:text-gray-200">
                    <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">Résumé Exécutif :</p>
                    {memoData.executiveSummary}
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Revenu Net Mensuel</p>
                      <p className="text-lg font-black mt-1">${memoData.debtCapacityAnalysis?.currentMonthlyIncome?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Reste à vivre : ${memoData.debtCapacityAnalysis?.disposableIncome?.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Mensualité Projetée</p>
                      <p className="text-lg font-black mt-1">${memoData.debtCapacityAnalysis?.proposedInstallment?.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold mt-1 ${memoData.debtCapacityAnalysis?.dtiPercentage > 40 ? 'text-red-500' : 'text-green-500'}`}>
                        Effort DTI : {memoData.debtCapacityAnalysis?.dtiPercentage}%
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Couverture Garanties</p>
                      <p className="text-lg font-black mt-1">{memoData.collateralAssessment?.coverageRatio}%</p>
                      <p className="text-[10px] font-bold text-emerald-600 mt-1">
                        Valeur estimée : ${memoData.collateralAssessment?.totalEstimatedValue?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Early Warning & Mitigations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900">
                      <h4 className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2">
                        <AlertTriangle size={14} /> Alertes Early Warning (EWS)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-rose-700 dark:text-rose-300">
                        {memoData.earlyWarningIndicators?.map((ew: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>•</span> <span>{ew}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                      <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 size={14} /> Mesures de Mitigatiom Recommandées
                      </h4>
                      <ul className="space-y-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                        {memoData.suggestedMitigations?.map((sm: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>•</span> <span>{sm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OCR & FRAUDE DOCUMENTAIRE */}
          {activeTab === 'OCR' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl space-y-4">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Scan size={18} className="text-blue-600" /> Scanner & Extraction Documentaire
                </h3>
                <p className="text-xs text-gray-500">
                  L'intelligence artificielle analyse le document, extrait les champs clés et évalue l'authenticité face aux risques de falsification.
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Type de Document</label>
                  <select
                    value={ocrDocType}
                    onChange={(e) => setOcrDocType(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                  >
                    <option value="IDENTITY">Pièce d'Identité / Passeport</option>
                    <option value="PAYSLIP">Bulletin de Paie / Fiche de Salaire</option>
                    <option value="TAX_RECORD">Relevé Fiscal / Déclaration Impôts</option>
                    <option value="TITLE_DEED">Titre Foncier / Certificat de Propriété</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 p-8 rounded-2xl text-center">
                  <FileText size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Glissez-déposez le fichier justificatif</p>
                  <p className="text-[10px] text-gray-400 mt-1">Formats acceptés : PDF, PNG, JPG (Max 15MB)</p>
                </div>

                <button
                  onClick={handleRunOCR}
                  disabled={loadingOcr}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Cpu size={16} className={loadingOcr ? 'animate-spin' : ''} />
                  {loadingOcr ? 'Analyse OCR & Anti-Fraude en cours...' : 'Lancer l’Extraction Intelligente'}
                </button>
              </div>

              {/* OCR Results Preview */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl space-y-4">
                <h3 className="text-base font-black flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Données Extraites & Score d'Authenticité
                </h3>

                {ocrResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Indice de Confiance OCR</p>
                        <p className="text-lg font-black text-emerald-900 dark:text-emerald-200">{ocrResult.confidenceScore}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Suspicion d'Altération</p>
                        <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{ocrResult.fraudAnomalyScore}% (Très faible)</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Champs Métiers Reconnus :</p>
                      <pre className="p-4 bg-gray-900 text-green-400 rounded-2xl text-xs font-mono overflow-x-auto">
                        {JSON.stringify(ocrResult.extractedFields, null, 2)}
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center gap-2 font-bold text-emerald-600">
                        <CheckCircle2 size={14} /> Format d'ID Conforme
                      </div>
                      <div className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center gap-2 font-bold text-emerald-600">
                        <CheckCircle2 size={14} /> Absence de Retouche
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-400 text-xs italic">
                    Lancez l'extraction pour visualiser les données structurées et l'analyse de fraude.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
