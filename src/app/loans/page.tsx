'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { DollarSign, Calendar, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function LoansPage() {
    const loans = [
        { id: 'L-501', client: 'Marie Nzambe', amount: '5,000 $', balance: '3,240 $', nextPayment: '01-05-2026', progress: 35, status: 'HEALTHY' },
        { id: 'L-504', client: 'Socio Agri Coop', amount: '45,000 $', balance: '41,500 $', nextPayment: '01-05-2026', progress: 8, status: 'HEALTHY' },
        { id: 'L-488', client: 'Marc Owona', amount: '2,000 $', balance: '450 $', nextPayment: '25-04-2026', progress: 77, status: 'HEALTHY' },
    ];

    return (
        <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Portefeuille Actif</h2>
                            <p className="text-gray-500 text-sm">Suivi des décaissements et des remboursements en cours</p>
                        </div>
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
                            <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded text-sm font-medium">Tous</button>
                            <button className="px-4 py-1.5 text-gray-500 rounded text-sm font-medium">À Risque</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {loans.map((loan) => (
                            <div key={loan.id} className="card flex flex-col md:flex-row md:items-center gap-6">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 hidden md:block">
                                    <DollarSign size={24} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{loan.client}</h4>
                                        <span className="text-[10px] bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-500">{loan.id}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> Échéance : {loan.nextPayment}</span>
                                        <span className="flex items-center gap-1 text-green-600 font-medium"><TrendingDown size={12} /> Taux : 4.5%</span>
                                    </div>
                                </div>

                                <div className="w-full md:w-48">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Remboursé : {loan.progress}%</span>
                                        <span className="font-bold">{loan.balance} restant</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${loan.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase">Capital Initial</p>
                                        <p className="font-bold text-lg">{loan.amount}</p>
                                    </div>
                                    <button className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors">
                                        <ArrowUpRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
