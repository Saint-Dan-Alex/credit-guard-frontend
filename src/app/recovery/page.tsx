'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  AlertTriangle, 
  Send, 
  PhoneCall, 
  RotateCcw, 
  RefreshCw, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle, 
  X,
  Gavel,
  Scale
} from 'lucide-react';
import { api } from '@/lib/api';

export default function RecoveryPage() {
    const [cases, setCases] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [showActionModal, setShowActionModal] = useState(false);

    // Action Form State
    const [actionType, setActionType] = useState('PHONE_CALL');
    const [actionNotes, setActionNotes] = useState('');
    const [promiseAmount, setPromiseAmount] = useState('');
    const [promiseDate, setPromiseDate] = useState('');
    const [outcome, setOutcome] = useState('PROMISE_TAKEN');
    const [processing, setProcessing] = useState(false);

    // Litigation Modal State
    const [showLitigationModal, setShowLitigationModal] = useState(false);
    const [litigationCase, setLitigationCase] = useState<any>(null);
    const [courtJurisdiction, setCourtJurisdiction] = useState('Tribunal de Commerce de Kinshasa / Gombe');
    const [lawyerAssigned, setLawyerAssigned] = useState('Cabinet d’Avocats & Associés');
    const [litigationNotes, setLitigationNotes] = useState('');
    const [litigating, setLitigating] = useState(false);

    const loadRecoveryData = async () => {
        try {
            setLoading(true);
            const [statsData, casesData] = await Promise.all([
                api.getRecoveryStats().catch(() => null),
                api.getDelinquencyCases().catch(() => []),
            ]);
            setStats(statsData);
            setCases(casesData);
        } catch (err) {
            console.error('Failed to load recovery data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecoveryData();
    }, []);

    const handleRefreshDelinquency = async () => {
        try {
            setLoading(true);
            await api.refreshDelinquency();
            await loadRecoveryData();
            alert('Calcul des retards (DPD) et étapes de risque actualisés.');
        } catch (err: any) {
            alert(err.message || 'Erreur lors du recalcul des retards');
        } finally {
            setLoading(false);
        }
    };

    const handleRecordAction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase) return;

        try {
            setProcessing(true);
            await api.recordCollectionAction(selectedCase.id, {
                actionType,
                notes: actionNotes,
                outcome,
                promiseAmount: promiseAmount ? parseFloat(promiseAmount) : undefined,
                promiseDate: promiseDate || undefined,
            });

            alert('Action de recouvrement enregistrée avec succès.');
            setShowActionModal(false);
            setActionNotes('');
            setPromiseAmount('');
            setPromiseDate('');
            await loadRecoveryData();
        } catch (err: any) {
            alert(err.message || 'Erreur lors de l’enregistrement de l’action');
        } finally {
            setProcessing(false);
        }
    };

    const handleLitigate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!litigationCase) return;

        try {
            setLitigating(true);
            await api.initiateLitigation(litigationCase.id, {
                courtJurisdiction,
                lawyerAssigned,
                notes: litigationNotes,
            });

            alert('Le dossier a été transféré avec succès au département contentieux & justice.');
            setShowLitigationModal(false);
            await loadRecoveryData();
        } catch (err: any) {
            alert(err.message || 'Échec de la transmission au contentieux');
        } finally {
            setLitigating(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Recouvrement & Contentieux Juridique</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Suivi des DPD, relances multi-canales (SMS Dream Digital / Email), promesses et procédures judiciaires
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleRefreshDelinquency}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-sm transition-all"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Recalculer Retards (DPD)
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-l-4 border-red-500 shadow-xl">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Total Encours en Retard</p>
                            <h4 className="text-2xl font-black text-red-700 dark:text-red-400">
                                ${stats?.totalOverdueAmount?.toLocaleString() || '0'}
                            </h4>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-l-4 border-orange-500 shadow-xl">
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">PAR 30 Jours</p>
                            <h4 className="text-2xl font-black text-orange-700 dark:text-orange-400">
                                ${stats?.par30Amount?.toLocaleString() || '0'}
                            </h4>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-l-4 border-rose-600 shadow-xl">
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">PAR 90+ (Contentieux)</p>
                            <h4 className="text-2xl font-black text-rose-700 dark:text-rose-400">
                                ${stats?.par90Amount?.toLocaleString() || '0'}
                            </h4>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-l-4 border-blue-500 shadow-xl">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Promesses Actives</p>
                            <h4 className="text-2xl font-black text-blue-700 dark:text-blue-400">
                                {stats?.activePromises || 0}
                            </h4>
                        </div>
                    </div>

                    {/* Delinquency Cases Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-base font-black text-gray-900 dark:text-white">Dossiers d'Impayés & Actions Requises</h3>
                            <span className="text-xs text-gray-400 font-bold">{cases.length} cas sous surveillance</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Client & Prêt</th>
                                        <th className="px-6 py-4">Retard (DPD)</th>
                                        <th className="px-6 py-4">Montant Échu</th>
                                        <th className="px-6 py-4">Étape Bâle / IFRS 9</th>
                                        <th className="px-6 py-4">Dernière Action</th>
                                        <th className="px-6 py-4 text-right">Actions de Relance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Chargement des dossiers de recouvrement...</td>
                                        </tr>
                                    ) : cases.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                Aucun impayé actif. Portefeuille sain à 100%.
                                            </td>
                                        </tr>
                                    ) : (
                                        cases.map((item) => (
                                            <tr key={item.id} className="hover:bg-red-50/20 dark:hover:bg-red-950/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {item.loan?.client?.firstName} {item.loan?.client?.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-mono">{item.loan?.loanNumber} • {item.loan?.client?.phone || 'Pas de tél'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                                        item.currentDpd > 60 ? 'bg-rose-100 text-rose-700' :
                                                        item.currentDpd > 30 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {item.currentDpd} jours
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-rose-600">
                                                    ${item.totalOverdueAmount?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
                                                        {item.riskStage?.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.actions?.[0] ? (
                                                        <div>
                                                            <p className="font-bold text-gray-800 dark:text-gray-200">{item.actions[0].actionType}</p>
                                                            <p className="text-[10px] text-gray-400 truncate max-w-xs">{item.actions[0].notes}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Aucune action enregistrée</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedCase(item);
                                                                setActionType('PHONE_CALL');
                                                                setShowActionModal(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-xl transition-all" 
                                                            title="Appeler Emprunteur"
                                                        >
                                                            <PhoneCall size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedCase(item);
                                                                setActionType('SMS_REMINDER');
                                                                setShowActionModal(true);
                                                            }}
                                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/40 rounded-xl transition-all" 
                                                            title="Relance SMS / WhatsApp"
                                                        >
                                                            <Send size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setLitigationCase(item);
                                                                setShowLitigationModal(true);
                                                            }}
                                                            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-xl transition-all" 
                                                            title="Passer au Contentieux / Justice"
                                                        >
                                                            <Gavel size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Action de Relance */}
            {showActionModal && selectedCase && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-black">Enregistrer Action de Recouvrement</h3>
                                <p className="text-xs text-gray-500">
                                    Client : {selectedCase.loan?.client?.firstName} {selectedCase.loan?.client?.lastName} (Impayé : ${selectedCase.totalOverdueAmount})
                                </p>
                            </div>
                            <button onClick={() => setShowActionModal(false)} className="p-1.5 text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleRecordAction} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Type d'Action</label>
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                >
                                    <option value="PHONE_CALL">Appel Téléphonique</option>
                                    <option value="SMS_REMINDER">Relance SMS Automatique (Dream Digital)</option>
                                    <option value="WHATSAPP_NOTICE">Message WhatsApp Officiel</option>
                                    <option value="FIELD_VISIT">Visite d'Agent sur le Terrain</option>
                                    <option value="FORMAL_NOTICE">Mise en Demeure / Courrier</option>
                                    <option value="LEGAL_ACTION">Procédure Contentieuse / Avocat</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notes / Compte-Rendu d'Échange</label>
                                <textarea
                                    value={actionNotes}
                                    onChange={(e) => setActionNotes(e.target.value)}
                                    placeholder="Ex: Client joint au téléphone, accepte de verser 50% d'ici vendredi..."
                                    rows={3}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs"
                                    required
                                />
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
                                    Promesse de Paiement (Optionnel)
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">Montant Promis ($)</label>
                                        <input
                                            type="number"
                                            placeholder="Ex: 500"
                                            value={promiseAmount}
                                            onChange={(e) => setPromiseAmount(e.target.value)}
                                            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">Date Limite de Promesse</label>
                                        <input
                                            type="date"
                                            value={promiseDate}
                                            onChange={(e) => setPromiseDate(e.target.value)}
                                            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowActionModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                                >
                                    Enregistrer l'Action
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Contentieux & Procédure Judiciaire */}
            {showLitigationModal && litigationCase && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-black text-rose-600 flex items-center gap-2">
                                    <Scale size={18} /> Passage au Contentieux Juridique
                                </h3>
                                <p className="text-xs text-gray-500">Prêt {litigationCase.loan?.loanNumber} • Impayé : ${litigationCase.totalOverdueAmount}</p>
                            </div>
                            <button onClick={() => setShowLitigationModal(false)} className="p-1.5 text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleLitigate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Juridiction Compétente</label>
                                <input
                                    type="text"
                                    value={courtJurisdiction}
                                    onChange={(e) => setCourtJurisdiction(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cabinet d'Avocat / Huissier Assigne</label>
                                <input
                                    type="text"
                                    value={lawyerAssigned}
                                    onChange={(e) => setLawyerAssigned(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Motifs et Instructions Judiciaires</label>
                                <textarea
                                    value={litigationNotes}
                                    onChange={(e) => setLitigationNotes(e.target.value)}
                                    placeholder="Ex: Échec des relances amiables, saisie conservatoire du matériel nanti et assignation en référé."
                                    rows={3}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowLitigationModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={litigating}
                                    className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                                >
                                    {litigating ? 'Transmission...' : 'Initier Procédure Judiciaire'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
