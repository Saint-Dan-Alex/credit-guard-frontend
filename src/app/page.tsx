'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  BarChart3,
  AlertCircle,
  TrendingUp,
  Wallet,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tableau de Bord</h2>
              <p className="text-gray-500 text-sm">Aperçu en temps réel de votre performance de crédit</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <TrendingUp size={14} /> +12.5% vs mois dernier
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Prêts Actifs"
              value="1,248"
              icon={<Wallet className="text-blue-500" />}
              desc="84 nouveaux ce mois"
            />
            <StatCard
              title="Taux de Défaut"
              value="3.21%"
              icon={<AlertCircle className="text-red-500" />}
              desc="En baisse de 0.5%"
              danger
            />
            <StatCard
              title="Score Moyen"
              value="78/100"
              icon={<TrendingUp className="text-green-500" />}
              desc="Fiabilité élevée"
            />
            <StatCard
              title="Portefeuille Total"
              value="4.5M $"
              icon={<BarChart3 className="text-orange-500" />}
              desc="Encours global"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-700 dark:text-gray-200">Demandes Récentes</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">Tout voir</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <TableRow name="Marie Nzambe" amount="5,000 $" score={82} status="APPROVED" />
                    <TableRow name="Jean-Paul Bodo" amount="12,500 $" score={64} status="PENDING" />
                    <TableRow name="Alice Kapinga" amount="3,000 $" score={42} status="REJECTED" />
                    <TableRow name="Socio Agri Coop" amount="45,000 $" score={88} status="APPROVED" />
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card h-fit">
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-6">Analyse de Risque IA</h3>
              <div className="space-y-6">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="text-orange-600" size={20} />
                    <div>
                      <p className="text-sm font-bold text-orange-800 dark:text-orange-200">Alerte Recouvrement</p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">12 clients ont dépassé la date d'échéance de 15 jours.</p>
                      <button className="mt-3 text-xs font-bold text-orange-900 dark:text-orange-100 underline decoration-2 underline-offset-4">
                        Initier relance automatique
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500" size={18} />
                    <span className="text-sm">Health Score</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">A+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc, danger = false }: any) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold mt-1 dark:text-white">{value}</h4>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          {icon}
        </div>
      </div>
      <p className={`text-xs mt-4 ${danger ? 'text-red-500' : 'text-green-500'} font-medium`}>
        {desc}
      </p>
    </div>
  );
}

function TableRow({ name, amount, score, status }: any) {
  const statusColors: any = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
      <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">{name}</td>
      <td className="px-4 py-4">{amount}</td>
      <td className="px-4 py-4 text-center">
        <div className="inline-flex flex-col items-center">
          <span className={`text-sm font-bold ${score > 70 ? 'text-green-600' : score > 50 ? 'text-orange-500' : 'text-red-500'}`}>
            {score}
          </span>
          <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <div className={`h-full ${score > 70 ? 'bg-green-500' : score > 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${statusColors[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
