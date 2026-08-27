'use client';

import React, { useEffect, useState } from 'react';
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
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, appsData] = await Promise.all([
        api.getDashboardStats().catch(() => ({
          activeLoansCount: 0,
          totalPortfolio: 0,
          totalDisbursed: 0,
          totalCollected: 0,
          averageScore: 78,
          defaultRate: 2.5,
          overdueLoansCount: 0,
          overdueAmount: 0,
          totalApplicationsCount: 0,
        })),
        api.getApplications().catch(() => []),
      ]);
      setStats(statsData);
      setRecentApps(appsData.slice(0, 5));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
                Aperçu de la performance financière et analyse de risque IA
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <button 
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
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
              value={stats?.activeLoansCount?.toLocaleString() || '0'}
              icon={<Wallet className="text-white" size={24} />}
              iconBg="bg-blue-600"
              trend="+12.5%"
              trendUp={true}
              desc="Encours en cours"
            />
            <StatCard
              title="Taux de Défaut (NPL)"
              value={`${stats?.defaultRate || 0}%`}
              icon={<AlertCircle className="text-white" size={24} />}
              iconBg={stats?.defaultRate > 5 ? 'bg-red-500' : 'bg-green-500'}
              trend={stats?.defaultRate > 5 ? '+0.8%' : '-0.5%'}
              trendUp={stats?.defaultRate <= 5}
              desc="PAR / Risque Global"
            />
            <StatCard
              title="Score Risque Moyen"
              value={`${stats?.averageScore || 0}/100`}
              icon={<TrendingUp className="text-white" size={24} />}
              iconBg="bg-emerald-500"
              trend="+3.4%"
              trendUp={true}
              desc="Qualité du portefeuille"
            />
            <StatCard
              title="Portefeuille Total"
              value={`$${(stats?.totalPortfolio || 0).toLocaleString()}`}
              icon={<BarChart3 className="text-white" size={24} />}
              iconBg="bg-amber-500"
              trend="+8.1%"
              trendUp={true}
              desc="Encours restant dû"
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
                  Demandes de Prêt Récentes
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Temps Réel</span>
                </h3>
                <a href="/applications" className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                  Tout voir
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Scoring IA</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentApps.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                          Aucune demande enregistrée pour le moment.
                        </td>
                      </tr>
                    ) : (
                      recentApps.map((app) => (
                        <TableRow 
                          key={app.id}
                          id={app.id}
                          name={`${app.client?.firstName} ${app.client?.lastName}`}
                          email={app.client?.email || app.client?.phone}
                          avatar={`${app.client?.firstName?.[0] || ''}${app.client?.lastName?.[0] || ''}`}
                          amount={`$${app.amount?.toLocaleString()}`}
                          score={app.scoring?.score || 50}
                          status={app.status}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* AI Risk Analysis & Recommendations */}
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
                
                <h3 className="text-xl font-bold mb-2">Moteur Décisionnel XAI</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Surveillance continue du portefeuille et évaluation automatique des ratios d'endettement DTI.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-amber-400 mt-1" size={18} />
                      <div>
                        <p className="text-sm font-bold">Impayés & Recouvrement</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {stats?.overdueLoansCount || 0} dossier(s) en souffrance nécessitant une relance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle2 className="text-green-400" size={18} />
                        </div>
                        <span className="text-sm font-bold">Qualité du Portefeuille</span>
                      </div>
                      <span className="text-lg font-black text-green-400">
                        {stats?.averageScore >= 75 ? 'A+' : stats?.averageScore >= 60 ? 'B' : 'C'}
                      </span>
                    </div>
                  </div>
                </div>

                <a 
                  href="/applications/tasks"
                  className="block text-center w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  Examiner les Tâches & Validation
                </a>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a href="/clients" className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs text-center hover:bg-blue-100 transition-colors">
                    Nouveau Client
                  </a>
                  <a href="/applications" className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs text-center hover:bg-indigo-100 transition-colors">
                    Nouvelle Demande
                  </a>
                  <a href="/loans" className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl font-bold text-xs text-center hover:bg-amber-100 transition-colors">
                    Encaisser Paiement
                  </a>
                  <a href="/recovery" className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-xs text-center hover:bg-red-100 transition-colors">
                    Relances Impayés
                  </a>
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
      </div>
    </motion.div>
  );
}

function TableRow({ name, email, avatar, amount, score, status }: any) {
  const statusConfig: any = {
    APPROVED: { label: 'Approuvé', color: 'bg-green-500/10 text-green-600 border-green-200/50' },
    SUBMITTED: { label: 'Soumis', color: 'bg-blue-500/10 text-blue-600 border-blue-200/50' },
    UNDER_REVIEW: { label: 'En Analyse', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50' },
    REJECTED: { label: 'Refusé', color: 'bg-red-500/10 text-red-600 border-red-200/50' },
    DISBURSED: { label: 'Décaissé', color: 'bg-purple-500/10 text-purple-600 border-purple-200/50' },
  };

  const currentStatus = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700' };

  return (
    <motion.tr 
      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
      className="transition-colors group"
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
            <div 
              className={`h-full rounded-full ${score > 70 ? 'bg-green-500' : score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <a href="/applications" className="text-xs font-bold text-blue-600 hover:text-blue-700">
          Détails →
        </a>
      </td>
    </motion.tr>
  );
}
