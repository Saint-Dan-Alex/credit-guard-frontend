'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AlertTriangle, Send, PhoneCall, RotateCcw } from 'lucide-react';

export default function RecoveryPage() {
    const defaults = [
        { id: 'L-302', client: 'Alice Kapinga', amount: '3,000 $', delay: '45 jours', risk: 'Critical', action: 'Legal' },
        { id: 'L-410', client: 'Jean-Marc Tshi', amount: '1,200 $', delay: '12 jours', risk: 'Medium', action: 'Reminder' },
        { id: 'L-512', client: 'Berta Zola', amount: '8,500 $', delay: '18 jours', risk: 'High', action: 'Call' },
    ];

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion du Recouvrement</h2>
                        <p className="text-gray-500 text-sm">Suivi des impayés et lancement des procédures de relance</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card border-l-4 border-red-500 bg-red-50/30">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Total en Retard</p>
                            <h4 className="text-2xl font-bold">12,700 $</h4>
                        </div>
                        <div className="card">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dossiers Critiques</p>
                            <h4 className="text-2xl font-bold text-red-700">3</h4>
                        </div>
                    </div>

                    <div className="card !p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Prêt</th>
                                    <th className="px-6 py-4 font-bold">Client</th>
                                    <th className="px-6 py-4 font-bold">Montant</th>
                                    <th className="px-6 py-4 font-bold">Retard</th>
                                    <th className="px-6 py-4 font-bold">Niveau Risque</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {defaults.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                                        <td className="px-6 py-4 font-bold">{item.client}</td>
                                        <td className="px-6 py-4 text-red-600 font-semibold">{item.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1 font-medium italic text-orange-700">
                                                <AlertTriangle size={14} /> {item.delay}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.risk === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {item.risk}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Appeler"><PhoneCall size={16} /></button>
                                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Relance SMS"><Send size={16} /></button>
                                            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Plan de restructuration"><RotateCcw size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
