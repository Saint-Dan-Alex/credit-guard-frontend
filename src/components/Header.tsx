import React from 'react';
import { Search, Bell, Wallet } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-8 shadow-sm shrink-0">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un dossier, un client..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="btn-primary flex items-center gap-2">
                    <Wallet size={16} />
                    Nouveau Prêt
                </button>
            </div>
        </header>
    );
}
