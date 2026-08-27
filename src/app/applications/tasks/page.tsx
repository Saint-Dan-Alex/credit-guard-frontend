'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  AlertCircle,
  Zap,
  CheckCircle,
  Clock,
  Shield,
  DollarSign
} from 'lucide-react';
import { api } from '@/lib/api';

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await api.getPendingTasks();
            setTasks(data);
            if (data.length > 0 && !selectedApp) {
                setSelectedApp(data[0]);
            }
        } catch (err) {
            console.error('Failed to load pending tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleDecision = async (action: 'APPROVE' | 'REJECT' | 'SEND_TO_COMMITTEE') => {
        if (!selectedApp) return;
        try {
            setProcessing(true);
            await api.submitDecision(selectedApp.id, {
                action,
                comment: comment || `Décision ${action} appliquée depuis le comité`,
            });
            setComment('');
            await loadTasks();
            setSelectedApp(null);
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la soumission de décision');
        } finally {
            setProcessing(false);
        }
    };

    const handleDisburse = async () => {
        if (!selectedApp) return;
        try {
            setProcessing(true);
            await api.activateLoan({
                applicationId: selectedApp.id,
            });
            alert('Prêt décaissé avec succès ! Échéancier généré.');
            await loadTasks();
            setSelectedApp(null);
        } catch (err: any) {
            alert(err.message || 'Erreur lors du décaissement');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Tâches & Validation
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                Circuit Maker-Checker et arbitrage des dossiers de crédit
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 rounded-xl text-xs font-bold">
                                {tasks.length} dossier(s) en attente
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Tasks List (Left Column) */}
                        <div className="lg:col-span-5 space-y-4">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400">Chargement de la file de tâches...</div>
                            ) : tasks.length === 0 ? (
                                <div className="card p-8 text-center text-slate-500">
                                    <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500" />
                                    <p className="font-bold">File d'attente vide !</p>
                                    <p className="text-xs text-slate-400 mt-1">Tous les dossiers soumis ont été traités.</p>
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedApp(task)}
                                        className={`card p-5 cursor-pointer transition-all border-2 ${selectedApp?.id === task.id ? 'border-blue-600 shadow-md bg-blue-50/20' : 'hover:border-slate-300 dark:hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">
                                                    {task.client?.firstName} {task.client?.lastName}
                                                </h4>
                                                <p className="text-xs text-slate-400">{task.applicationNo || task.id.slice(0, 8)} • {task.product?.name || 'Prêt Standard'}</p>
                                            </div>
                                            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                                                ${task.amount?.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold ${(task.scoring?.score || 50) >= 75 ? 'text-green-600' : 'text-orange-500'}`}>
                                                    Score IA : {task.scoring?.score || 50}/100
                                                </span>
                                            </div>
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                {task.workflowStage}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Selected Task Details (Right Column) */}
                        <div className="lg:col-span-7">
                            {selectedApp ? (
                                <div className="card p-6 space-y-6">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <h3 className="text-xl font-black">{selectedApp.client?.firstName} {selectedApp.client?.lastName}</h3>
                                            <p className="text-xs text-slate-400">Dossier N° {selectedApp.applicationNo}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Montant Demandé</p>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">${selectedApp.amount?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Scoring IA Box */}
                                    <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <Zap size={14} /> Synthèse Risque & IA
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedApp.scoring?.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                Risque {selectedApp.scoring?.riskLevel || 'Modéré'}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-4xl font-extrabold">{selectedApp.scoring?.score || 50}</span>
                                            <span className="text-slate-400 text-sm">/ 100</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">{selectedApp.scoring?.recommendation}</p>
                                    </div>

                                    {/* XAI Factors Breakdown */}
                                    {selectedApp.scoring?.factors && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Analyse Détaillée des Ratios</h4>
                                            <div className="space-y-2">
                                                {selectedApp.scoring.factors.positiveDrivers?.map((driver: string, i: number) => (
                                                    <div key={i} className="p-2.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 rounded-xl text-xs flex items-center gap-2">
                                                        <CheckCircle size={14} className="text-green-600 shrink-0" />
                                                        <span>{driver}</span>
                                                    </div>
                                                ))}
                                                {selectedApp.scoring.factors.riskAlerts?.map((alert: string, i: number) => (
                                                    <div key={i} className="p-2.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
                                                        <XCircle size={14} className="text-red-600 shrink-0" />
                                                        <span>{alert}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Emprunteur Info */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                                        <div>
                                            <span className="text-slate-400 block mb-1">Revenu Mensuel</span>
                                            <span className="font-bold text-slate-900 dark:text-white">${selectedApp.client?.monthlyIncome?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-1">Activité / Employeur</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{selectedApp.client?.occupation || 'Non renseigné'} ({selectedApp.client?.employer || '-'})</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-1">Téléphone</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{selectedApp.client?.phone}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-1">Durée Prêt</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{selectedApp.duration} Mois</span>
                                        </div>
                                    </div>

                                    {/* Décision & Commentaires */}
                                    <div className="space-y-3 pt-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Motif ou Commentaire de Décision</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Ex: Avis favorable après vérification des justificatifs et garanties..."
                                            rows={2}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            disabled={processing}
                                            onClick={() => handleDecision('REJECT')}
                                            className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            Refuser le dossier
                                        </button>
                                        <button
                                            disabled={processing}
                                            onClick={() => handleDecision('SEND_TO_COMMITTEE')}
                                            className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            Escalader Comité
                                        </button>
                                        <button
                                            disabled={processing}
                                            onClick={() => handleDecision('APPROVE')}
                                            className="px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50"
                                        >
                                            Approuver la demande
                                        </button>
                                        {selectedApp.status === 'APPROVED' && (
                                            <button
                                                disabled={processing}
                                                onClick={handleDisburse}
                                                className="px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-1.5"
                                            >
                                                <DollarSign size={16} /> Décaisser Immédiatement
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="card p-12 text-center text-slate-400">
                                    <ClipboardList size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p className="font-bold">Sélectionnez un dossier à gauche</p>
                                    <p className="text-xs text-slate-400 mt-1">Examinez le scoring et appliquez la décision Maker-Checker.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
