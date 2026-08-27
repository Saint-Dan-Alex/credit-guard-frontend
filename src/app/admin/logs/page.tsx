'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Shield, 
  History, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await api.getAuditLogs();
            setLogs(data);
        } catch (err) {
            console.error('Failed to load audit logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Journaux d'Audit</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Traçabilité immuable des décisions, décaissements et opérations financières</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={loadLogs}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
                            </button>
                        </div>
                    </div>

                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Action</th>
                                        <th className="px-6 py-4">Entité Cible</th>
                                        <th className="px-6 py-4">Utilisateur / Agent</th>
                                        <th className="px-6 py-4">Horodatage</th>
                                        <th className="px-6 py-4 text-right">Détails Changements</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Chargement des logs d'audit...</td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Aucun log d'audit enregistré.</td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{log.entity}</span>
                                                    <span className="block text-[10px] text-slate-400 font-mono">{log.entityId}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {log.user?.name || log.user?.email || 'Système'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <code className="text-[10px] bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono text-slate-600 dark:text-slate-300">
                                                        {log.changes ? JSON.stringify(log.changes) : '-'}
                                                    </code>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
