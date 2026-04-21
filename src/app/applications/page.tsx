'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Filter, Download, Plus, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ApplicationsPage() {
    const applications = [
        { id: 'APP-001', client: 'Marie Nzambe', amount: '5,000 $', date: '20-04-2026', score: 82, status: 'APPROVED' },
        { id: 'APP-002', client: 'Jean-Paul Bodo', amount: '12,500 $', date: '19-04-2026', score: 64, status: 'PENDING' },
        { id: 'APP-003', client: 'Alice Kapinga', amount: '3,000 $', date: '18-04-2026', score: 42, status: 'REJECTED' },
        { id: 'APP-004', client: 'Socio Agri Coop', amount: '45,000 $', date: '17-04-2026', score: 88, status: 'APPROVED' },
        { id: 'APP-005', client: 'Marc Owona', amount: '1,500 $', date: '17-04-2026', score: 55, status: 'PENDING' },
    ];

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Demandes de Prêt</h2>
                            <p className="text-gray-500 text-sm">Gérez et validez les dossiers de crédit entrants</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Filter size={16} /> Filtrer
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Download size={16} /> Exporter
                            </button>
                            <button className="btn-primary flex items-center gap-2">
                                <Plus size={16} /> Nouvelle Demande
                            </button>
                        </div>
                    </div>

                    <div className="card !p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">ID Dossier</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Score Risk</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{app.id}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{app.client}</td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">{app.amount}</td>
                                            <td className="px-6 py-4 text-gray-500">{app.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center">
                                                    <span className={`font-bold ${app.score > 70 ? 'text-green-600' : app.score > 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                        {app.score}
                                                    </span>
                                                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                        <div className={`h-full ${app.score > 70 ? 'bg-green-500' : app.score > 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${app.score}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={app.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Voir les détails">
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                            <span className="text-gray-500 text-xs italic">Affichage de {applications.length} demandes sur 1,250 total</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs disabled:opacity-50" disabled>Précédent</button>
                                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs">Suivant</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        APPROVED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={10} />, label: 'Approuvé' },
        PENDING: { color: 'bg-orange-100 text-orange-700', icon: <Clock size={10} />, label: 'En Analyse' },
        REJECTED: { color: 'bg-red-100 text-red-700', icon: <XCircle size={10} />, label: 'Refusé' },
    };

    const { color, icon, label } = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
            {icon}
            {label}
        </span>
    );
}
