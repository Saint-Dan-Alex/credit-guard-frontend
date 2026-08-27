'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Shield, 
  Layers, 
  Check, 
  X, 
  RefreshCw, 
  Search, 
  Lock, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { api } from '@/lib/api';

export default function RolesMatrixPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permsData] = await Promise.all([
        api.getRoles().catch(() => []),
        api.getPermissions().catch(() => []),
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
    } catch (err) {
      console.error('Failed to load matrix data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter permissions
  const categories = ['ALL', 'product', 'stock', 'client', 'application', 'loan', 'recovery', 'report', 'user'];

  const filteredPermissions = permissions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.name.startsWith(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Matrice des Rôles & Permissions HRBAC</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-xs font-black">
                  RPBAC+ Engine
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Visualisation institutionnelle des rôles système, des droits CRUD et des fonctions additives métier
              </p>
            </div>
            <button 
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-sm transition-all"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          </div>

          {/* Quick Explanation Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Sparkles className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base">Modèle d'Accès Hybride Institutionnel (HRBAC)</h3>
                <p className="text-blue-200 text-xs mt-1 leading-relaxed max-w-4xl">
                  Cette matrice définit les droits de base pour chaque profil de l'organisation. Lorsqu'un utilisateur a besoin d'un accès spécifique sans modifier le rôle global, l'administrateur applique un <strong>User Override</strong> (ALLOW pour accorder une fonction additive ou DENY pour restreindre un privilège).
                </p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'ALL' ? 'Tous les modules' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une permission..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-900/80 text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4 sticky left-0 bg-gray-50 dark:bg-slate-900 z-10 w-80">
                      Permission & Description
                    </th>
                    {roles.map(role => (
                      <th key={role.id} className="px-4 py-4 text-center min-w-[120px]">
                        <span className="text-gray-900 dark:text-white font-bold block">{role.name}</span>
                        <span className="text-[9px] text-gray-400 lowercase font-normal">
                          {role._count?.users || 0} membre(s)
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={roles.length + 1} className="px-6 py-12 text-center text-gray-400">
                        Chargement de la matrice de sécurité...
                      </td>
                    </tr>
                  ) : filteredPermissions.length === 0 ? (
                    <tr>
                      <td colSpan={roles.length + 1} className="px-6 py-12 text-center text-gray-400">
                        Aucune permission trouvée pour ce filtre.
                      </td>
                    </tr>
                  ) : (
                    filteredPermissions.map(perm => (
                      <tr key={perm.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="px-6 py-3.5 sticky left-0 bg-white dark:bg-slate-800 z-10 border-r border-gray-100 dark:border-slate-800">
                          <p className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                            {perm.name}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate max-w-xs">{perm.description}</p>
                        </td>
                        {roles.map(role => {
                          const hasPermission = role.permissions?.some(
                            (rp: any) => rp.permission?.name === perm.name
                          );

                          return (
                            <td key={role.id} className="px-4 py-3.5 text-center">
                              {hasPermission ? (
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-xs">
                                  <Check size={16} strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gray-100/60 dark:bg-slate-700/30 text-gray-300 dark:text-slate-600">
                                  <span className="text-lg leading-none select-none">·</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
