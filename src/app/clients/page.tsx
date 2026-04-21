'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { UserPlus, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ClientsPage() {
    const clients = [
        { id: 'CLI-001', name: 'Marie Nzambe', email: 'marie.n@gmail.com', phone: '+243 812 345 678', city: 'Kinshasa', income: '2,500 $', trust: 'High' },
        { id: 'CLI-002', name: 'Jean-Paul Bodo', email: 'jp.bodo@outlook.com', phone: '+243 998 765 432', city: 'Lubumbashi', income: '1,800 $', trust: 'Medium' },
        { id: 'CLI-003', name: 'Alice Kapinga', email: 'alice.k@yahoo.fr', phone: '+243 821 555 111', city: 'Goma', income: '900 $', trust: 'Low' },
        { id: 'CLI-004', name: 'Marc Owona', email: 'm.owona@gmail.com', phone: '+237 677 888 999', city: 'Douala', income: '3,200 $', trust: 'High' },
    ];

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Annuaire Clients & KYC</h2>
                            <p className="text-gray-500 text-sm">Gérez les profils et vérifiez la solvabilité de vos emprunteurs</p>
                        </div>
                        <button className="btn-primary flex items-center gap-2">
                            <UserPlus size={16} /> Nouveau Client
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map((client) => (
                            <div key={client.id} className="card group relative hover:border-blue-300 dark:hover:border-blue-900 transition-all">
                                <div className="absolute top-4 right-4 group-hover:block hidden">
                                    <ExternalLink size={14} className="text-blue-500 cursor-pointer" />
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                        {client.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{client.name}</h4>
                                        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{client.id}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Mail size={14} /> {client.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Phone size={14} /> {client.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin size={14} /> {client.city}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-xs">
                                        <span className="text-gray-400 block mb-1 uppercase tracking-tighter">Revenu Mensuel</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{client.income}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-400 block mb-1 uppercase tracking-tighter text-[10px]">Indice Confiance</span>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${client.trust === 'High' ? 'text-green-500' : client.trust === 'Medium' ? 'text-orange-500' : 'text-red-500'
                                            }`}>
                                            <ShieldCheck size={12} /> {client.trust}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
