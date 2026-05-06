'use client';

import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

export default function TasksPage() {
    const [selectedApp, setSelectedApp] = useState<any>(null);

    const tasks = [
        { 
            id: 'APP-001', 
            client: 'Marie Nzambe', 
            amount: '5,000 $', 
            score: 82, 
            status: 'SUBMITTED', 
            date: 'Il y a 10m',
            avatar: 'MN',
            factors: ['Ratio DTI Excellent', 'Emploi Stable']
        },
        { 
            id: 'APP-002', 
            client: 'Jean-Paul Bodo', 
            amount: '12,500 $', 
            score: 64, 
            status: 'SUBMITTED', 
            date: 'Il y a 45m',
            avatar: 'JB',
            factors: ['Revenus suffisants', 'Encours existant modéré']
        },
        { 
            id: 'APP-003', 
            client: 'Socio Agri Coop', 
            amount: '45,000 $', 
            score: 88, 
            status: 'SUBMITTED', 
            date: 'Il y a 1h',
            avatar: 'SA',
            factors: ['Garanties solides', 'Historique parfait']
        }
    ];

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
                                Examinez les dossiers en attente de décision
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2 mr-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"></div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    +5
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                                <Filter size={18} /> Filtrer
                            </button>
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="grid grid-cols-1 gap-4">
                        {tasks.map((task, index) => (
                            <motion.div 
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedApp(task)}
                                className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:border-blue-200 dark:hover:border-blue-900 transition-all group"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                        {task.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{task.client}</h4>
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md">{task.id}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1 font-medium">{task.date} • Prêt Personnel</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-100 tabular-nums">{task.amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scoring IA</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-black ${task.score > 70 ? 'text-green-600' : 'text-amber-500'}`}>
                                                {task.score}/100
                                            </span>
                                            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${task.score > 70 ? 'bg-green-500' : 'bg-amber-500'}`} 
                                                    style={{ width: `${task.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all shadow-sm shadow-green-600/5">
                                            <CheckCircle2 size={20} />
                                        </button>
                                        <button className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm shadow-red-600/5">
                                            <XCircle size={20} />
                                        </button>
                                        <div className="w-px h-8 bg-slate-100 mx-2"></div>
                                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                                            <ArrowUpRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Decision Modal (Simplified) */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                            {selectedApp.avatar}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedApp.client}</h3>
                                            <p className="text-slate-400 font-medium">Demande de prêt #{selectedApp.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-blue-600 tabular-nums">{selectedApp.amount}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Montant Demandé</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="text-amber-500" size={18} />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Score de Risque</span>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <Text className={`text-5xl font-black ${selectedApp.score > 70 ? 'text-green-600' : 'text-amber-500'}`}>
                                                {selectedApp.score}
                                            </Text>
                                            <span className="text-slate-400 font-bold mb-2">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertCircle className="text-blue-500" size={18} />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Facteurs Clés</span>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedApp.factors.map((f: string) => (
                                                <div key={f} className="flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Observations & Commentaires</label>
                                    <textarea 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        rows={4}
                                        placeholder="Notez vos remarques ici..."
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                        <CheckCircle2 size={20} /> Approuver le dossier
                                    </button>
                                    <button className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                        <XCircle size={20} /> Rejeter la demande
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
