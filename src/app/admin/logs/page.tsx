'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { 
  Shield, 
  History, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';

export default function AuditLogsPage() {
    const logs = [
        { id: 1, action: 'APPROBATION_DOSSIER', user: 'Joël Ngombo', target: 'APP-001', date: 'Il y a 5m', status: 'SUCCESS' },
        { id: 2, action: 'MODIFICATION_ROLE', user: 'Admin System', target: 'User: Marc Lushiku', date: 'Il y a 20m', status: 'WARNING' },
        { id: 3, action: 'CONNEXION_OTP', user: 'Marie Nzambe', target: 'Login Success', date: 'Il y a 1h', status: 'SUCCESS' },
        { id: 4, action: 'SOUUMISSION_MOBILE', user: 'Agent Terrain 04', target: 'Client: Jean-Paul Bodo', date: 'Il y a 2h', status: 'SUCCESS' },
        { id: 5, action: 'REFUS_AUTOMATIQUE', user: 'CreditGuard IA', target: 'APP-003', date: 'Hier', status: 'DANGER' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Journaux d'Audit</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Traçabilité complète des actions système et sécurité</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                                <History size={18} /> Exporter PDF
                            </button>
                        </div>
                    </div>

                    <div className="card overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Filtrer par action ou utilisateur..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <button className="flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-all">
                                <Filter size={16} /> Filtres avancés
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Action</th>
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Cible</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Détails</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <StatusIcon status={log.status} />
                                                    <span className="text-sm font-bold text-slate-900">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User size={12} className="text-slate-500" />
                                                    </div>
                                                    <span className="text-sm text-slate-600 font-medium">{log.user}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-black">{log.target}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{log.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-300 hover:text-blue-600 transition-colors">
                                                    <ArrowRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case 'SUCCESS': return <CheckCircle size={16} className="text-green-500" />;
        case 'WARNING': return <AlertTriangle size={16} className="text-amber-500" />;
        case 'DANGER': return <Shield size={16} className="text-red-500" />;
        default: return <History size={16} className="text-slate-400" />;
    }
}
