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
    ChevronRight
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de Bord', href: '/' },
        { icon: <FileText size={20} />, label: 'Demandes', href: '/applications' },
        { icon: <ClipboardList size={20} />, label: 'Tâches', href: '/applications/tasks', badge: '12' },
        { icon: <Users size={20} />, label: 'Clients', href: '/clients' },
        { icon: <Wallet size={20} />, label: 'Prêts Actifs', href: '/loans' },
        { icon: <AlertCircle size={20} />, label: 'Recouvrement', href: '/recovery' },
        { icon: <BarChart3 size={20} />, label: 'Rapports', href: '/reports' },
    ];

    const adminItems = [
        { icon: <Shield size={20} />, label: 'Gestion Accès', href: '/admin/users' },
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

            <nav className="flex-1 px-6 space-y-8 mt-4 overflow-y-auto relative z-10 custom-scrollbar">
                <div>
                    <p className="text-[10px] font-black text-blue-300/40 uppercase px-3 mb-4 tracking-[0.2em]">Menu Principal</p>
                    <div className="space-y-1.5">
                        {menuItems.map((item) => (
                            <NavItem key={item.href} item={item} active={pathname === item.href} />
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-blue-300/40 uppercase px-3 mb-4 tracking-[0.2em]">Administration</p>
                    <div className="space-y-1.5">
                        {adminItems.map((item) => (
                            <NavItem key={item.href} item={item} active={pathname === item.href} />
                        ))}
                        <NavItem 
                            item={{ icon: <Settings size={20} />, label: 'Configuration', href: '/settings' }} 
                            active={pathname === '/settings'} 
                        />
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
                        <button className="p-1.5 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ item, active }: { item: any, active: boolean }) {
    return (
        <Link
            href={item.href}
            className={`group flex items-center p-3 text-sm font-bold rounded-xl cursor-pointer transition-all relative overflow-hidden ${
                active 
                    ? 'bg-white text-blue-700 shadow-xl shadow-blue-900/40' 
                    : 'text-blue-100 hover:bg-white/10'
            }`}
        >
            <span className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
            </span>
            <span className="ml-3 relative z-10">{item.label}</span>
            
            {item.badge && (
                <div className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-100'}`}>
                    {item.badge}
                </div>
            )}
            
            {active && (
                <motion.div 
                    layoutId="active-glow"
                    className="absolute right-0 top-0 h-full w-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                />
            )}
            
            {!active && (
                <ChevronRight 
                    size={14} 
                    className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-300" 
                />
            )}
        </Link>
    );
}
