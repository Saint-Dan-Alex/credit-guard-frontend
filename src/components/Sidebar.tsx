import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Users,
    Wallet,
    AlertCircle,
    BarChart3,
    Settings
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de Bord', href: '/' },
        { icon: <FileText size={20} />, label: 'Demandes', href: '/applications' },
        { icon: <Users size={20} />, label: 'Clients', href: '/clients' },
        { icon: <Wallet size={20} />, label: 'Prêts Actifs', href: '/loans' },
        { icon: <AlertCircle size={20} />, label: 'Recouvrement', href: '/recovery' },
        { icon: <BarChart3 size={20} />, label: 'Rapports', href: '/reports' },
    ];

    return (
        <aside className="w-64 bg-[#1E40AF] text-white flex-col hidden lg:flex shrink-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight">CreditGuard</h1>
                <p className="text-blue-200 text-xs mt-1 italic">Intelligent Lending Hub</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center p-3 text-sm font-medium rounded-lg cursor-pointer transition-colors ${pathname === item.href ? 'bg-blue-600 text-white shadow-inner' : 'text-blue-100 hover:bg-blue-600/50'
                            }`}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                        {pathname === item.href && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-blue-700">
                <Link
                    href="/settings"
                    className="flex items-center p-3 text-sm font-medium text-blue-100 rounded-lg hover:bg-blue-600/50 transition-colors"
                >
                    <Settings size={20} />
                    <span className="ml-3">Paramètres</span>
                </Link>
                <div className="mt-4 flex items-center p-2 rounded-lg bg-blue-800">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">A</div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-blue-300">Manager Pro</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
