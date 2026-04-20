"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Settings,
    Users,
    CreditCard,
    ArrowLeft,
    Shield,
    Bell
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
    { name: "Général", href: "/settings/general", icon: Settings },
    { name: "Membres", href: "/settings/members", icon: Users },
    { name: "Facturation", href: "/settings/billing", icon: CreditCard },
    { name: "Sécurité", href: "/settings/security", icon: Shield },
    { name: "Notifications", href: "/settings/notifications", icon: Bell },
];

export default function SettingsSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen glass border-r flex flex-col p-6">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
            >
                <motion.div
                    whileHover={{ x: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <ArrowLeft size={18} />
                </motion.div>
                <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>

            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Réglages
            </h2>

            <nav className="space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={18} className={isActive ? "text-primary" : "group-hover:text-primary transition-colors"} />
                            <span className="text-sm font-medium">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
