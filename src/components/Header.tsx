'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-8 transition-all">
            {/* Search Bar */}
            <div className="relative w-96 group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un dossier, client ou prêt..."
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none placeholder:text-gray-400"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-1.5 pl-4 pr-1.5 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Joël Ngombo</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        JN
                    </div>
                </div>
            </div>
        </header>
    );
}
