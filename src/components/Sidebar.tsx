'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    ClipboardList,
    Users,
    Wallet,
    AlertCircle,
    BarChart3,
    Settings,
    Shield,
    LogOut,
    ChevronRight,
    History,
    Layers,
    Sparkles,
    Bot
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de Bord', href: '/' },
        { icon: <FileText size={20} />, label: 'Demandes', href: '/applications' },
        { icon: <ClipboardList size={20} />, label: 'Tâches & Décisions', href: '/applications/tasks', badge: '12' },
        { icon: <Sparkles size={20} />, label: 'Intelligence IA & Copilot', href: '/ai-assistant' },
        { icon: <Users size={20} />, label: 'Clients Emprunteurs', href: '/clients' },
        { icon: <Wallet size={20} />, label: 'Prêts & Restructuration', href: '/loans' },
        { icon: <AlertCircle size={20} />, label: 'Recouvrement & Contentieux', href: '/recovery' },
        { icon: <BarChart3 size={20} />, label: 'Rapports & Risque', href: '/reports' },
    ];

    const adminItems = [
        { icon: <Shield size={20} />, label: 'Utilisateurs & Overrides', href: '/admin/users' },
        { icon: <Layers size={20} />, label: 'Rôles & Matrice HRBAC', href: '/admin/roles' },
        { icon: <History size={20} />, label: "Journaux d'Audit", href: '/admin/logs' },
    ];

    return (
        <aside className="w-72 bg-[#1E40AF] dark:bg-slate-900 text-white flex flex-col hidden lg:flex shrink-0 border-r border-white/5 relative overflow-hidden">
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-b from-white/20 to-transparent blur-3xl rounded-full"></div>
            </div>

            <div className="p-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
                        <Shield className="text-blue-700" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight leading-none">CreditGuard</h1>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-blue-200 text-[9px] uppercase font-black tracking-widest">Enterprise Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-8 mt-2 overflow-y-auto relative z-10 custom-scrollbar">
                <div>
                    <p className="text-[10px] font-black text-blue-300/40 uppercase px-3 mb-3 tracking-[0.2em]">Menu Opérationnel</p>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <NavItem key={item.href} item={item} active={pathname === item.href} />
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-blue-300/40 uppercase px-3 mb-3 tracking-[0.2em]">Administration HRBAC</p>
                    <div className="space-y-1">
                        {adminItems.map((item) => (
                            <NavItem key={item.href} item={item} active={pathname === item.href} />
                        ))}
                    </div>
                </div>
            </nav>

            <div className="p-6 mt-auto relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-black text-white shadow-lg border border-white/20">
                            JN
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">Joël Ngombo</p>
                            <p className="text-[9px] text-blue-300 font-bold uppercase tracking-wider">Super Admin</p>
                        </div>
                        <Link href="/login" className="p-1.5 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                            <LogOut size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ item, active }: { item: any; active: boolean }) {
    return (
        <Link
            href={item.href}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all relative group ${
                active
                    ? 'text-white shadow-lg shadow-blue-900/40 bg-white/15 backdrop-blur-md'
                    : 'text-blue-100/70 hover:text-white hover:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-3">
                <span className={`${active ? 'text-white' : 'text-blue-300 group-hover:text-white transition-colors'}`}>
                    {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
            </div>

            <div className="flex items-center gap-2">
                {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500 text-white shadow-sm">
                        {item.badge}
                    </span>
                )}
                {active && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-4 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                )}
            </div>
        </Link>
    );
}
