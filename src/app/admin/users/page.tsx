'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Users, 
  Shield, 
  MoreVertical, 
  Plus, 
  Search,
  CheckCircle,
  XCircle,
  Settings2,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

export default function UserManagementPage() {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock data - In production, this would be fetched from your /api/users
  const users = [
    { id: 1, name: 'Jean Stock', email: 'jean@creditguard.com', role: 'Stock Manager', status: 'Active', phone: '+243 812 345 678' },
    { id: 2, name: 'Marie Finance', email: 'marie@creditguard.com', role: 'Finance Admin', status: 'Active', phone: '+243 899 888 777' },
    { id: 3, name: 'Paul Viewer', email: 'paul@creditguard.com', role: 'Viewer', status: 'Inactive', phone: '+243 855 444 333' },
  ];

  const permissions = [
    { id: 'stock.transfer', label: 'Transfert de Stock', description: 'Autoriser le déplacement de produits entre entrepôts', status: 'inherited' },
    { id: 'report.generate', label: 'Génération de Rapports', description: 'Accès aux outils d\'export et analytics', status: 'allow' },
    { id: 'user.manage', label: 'Gestion Utilisateurs', description: 'Créer et modifier des comptes', status: 'deny' },
    { id: 'loan.approve', label: 'Approbation de Prêt', description: 'Pouvoir valider les dossiers de crédit', status: 'inherited' },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Accès</h2>
              <p className="text-gray-500 text-sm mt-1">Architecture Hybrid RBAC (Rôles + Overrides Individuels)</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-semibold">
              <Plus size={18} /> Nouvel Utilisateur
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Utilisateurs</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rôles Définis</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">6</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overrides Actifs</p>
              <h3 className="text-2xl font-bold text-orange-500 mt-1">12</h3>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/50">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Nom, email ou téléphone..." 
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">Tous</button>
                <button className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">Administrateurs</button>
                <button className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">Managers</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                  <tr>
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Identifiants</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Contrôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-[11px] text-gray-400 font-medium tracking-wide">ID: CG-{user.id}092</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400" /> {user.email}
                          </p>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" /> {user.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                          <Shield size={12} /> {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                          <span className={`text-xs font-semibold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedUser(user); setShowOverrideModal(true); }}
                          className="p-2.5 bg-gray-50 dark:bg-slate-700/50 hover:bg-blue-600 hover:text-white rounded-xl text-gray-400 transition-all shadow-sm active:scale-90"
                          title="Gérer les permissions"
                        >
                          <Settings2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Override Modal (HRBAC+ Matrix) */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Éditeur de Permissions HRBAC+</h3>
                  <p className="text-sm text-gray-500 mt-1">Configuration spécifique pour <span className="text-blue-600 font-bold">{selectedUser?.name}</span></p>
                </div>
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                <XCircle size={28} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-8 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 mb-4">
                <AlertCircle className="text-blue-600" size={20} />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Les <strong>Overrides</strong> (Autoriser/Refuser) priment sur les permissions par défaut du rôle <span className="font-bold underline">{selectedUser?.role}</span>.
                </p>
              </div>

              {permissions.map(perm => (
                <div key={perm.id} className="group flex items-center justify-between p-5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{perm.label}</p>
                      <span className="text-[9px] font-mono bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-400">{perm.id}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{perm.description}</p>
                  </div>
                  
                  <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all ${
                      perm.status === 'inherited' 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}>
                      HÉRITÉ
                    </button>
                    <button className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      perm.status === 'allow' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                        : 'text-gray-400 hover:text-green-600'
                    }`}>
                      <Unlock size={10} /> ALLOW
                    </button>
                    <button className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      perm.status === 'deny' 
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                        : 'text-gray-400 hover:text-red-600'
                    }`}>
                      <Lock size={10} /> DENY
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center gap-6">
              <button onClick={() => setShowOverrideModal(false)} className="text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all">
                Annuler
              </button>
              <button className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-extrabold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                Enregistrer les Modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
