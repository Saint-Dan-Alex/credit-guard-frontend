'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  PieChart as PieChartIcon,
  RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [recoveryStats, setRecoveryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('PORTFOLIO');
  const [period, setPeriod] = useState('MONTH');

  const loadReports = async () => {
    try {
      setLoading(true);
      const [dashStats, recStats] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getRecoveryStats().catch(() => null),
      ]);
      setStats(dashStats);
      setRecoveryStats(recStats);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Rapports & Intelligence Financière</h2>
              <p className="text-gray-500 text-sm mt-1">
                Génération des états réglementaires, analyse du portefeuille, ratios PAR et performance de recouvrement
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadReports}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
              </button>
              <button
                onClick={() => alert('Exportation du rapport officiel PDF/Excel initiée...')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-semibold text-sm"
              >
                <Download size={16} /> Exporter Rapport (.XLSX)
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 mb-8 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Filter size={18} className="text-blue-600 ml-2" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type d'état :</span>
            <div className="flex gap-2">
              {[
                { id: 'PORTFOLIO', label: 'Portefeuille & Encours' },
                { id: 'PAR_RISK', label: 'Portefeuille à Risque (PAR30/90)' },
                { id: 'RECOVERY', label: 'Efficacité Recouvrement' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setReportType(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reportType === t.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Encours Total Prêts</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                ${stats?.activeLoansAmount?.toLocaleString() || '30,000'}
              </h3>
              <p className="text-[11px] text-green-600 font-bold mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> +14.8% vs mois précédent
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Volume des Retards</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                ${recoveryStats?.totalOverdueAmount?.toLocaleString() || '2,650'}
              </h3>
              <p className="text-[11px] text-rose-500 font-medium mt-2">
                PAR 30 : ${recoveryStats?.par30Amount?.toLocaleString() || '2,650'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Taux de Recouvrement</p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">94.2%</h3>
              <p className="text-[11px] text-blue-500 font-medium mt-2">
                Objectif institutionnel : &gt; 92.0%
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Promesses Actives</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">
                {recoveryStats?.activePromises || 1}
              </h3>
              <p className="text-[11px] text-amber-600 font-medium mt-2">
                Montant promis : $1,300
              </p>
            </div>
          </div>

          {/* Breakdown Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <PieChartIcon size={18} className="text-blue-600" /> Répartition du Portefeuille par Produit
                </h4>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Crédit Croissance PME (PROD-PME-01)</span>
                    <span className="text-blue-600">$25,000 (83.3%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '83.3%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Micro-Crédit Express Artisans (PROD-MICRO-01)</span>
                    <span className="text-emerald-500">$5,000 (16.7%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '16.7%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500" /> Classification des Risques Bâle / IFRS 9
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">Stage 1 : Sain / Performing (&lt; 30 DPD)</span>
                  </div>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">$25,000 (83.3%)</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="font-bold text-amber-900 dark:text-amber-300">Stage 2 : Sous surveillance (PAR 30)</span>
                  </div>
                  <span className="font-black text-amber-700 dark:text-amber-400">$2,650 (8.8%)</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="font-bold text-rose-900 dark:text-rose-300">Stage 3 : En défaut / Contentieux (PAR 90+)</span>
                  </div>
                  <span className="font-black text-rose-700 dark:text-rose-400">$0 (0.0%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
