'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
  BarChart3,
  AlertCircle,
  TrendingUp,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Calendar,
  Filter
} from 'lucide-react';

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Tableau de Bord
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 dark:text-slate-400 mt-1 font-medium"
              >
                Aperçu de la performance et analyse de risque IA
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                <Calendar size={18} /> Jan 2026 - Mai 2026
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                <Filter size={18} /> Filtrer
              </button>
            </motion.div>
          </div>

          {/* KPI Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <StatCard
              title="Prêts Actifs"
              value="1,248"
              icon={<Wallet className="text-white" size={24} />}
              iconBg="bg-blue-600"
              trend="+12.5%"
              trendUp={true}
              desc="84 nouveaux ce mois"
            />
            <StatCard
              title="Taux de Défaut"
              value="3.21%"
              icon={<AlertCircle className="text-white" size={24} />}
              iconBg="bg-red-500"
              trend="-0.5%"
              trendUp={false}
              desc="Optimisation en cours"
            />
            <StatCard
              title="Score Moyen"
              value="78/100"
              icon={<TrendingUp className="text-white" size={24} />}
              iconBg="bg-green-500"
              trend="+4.2%"
              trendUp={true}
              desc="Qualité de portefeuille"
            />
            <StatCard
              title="Portefeuille"
              value="4.5M $"
              icon={<BarChart3 className="text-white" size={24} />}
              iconBg="bg-amber-500"
              trend="+8.1%"
              trendUp={true}
              desc="Encours global"
            />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Applications Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2 card p-1 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 pb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  Demandes Récentes
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded-full text-slate-500">Live</span>
                </h3>
                <button className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">Tout voir</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Scoring</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <TableRow 
                      name="Marie Nzambe" 
                      email="marie.n@gmail.com"
                      avatar="MN"
                      amount="5,000 $" 
                      score={82} 
                      status="APPROVED" 
                    />
                    <TableRow 
                      name="Jean-Paul Bodo" 
                      email="jp.bodo@outlook.fr"
                      avatar="JB"
                      amount="12,500 $" 
                      score={64} 
                      status="PENDING" 
                    />
                    <TableRow 
                      name="Alice Kapinga" 
                      email="alice.k@rdc.cd"
                      avatar="AK"
                      amount="3,000 $" 
                      score={42} 
                      status="REJECTED" 
                    />
                    <TableRow 
                      name="Socio Agri Coop" 
                      email="contact@agricoop.org"
                      avatar="SA"
                      amount="45,000 $" 
                      score={88} 
                      status="APPROVED" 
                    />
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* AI Risk Analysis */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="card p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-xl shadow-indigo-500/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md">
                    <Zap className="text-blue-400" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">Intelligence Artificielle</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">Analyse de Risque</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">Le moteur CreditGuard a identifié 12 dossiers nécessitant une attention immédiate.</p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-amber-400 mt-1" size={18} />
                      <div>
                        <p className="text-sm font-bold">Alerte Recouvrement</p>
                        <p className="text-xs text-slate-400 mt-1">12 clients ont dépassé la date d'échéance de 15 jours.</p>
                        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="h-full bg-amber-400"
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle2 className="text-green-400" size={18} />
                        </div>
                        <span className="text-sm font-bold">Santé Portefeuille</span>
                      </div>
                      <span className="text-lg font-black text-green-400">A+</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]">
                  Générer rapport IA
                </button>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton label="Nouveau Client" color="bg-blue-50 text-blue-600" />
                  <QuickActionButton label="Dossier Prêt" color="bg-indigo-50 text-indigo-600" />
                  <QuickActionButton label="Collecte" color="bg-amber-50 text-amber-600" />
                  <QuickActionButton label="Recouvrement" color="bg-red-50 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, trend, trendUp, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${iconBg} rounded-2xl shadow-lg`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-[0.1em]">{title}</p>
        <h4 className="text-3xl font-black mt-1 dark:text-white tabular-nums">{value}</h4>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">{desc}</span>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TableRow({ name, email, avatar, amount, score, status }: any) {
  const statusConfig: any = {
    APPROVED: { label: 'Approuvé', color: 'bg-green-500/10 text-green-600 border-green-200/50' },
    PENDING: { label: 'En attente', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50' },
    REJECTED: { label: 'Refusé', color: 'bg-red-500/10 text-red-600 border-red-200/50' },
  };

  const currentStatus = statusConfig[status];

  return (
    <motion.tr 
      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
      className="transition-colors group cursor-pointer"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700">
            {avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-black text-slate-700 dark:text-slate-200 tabular-nums">{amount}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black ${score > 70 ? 'text-green-600' : score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {score}/100
            </span>
          </div>
          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full ${score > 70 ? 'bg-green-500' : score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
            ></motion.div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </button>
      </td>
    </motion.tr>
  );
}

function QuickActionButton({ label, color }: any) {
  return (
    <button className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm ${color}`}>
      <div className="p-2 rounded-xl bg-white/50">
        <Zap size={16} />
      </div>
      {label}
    </button>
  );
}
